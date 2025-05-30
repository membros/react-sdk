"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { setCookie, destroyCookie, parseCookies } from "./utils/cookies";
import { Toaster, toast } from "sonner";
import {
  AuthContextType,
  User,
  Subscription,
  AuthProviderProps,
  LoginOptions,
  LogoutOptions,
  GetTokenOptions,
  Project,
  ProjectCreator,
} from "./types";
import { MEMBROS_API_URL, MEMBROS_ID_URL } from "./constants";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an MembrosProvider");
  }
  return context;
};

export const signOut = () => {
  destroyCookie(null, "nextauth.token");
  destroyCookie(null, "nextauth.refreshToken");
  window.location.reload();
};

export const MembrosProvider = ({
  children,
  projectId,
  authorizationParams,
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [internalIsLoadingUser, setInternalIsLoadingUser] = useState(true);
  const [internalIsLoadingSubscriptions, setInternalIsLoadingSubscriptions] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [adimplent, setAdimplent] = useState<boolean>(false);
  const [originalUser, setOriginalUser] = useState<User | null>(null);
  const [userSubscriptions, setUserSubscriptions] = useState<Subscription[]>(
    []
  );
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [project, setProject] = useState<Project | null>(null);
  const [projectPlans, setProjectPlans] = useState<string[]>([]);
  const [isLoadingProject, setIsLoadingProject] = useState<boolean>(true);
  const [projectError, setProjectError] = useState<Error | null>(null);

  const isAuthenticated = !!user;
  const isLoading = internalIsLoadingUser || internalIsLoadingSubscriptions;

  useEffect(() => {
    const loadUserFromCookies = async () => {
      setInternalIsLoadingUser(true);
      setInternalIsLoadingSubscriptions(true);
      
      // First check for authorization code in URL (for redirect flow)
      const urlParams = new URLSearchParams(window.location.search);
      const authCode = urlParams.get('code');
      
      if (authCode) {
        console.log("Found authorization code in URL, processing...");
        await login(authCode);
        // Clean up URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        return;
      }
      
      // If no auth code, check for existing token in cookies
      const { "nextauth.token": accessToken } = parseCookies();
      if (accessToken) {
        await loadUserByToken(accessToken);
      } else {
        setInternalIsLoadingUser(false);
        setInternalIsLoadingSubscriptions(false);
      }
    };
    loadUserFromCookies();
  }, []);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  // Reload user subscriptions when project plans are loaded
  useEffect(() => {
    if (user && token && projectPlans.length > 0) {
      loadUserSubscriptions(user.email, token, projectPlans);
    }
  }, [projectPlans, user, token]);

  // Update currentSubscription whenever userSubscriptions change
  useEffect(() => {
    if (userSubscriptions && Array.isArray(userSubscriptions) && userSubscriptions.length > 0) {
      const activeSubscriptions = userSubscriptions.filter(sub => sub.status === 'active');
      if (activeSubscriptions.length > 0) {
        setCurrentSubscription(activeSubscriptions[0]);
      } else {
        setCurrentSubscription(userSubscriptions[0]);
      }
    } else {
      setCurrentSubscription(null);
    }
  }, [userSubscriptions]);

  const loadUserSubscriptions = async (email: string, currentToken: string, planIds: string[]) => {
    setInternalIsLoadingSubscriptions(true);
    try {
      console.log("Loading user subscriptions for email:", email);
      console.log("Plan IDs:", planIds);

      // If no planIds provided, we'll send an empty array to get all available subscriptions
      // The API endpoint expects planIds in the request body
      const requestBody = { planIds: planIds || [] };
      
      const response = await fetch(
        `${MEMBROS_API_URL}/subscription/account/email/${email}/plans`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentToken}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.status === 404) {
        setUserSubscriptions([]);
        return;
      }

      const subscriptions: Subscription[] = await response.json();
      // Ensure subscriptions is always an array
      setUserSubscriptions(Array.isArray(subscriptions) ? subscriptions : []);
    } catch (error) {
      console.error("An unexpected error occurred while loading subscriptions", error);
      setUserSubscriptions([]);
    } finally {
      setInternalIsLoadingSubscriptions(false);
    }
  };

  const loadUserByToken = async (accessToken: string) => {
    try {
      setError(null);
      setInternalIsLoadingUser(true);
      setToken(accessToken);
      setCookie(null, "nextauth.token", accessToken, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
      });

      const response = await fetch(`${MEMBROS_API_URL}/whoami`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.status === 401) {
        signOut();
        setInternalIsLoadingUser(false);
        setInternalIsLoadingSubscriptions(false);
        return;
      }

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setInternalIsLoadingUser(false);
        await loadUserSubscriptions(userData.email, accessToken, projectPlans);
      } else {
        console.error("Failed to load user data");
        setUser(null);
        setToken(null);
        destroyCookie(null, "nextauth.token");
        destroyCookie(null, "nextauth.refreshToken");
        setInternalIsLoadingUser(false);
        setInternalIsLoadingSubscriptions(false);
      }
    } catch (error) {
      console.error("Error in loadUserByToken:", error);
      setError(error as Error);
      setUser(null);
      setToken(null);
      destroyCookie(null, "nextauth.token");
      destroyCookie(null, "nextauth.refreshToken");
      setInternalIsLoadingUser(false);
      setInternalIsLoadingSubscriptions(false);
    }
  };

  const loginWithRedirect = async (options?: LoginOptions) => {
    const redirectUri =
      options?.authorizationParams?.redirect_uri ||
      options?.redirectUri ||
      authorizationParams?.redirect_uri ||
      window.location.origin;

    // Use the OAuth2 page with redirect flow
    const authUrl = `${MEMBROS_ID_URL}/oauth2/${projectId}?flow=redirect&redirect_uri=${encodeURIComponent(
      redirectUri
    )}`;
    window.location.href = authUrl;
  };

  const loginWithPopup = async (options?: LoginOptions) => {
    return new Promise<void>((resolve, reject) => {
      const redirectOrigin = window.location.origin;

      // Use the OAuth2 page with popup flow
      const authUrl = `${MEMBROS_ID_URL}/oauth2/${projectId}?flow=popup&redirect_origin=${encodeURIComponent(
        redirectOrigin
      )}`;

      const popup = window.open(authUrl, "auth-popup", "width=500,height=600");

      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          reject(new Error("Popup was closed"));
        }
      }, 1000);

      const messageHandler = (event: MessageEvent) => {
        // Allow localhost for debugging
        if (event.origin !== MEMBROS_ID_URL) return;

        if (event.data.type === "oauth" && event.data.code) {
          clearInterval(checkClosed);
          popup?.close();
          window.removeEventListener("message", messageHandler);
          login(event.data.code).then(() => resolve()).catch(reject);
        }
      };

      window.addEventListener("message", messageHandler);
    });
  };

  const getAccessTokenSilently = async (
    options?: GetTokenOptions
  ): Promise<string> => {
    if (!token) {
      throw new Error("No access token available. User might need to log in again.");
    }
    return token;
  };

  const login = async (authorizationCode: string) => {
    try {
      // Real token exchange for production
      const res = await fetch(`${MEMBROS_API_URL}/user/auth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorization_code: authorizationCode }),
      });
      const responseData = await res.json();
      if (res.ok && responseData.access_token) {
        setCookie(null, "nextauth.token", responseData.access_token, {
          path: "/",
          maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
        });
        setCookie(null, "nextauth.refreshToken", responseData.refresh_token, {
          path: "/",
          maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
        });
        await loadUserByToken(responseData.access_token);
        toast.success("Login realizado com sucesso", { description: "Agora você está logado." });
      } else {
        toast.error("Falha ao realizar login", { description: responseData.message || "Falha ao realizar login." });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Erro ao realizar login", { description: "Ocorreu um erro ao realizar login." });
    }
  };

  const logout = (options?: LogoutOptions) => {
    setIsLoggingOut(true);
    destroyCookie(null, "nextauth.token");
    destroyCookie(null, "nextauth.refreshToken");
    setUser(null);
    setToken(null);
    setUserSubscriptions([]);
    setCurrentSubscription(null);
    setOriginalUser(null);

    setInternalIsLoadingUser(false);
    setInternalIsLoadingSubscriptions(false);

    const returnTo =
      options?.logoutParams?.returnTo ||
      options?.returnTo ||
      window.location.origin;

    if (typeof window !== "undefined") {
      window.location.href = returnTo;
    }
  };

  const hasActivePlan = (planIds?: string[]): boolean => {
    if (!userSubscriptions || !Array.isArray(userSubscriptions) || userSubscriptions.length === 0) {
      return false;
    }
    if (!planIds || planIds.length === 0) {
      return userSubscriptions.some(sub => sub.status === 'active');
    }
    for (const subscription of userSubscriptions) {
      const subscriptionPlanId = String(subscription.plan.id);
      if (planIds.includes(subscriptionPlanId)) {
        if (subscription.status === 'active') {
          return true;
        }
      }
    }
    return false;
  };

  const getCurrentSubscriptionForPlans = (planIds?: string[]): Subscription | null => {
    if (!userSubscriptions || !Array.isArray(userSubscriptions) || userSubscriptions.length === 0) {
      return null;
    }
    
    // If no planIds specified, return the first active subscription
    if (!planIds || planIds.length === 0) {
      const activeSubscriptions = userSubscriptions.filter(sub => sub.status === 'active');
      return activeSubscriptions.length > 0 ? activeSubscriptions[0] : null;
    }
    
    // Find the first active subscription that matches the planIds
    for (const subscription of userSubscriptions) {
      const subscriptionPlanId = String(subscription.plan.id);
      if (planIds.includes(subscriptionPlanId) && subscription.status === 'active') {
        return subscription;
      }
    }
    
    // If no active subscription matches, find any subscription that matches
    for (const subscription of userSubscriptions) {
      const subscriptionPlanId = String(subscription.plan.id);
      if (planIds.includes(subscriptionPlanId)) {
        return subscription;
      }
    }
    
    return null;
  };

  const overwriteUser = (newUser: User) => {
    if (!originalUser) {
      setOriginalUser(user);
    }
    setUser(newUser);
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  const revertToOriginalUser = () => {
    if (originalUser) {
      setUser(originalUser);
      setOriginalUser(null);
    }
  };

  const loadProject = async () => {
    setIsLoadingProject(true);
    setProjectError(null);
    
    try {
      const response = await fetch(`http://localhost:3000/project/${projectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA3NjAwODBlLWY4ZjMtNGNlZC05ODhmLTViOWNmNzcyYjE5ZSIsIm5hbWUiOiJNRU1CUk9TIFNFUlZJQ09TIERFIElORk9STUFUSUNBIExUREEiLCJlbWFpbCI6ImNvbnRhdG9AbWVtYnJvcy5hcHAiLCJzdGF0dXMiOiJhY3RpdmUiLCJpYXQiOjE3NDYwMjY1ODEsImV4cCI6MTc0ODYxODU4MX0.JexBhP_oSRMuW_PPm9eCOQKWaEUH-ik3iXgfUcOmESM'
        }
      });

      if (response.ok) {
        const projectData: Project = await response.json();
        setProject(projectData);
        
        // Extract plan IDs from the project data
        if (projectData.plan && Array.isArray(projectData.plan)) {
          const planIds = projectData.plan.map(plan => plan.id);
          setProjectPlans(planIds);
        } else {
          setProjectPlans([]);
        }
      } else {
        const errorMessage = `Failed to load project: ${response.status}`;
        setProjectError(new Error(errorMessage));
        console.error(errorMessage);
      }
    } catch (error) {
      console.error("Error loading project:", error);
      setProjectError(error as Error);
    } finally {
      setIsLoadingProject(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        isLoggingOut,
        error,
        loginWithRedirect,
        loginWithPopup,
        logout,
        getAccessTokenSilently,
        originalUser,
        token,
        login,
        loadUserByToken,
        adimplent,
        overwriteUser,
        revertToOriginalUser,
        hasActivePlan,
        getCurrentSubscriptionForPlans,
        userSubscriptions,
        currentSubscription,
        project,
        isLoadingProject,
        projectError,
        loadProject,
        projectPlans,
      }}
    >
      <Toaster richColors />
      {children}
    </AuthContext.Provider>
  );
};
