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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { LoadingScreen } from "../components/LoadingScreen";
import { AuthScreen } from "../components/AuthScreen";
import { InadimplentScreen } from "../components/InadimplentScreen";
export function withAdminAuth(Component, options) {
    return function AdminAuthWrapped(props) {
        var _a = useState(false), mounted = _a[0], setMounted = _a[1];
        // Ensure component only renders on client side
        useEffect(function () {
            setMounted(true);
        }, []);
        if (!mounted) {
            return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" }), _jsx("p", { className: "mt-2 text-sm text-gray-600", children: "Loading..." })] }) }));
        }
        var _b = useAuth(), user = _b.user, originalUser = _b.originalUser, isLoading = _b.isLoading, adimplent = _b.adimplent;
        var adminUserId = options.adminUserId, useToast = options.useToast, _c = options.LoadingComponent, LoadingComponent = _c === void 0 ? LoadingScreen : _c, AuthComponent = options.AuthComponent, _d = options.InadimplentComponent, InadimplentComponent = _d === void 0 ? InadimplentScreen : _d, UnauthorizedComponent = options.UnauthorizedComponent;
        if (isLoading)
            return _jsx(LoadingComponent, {});
        if (!user) {
            if (AuthComponent) {
                return _jsx(AuthComponent, {});
            }
            return (_jsx(AuthScreen, { useToast: useToast }));
        }
        if (!adimplent)
            return _jsx(InadimplentComponent, {});
        // Check if user is admin
        var isAdmin = user.id === adminUserId || (originalUser && originalUser.id === adminUserId);
        if (!isAdmin) {
            if (UnauthorizedComponent) {
                return _jsx(UnauthorizedComponent, {});
            }
            // Redirect to home
            if (typeof window !== "undefined") {
                window.location.href = "/";
            }
            return null;
        }
        return _jsx(Component, __assign({}, props));
    };
}
