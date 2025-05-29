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
import { useAuth } from "../AuthContext";
import { LoadingScreen } from "../components/LoadingScreen";
import { AuthScreen } from "../components/AuthScreen";
import { InadimplentScreen } from "../components/InadimplentScreen";
export function withAuth(Component, options) {
    return function AuthWrapped(props) {
        var _a = useAuth(), user = _a.user, isLoading = _a.isLoading, hasActivePlan = _a.hasActivePlan;
        var _b = options || {}, useToast = _b.useToast, _c = _b.LoadingComponent, LoadingComponent = _c === void 0 ? LoadingScreen : _c, AuthComponent = _b.AuthComponent, _d = _b.InadimplentComponent, InadimplentComponent = _d === void 0 ? InadimplentScreen : _d, requiredPlans = _b.requiredPlans;
        if (isLoading)
            return _jsx(LoadingComponent, {});
        if (!user) {
            if (AuthComponent) {
                return _jsx(AuthComponent, {});
            }
            return (_jsx(AuthScreen, { useToast: useToast }));
        }
        // Check subscription access using hasActivePlan with provided plan IDs
        if (requiredPlans && requiredPlans.length > 0) {
            var hasAccess = hasActivePlan(requiredPlans);
            if (!hasAccess)
                return _jsx(InadimplentComponent, {});
        }
        return _jsx(Component, __assign({}, props));
    };
}
