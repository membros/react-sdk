"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { LoadingScreen } from "../components/LoadingScreen";
import { AuthScreen } from "../components/AuthScreen";
import { InadimplentScreen } from "../components/InadimplentScreen";

interface WithAdminAuthOptions {
  adminUserId: string;
  useToast?: any;
  LoadingComponent?: React.ComponentType;
  AuthComponent?: React.ComponentType;
  InadimplentComponent?: React.ComponentType;
  UnauthorizedComponent?: React.ComponentType;
}

export function withAdminAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: WithAdminAuthOptions
) {
  return function AdminAuthWrapped(props: P) {
    const [mounted, setMounted] = useState(false);
    
    // Ensure component only renders on client side
    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    const { user, originalUser, isLoading, adimplent } = useAuth();
    
    const {
      adminUserId,
      useToast,
      LoadingComponent = LoadingScreen,
      AuthComponent,
      InadimplentComponent = InadimplentScreen,
      UnauthorizedComponent
    } = options;

    if (isLoading) return <LoadingComponent />;
    
    if (!user) {
      if (AuthComponent) {
        return <AuthComponent />;
      }
      return (
        <AuthScreen 
          useToast={useToast}
        />
      );
    }
    
    if (!adimplent) return <InadimplentComponent />;
    
    // Check if user is admin
    const isAdmin = user.id === adminUserId || (originalUser && originalUser.id === adminUserId);
    
    if (!isAdmin) {
      if (UnauthorizedComponent) {
        return <UnauthorizedComponent />;
      }
      // Redirect to home
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
      return null;
    }
    
    return <Component {...props} />;
  };
} 