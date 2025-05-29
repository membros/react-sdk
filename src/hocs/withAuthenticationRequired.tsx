"use client";

import React from "react";
import { useAuth } from "../AuthContext";
import { LoadingScreen } from "../components/LoadingScreen";
import { AuthScreen } from "../components/AuthScreen";
import { InadimplentScreen } from "../components/InadimplentScreen";
import { WithAuthenticationRequiredOptions } from "../types";

export function withAuthenticationRequired<P extends object>(
  Component: React.ComponentType<P>,
  options?: WithAuthenticationRequiredOptions
) {
  return function AuthenticationRequired(props: P) {
    const { 
      user, 
      isLoading, 
      isAuthenticated, 
      loginWithRedirect,
      hasActivePlan,
      adimplent, 
      isLoggingOut
    } = useAuth();
    
    const {
      onRedirecting,
      returnTo,
      requiredPlans,
      LoadingComponent = LoadingScreen,
      AuthComponent,
      InadimplentComponent = InadimplentScreen
    } = options || {};

    console.log('=== withAuthenticationRequired Debug ===');
    console.log('isLoading:', isLoading);
    console.log('isAuthenticated:', isAuthenticated);
    console.log('user email:', user?.email);
    console.log('requiredPlans:', requiredPlans);

    // If logging out, show loading and prevent further action
    if (isLoggingOut) {
      console.log('🚪 User is logging out - showing loading');
      return <LoadingComponent />;
    }

    // Show loading while authentication state is being determined
    if (isLoading) {
      console.log('🔄 Showing loading - authentication state being determined');
      return <LoadingComponent />;
    }
    
    // If not authenticated, redirect to login or show auth component
    if (!isAuthenticated) {
      console.log('🚫 User not authenticated - redirecting to login');
      if (onRedirecting) {
        const RedirectingComponent = onRedirecting;
        
        React.useEffect(() => {
          const timer = setTimeout(() => {
            loginWithRedirect({
              authorizationParams: {
                redirect_uri: returnTo || window.location.href
              }
            });
          }, 100);
          
          return () => clearTimeout(timer);
        }, []);
        
        return <RedirectingComponent />;
      }
      
      if (AuthComponent) {
        return <AuthComponent />;
      }
      
      React.useEffect(() => {
        loginWithRedirect({
          authorizationParams: {
            redirect_uri: returnTo || window.location.href
          }
        });
      }, []);
      
      return <LoadingComponent />;
    }
    
    console.log('✅ User is authenticated, checking subscription requirements...');
    
    // Check subscription requirements
    if (requiredPlans && requiredPlans.length > 0) {
      console.log('🔍 Checking required plans:', requiredPlans);
      const hasRequiredPlan = hasActivePlan(requiredPlans);
      console.log('📋 hasActivePlan result:', hasRequiredPlan);
      
      if (!hasRequiredPlan) {
        console.log('❌ User does not have required plan - showing subscription required page');
        return <InadimplentComponent />;
      }
      
      console.log('✅ User has required plan - granting access to component');
      return <Component {...props} />;
    }
    
    // No specific plans required - use legacy adimplent check
    console.log('🔍 No specific plans required, checking legacy adimplent status:', adimplent);
    if (!adimplent) {
      console.log('❌ User is not adimplent - showing subscription required page');
      return <InadimplentComponent />;
    }
    
    console.log('✅ User is adimplent - granting access to component');
    return <Component {...props} />;
  };
} 