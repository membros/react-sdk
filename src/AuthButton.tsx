"use client";

import React, { useEffect } from "react";
import { setCookie } from "./utils/cookies";
import { useAuth } from "./AuthContext";
import { AuthButtonProps } from "./types";
import { MEMBROS_API_URL } from "./constants";

// Hook for auth functionality
export const useAuthButton = (
  onAuthSuccess?: (accessToken: string) => void,
  redirectMode: "popup" | "redirect" = "popup"
) => {
  const { loadUserByToken, publicKey } = useAuth();

  const fetchToken = async (authorizationCode: string, useToast?: any) => {
    try {
      const res = await fetch(`${MEMBROS_API_URL}/user/auth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorization_code: authorizationCode }),
      });

      const responseData = await res.json();

      if (res.ok && responseData.access_token) {
        // Store tokens in cookies
        setCookie(null, "nextauth.token", responseData.access_token, {
          path: "/",
        });
        setCookie(null, "nextauth.refreshToken", responseData.refresh_token, {
          path: "/",
        });

        await loadUserByToken(responseData.access_token);

        // Optionally call a callback with the access token
        if (onAuthSuccess) onAuthSuccess(responseData.access_token);

        if (useToast) {
          useToast({
            title: "Authentication Successful",
            description: "Access token received.",
          });
        }
      } else {
        if (useToast) {
          useToast({
            title: "Error",
            description: responseData.message || "Failed to retrieve token.",
            status: "error",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching token:", error);
      if (useToast) {
        useToast({
          title: "Server Error",
          description: "An error occurred while fetching the token.",
          status: "error",
        });
      }
    }
  };

  // Check for auth code in URL on component mount (for redirect mode)
  useEffect(() => {
    if (redirectMode === "redirect") {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code) {
        fetchToken(code);
        // Clean up URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    }
  }, [redirectMode]);

  const handleLogin = (useToast?: any) => {
    if (redirectMode === "redirect") {
      // Full page redirect using OAuth2 page
      const redirectUri = encodeURIComponent(window.location.href);
      const authUrl = `http://localhost:3003/oauth2/${publicKey}?flow=redirect&redirect_uri=${redirectUri}`;
      window.location.href = authUrl;
    } else {
      // Popup window (default behavior)
      const width = 500;
      const height = 550;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      const specs = `width=${width},height=${height},top=${top},left=${left},menubar=no,toolbar=no,location=no,status=no`;

      const redirectOrigin = encodeURIComponent(window.location.origin);
      const authUrl = `http://localhost:3003/oauth2/${publicKey}?flow=popup&redirect_origin=${redirectOrigin}`;
      
      const authWindow = window.open(authUrl, "_blank", specs);

      const handleAuthCodeFromMessage = (event: MessageEvent) => {
        // Allow localhost for debugging
        console.log("Received message from origin:", event.origin);
        console.log("Message data:", event.data);
        
        if (event.origin !== "http://localhost:3003") {
          console.error("Invalid origin for OAuth response:", event.origin);
          return;
        }

        if (event.data.type === "oauth" && event.data.code) {
          const authorizationCode = event.data.code;

          // Fetch the token using the authorization code
          fetchToken(authorizationCode, useToast);

          if (authWindow) {
            authWindow.close();
          }

          window.removeEventListener("message", handleAuthCodeFromMessage);
        }
      };

      // Listen for messages from the popup
      window.addEventListener("message", handleAuthCodeFromMessage);
    }
  };

  return { handleLogin, fetchToken };
};

// Default button component
export const MembrosAuthButton: React.FC<Omit<AuthButtonProps, 'apiKey'> & { 
  useToast?: any;
}> = ({ 
  onAuthSuccess, 
  className = "",
  children,
  useToast,
  redirectMode = "popup"
}) => {
  const { handleLogin } = useAuthButton(onAuthSuccess, redirectMode);

  return (
    <button
      className={`border w-full items-center flex bg-[#1F54B3] flex-row min-h-[50px] justify-center rounded-lg px-[20px] ${className}`}
      onClick={() => handleLogin(useToast)}
    >
      {children || (
        <div className="text-white text-md xl:text-md font-medium">
          Entrar com a Membros
        </div>
      )}
    </button>
  );
}; 