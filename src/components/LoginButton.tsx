"use client";

import React from "react";
import { useAuth } from "../AuthContext";
import { LoginOptions } from "../types";

interface LoginButtonProps {
  children?: React.ReactNode;
  className?: string;
  options?: LoginOptions;
  mode?: "redirect" | "popup";
}

export function LoginButton({ 
  children = "Log in", 
  className,
  options,
  mode = "redirect"
}: LoginButtonProps) {
  const { isAuthenticated, loginWithRedirect, loginWithPopup } = useAuth();

  const handleLogin = () => {
    if (mode === "popup") {
      loginWithPopup(options);
    } else {
      loginWithRedirect(options);
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <button onClick={handleLogin} className={className}>
      {children}
    </button>
  );
} 