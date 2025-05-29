"use client";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import { useAuth } from "../AuthContext";
import { LoadingScreen } from "../components/LoadingScreen";
import { InadimplentScreen } from "../components/InadimplentScreen";
export function withAuthenticationRequired(Component, options) {
    return function AuthenticationRequired(props) {
        var _a = useAuth(), user = _a.user, isLoading = _a.isLoading, isAuthenticated = _a.isAuthenticated, loginWithRedirect = _a.loginWithRedirect, hasActivePlan = _a.hasActivePlan, adimplent = _a.adimplent, isLoggingOut = _a.isLoggingOut;
        var _b = options || {}, onRedirecting = _b.onRedirecting, returnTo = _b.returnTo, requiredPlans = _b.requiredPlans, _c = _b.LoadingComponent, LoadingComponent = _c === void 0 ? LoadingScreen : _c, AuthComponent = _b.AuthComponent, _d = _b.InadimplentComponent, InadimplentComponent = _d === void 0 ? InadimplentScreen : _d;
        console.log('=== withAuthenticationRequired Debug ===');
        console.log('isLoading:', isLoading);
        console.log('isAuthenticated:', isAuthenticated);
        console.log('user email:', user === null || user === void 0 ? void 0 : user.email);
        console.log('requiredPlans:', requiredPlans);
        // If logging out, show loading and prevent further action
        if (isLoggingOut) {
            console.log('🚪 User is logging out - showing loading');
            return _jsx(LoadingComponent, {});
        }
        // Show loading while authentication state is being determined
        if (isLoading) {
            console.log('🔄 Showing loading - authentication state being determined');
            return _jsx(LoadingComponent, {});
        }
        // If not authenticated, redirect to login or show auth component
        if (!isAuthenticated) {
            console.log('🚫 User not authenticated - redirecting to login');
            if (onRedirecting) {
                var RedirectingComponent = onRedirecting;
                React.useEffect(function () {
                    var timer = setTimeout(function () {
                        loginWithRedirect({
                            authorizationParams: {
                                redirect_uri: returnTo || window.location.href
                            }
                        });
                    }, 100);
                    return function () { return clearTimeout(timer); };
                }, []);
                return _jsx(RedirectingComponent, {});
            }
            if (AuthComponent) {
                return _jsx(AuthComponent, {});
            }
            React.useEffect(function () {
                loginWithRedirect({
                    authorizationParams: {
                        redirect_uri: returnTo || window.location.href
                    }
                });
            }, []);
            return _jsx(LoadingComponent, {});
        }
        console.log('✅ User is authenticated, checking subscription requirements...');
        // Check subscription requirements
        if (requiredPlans && requiredPlans.length > 0) {
            console.log('🔍 Checking required plans:', requiredPlans);
            var hasRequiredPlan = hasActivePlan(requiredPlans);
            console.log('📋 hasActivePlan result:', hasRequiredPlan);
            if (!hasRequiredPlan) {
                console.log('❌ User does not have required plan - showing subscription required page');
                return _jsx(InadimplentComponent, {});
            }
            console.log('✅ User has required plan - granting access to component');
            return _jsx(Component, __assign({}, props));
        }
        // No specific plans required - use legacy adimplent check
        console.log('🔍 No specific plans required, checking legacy adimplent status:', adimplent);
        if (!adimplent) {
            console.log('❌ User is not adimplent - showing subscription required page');
            return _jsx(InadimplentComponent, {});
        }
        console.log('✅ User is adimplent - granting access to component');
        return _jsx(Component, __assign({}, props));
    };
}
