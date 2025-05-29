"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useAuth } from "../AuthContext";
export function LoginButton(_a) {
    var _b = _a.children, children = _b === void 0 ? "Log in" : _b, className = _a.className, options = _a.options, _c = _a.mode, mode = _c === void 0 ? "redirect" : _c;
    var _d = useAuth(), isAuthenticated = _d.isAuthenticated, loginWithRedirect = _d.loginWithRedirect, loginWithPopup = _d.loginWithPopup;
    var handleLogin = function () {
        if (mode === "popup") {
            loginWithPopup(options);
        }
        else {
            loginWithRedirect(options);
        }
    };
    if (isAuthenticated) {
        return null;
    }
    return (_jsx("button", { onClick: handleLogin, className: className, children: children }));
}
