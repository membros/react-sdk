"use client";

import React from "react";
import { useAuth } from "../AuthContext";
import { LogoutOptions } from "../types";

interface LogoutButtonProps {
  children?: React.ReactNode;
  className?: string;
  options?: LogoutOptions;
}

export function LogoutButton({ 
  children = "Log out", 
  className,
  options
}: LogoutButtonProps) {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout(options);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button onClick={handleLogout} className={className}>
      {children}
    </button>
  );
} 