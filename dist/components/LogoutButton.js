"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useAuth } from "../AuthContext";
export function LogoutButton(_a) {
    var _b = _a.children, children = _b === void 0 ? "Log out" : _b, className = _a.className, options = _a.options;
    var _c = useAuth(), isAuthenticated = _c.isAuthenticated, logout = _c.logout;
    var handleLogout = function () {
        logout(options);
    };
    if (!isAuthenticated) {
        return null;
    }
    return (_jsx("button", { onClick: handleLogout, className: className, children: children }));
}
