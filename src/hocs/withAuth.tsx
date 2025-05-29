"use client";

import React from "react";
import { useAuth } from "../AuthContext";
import { LoadingScreen } from "../components/LoadingScreen";
import { AuthScreen } from "../components/AuthScreen";
import { InadimplentScreen } from "../components/InadimplentScreen";

interface WithAuthOptions {
  useToast?: any;
  LoadingComponent?: React.ComponentType;
  AuthComponent?: React.ComponentType;
  InadimplentComponent?: React.ComponentType;
  requiredPlans?: string[];
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: WithAuthOptions
) {
  return function AuthWrapped(props: P) {
    const { user, isLoading, hasActivePlan } = useAuth();
    
    const {
      useToast,
      LoadingComponent = LoadingScreen,
      AuthComponent,
      InadimplentComponent = InadimplentScreen,
      requiredPlans
    } = options || {};

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
    
    // Check subscription access using hasActivePlan with provided plan IDs
    if (requiredPlans && requiredPlans.length > 0) {
      const hasAccess = hasActivePlan(requiredPlans);
      if (!hasAccess) return <InadimplentComponent />;
    }
    
    return <Component {...props} />;
  };
} 