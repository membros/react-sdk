"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { setCookie, destroyCookie, parseCookies } from "nookies";
import { Toaster, toast } from "sonner";
import {
  AuthContextType,
  User,
  Subscription,
  AuthProviderProps,
  LoginOptions,
  LogoutOptions,
  GetTokenOptions,
} from "./types";
import { MEMBROS_API_URL } from "./constants";

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
  clientId,
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
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

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

  const loadUserSubscriptions = async (email: string, currentToken: string) => {
    setInternalIsLoadingSubscriptions(true);
    try {
      const response = await fetch(
        `${MEMBROS_API_URL}/subscription/account/email/${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );

      if (response.status === 404) {
        setUserSubscriptions([]);
        return;
      }

      const subscriptions: Subscription[] = await response.json();
      setUserSubscriptions(subscriptions);
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
        await loadUserSubscriptions(userData.email, accessToken);
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
    const authUrl = `http://localhost:3003/oauth2/${clientId}?flow=redirect&redirect_uri=${encodeURIComponent(
      redirectUri
    )}`;
    window.location.href = authUrl;
  };

  const loginWithPopup = async (options?: LoginOptions) => {
    return new Promise<void>((resolve, reject) => {
      const redirectOrigin = window.location.origin;

      // Use the OAuth2 page with popup flow
      const authUrl = `http://localhost:3003/oauth2/${clientId}?flow=popup&redirect_origin=${encodeURIComponent(
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
        if (event.origin !== "http://localhost:3003") return;

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
      // For debugging with mock codes, simulate token exchange
      if (authorizationCode.startsWith("auth_code_")) {
        // Simulate a successful token exchange
        const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const mockRefreshToken = `mock_refresh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        setCookie(null, "nextauth.token", mockToken, {
          path: "/",
          maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
        });
        setCookie(null, "nextauth.refreshToken", mockRefreshToken, {
          path: "/",
          maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
        });
        
        // Mock user data for testing
        const mockUser = {
          id: "mock-user-id",
          name: "Mock User",
          email: "mock@example.com",
          plano: "vestibulando" as const,
        };
        
        setUser(mockUser);
        setToken(mockToken);
        setInternalIsLoadingUser(false);
        setInternalIsLoadingSubscriptions(false);
        
        toast.success("Login Successful", { description: "You are now logged in (mock mode)." });
        return;
      }

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
        toast.success("Login Successful", { description: "You are now logged in." });
      } else {
        toast.error("Login Failed", { description: responseData.message || "Failed to retrieve token." });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Server Error", { description: "An error occurred while fetching the token." });
    }
  };

  const logout = (options?: LogoutOptions) => {
    setIsLoggingOut(true);
    destroyCookie(null, "nextauth.token");
    destroyCookie(null, "nextauth.refreshToken");
    setUser(null);
    setToken(null);
    setUserSubscriptions([]);
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
    if (!userSubscriptions || userSubscriptions.length === 0) {
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
        publicKey: clientId,
        hasActivePlan,
        userSubscriptions,
      }}
    >
      <Toaster richColors />
      {children}
    </AuthContext.Provider>
  );
};
