"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from "../AuthContext";
export function Profile(_a) {
    var className = _a.className;
    var _b = useAuth(), user = _b.user, isAuthenticated = _b.isAuthenticated;
    if (!isAuthenticated || !user) {
        return null;
    }
    return (_jsxs("div", { className: className, children: [user.picture && (_jsx("img", { src: user.picture, alt: user.name, style: { width: 40, height: 40, borderRadius: '50%' } })), _jsxs("div", { children: [_jsxs("h3", { children: ["Hello ", user.name] }), _jsx("p", { children: user.email }), user.plano && _jsxs("p", { children: ["Plan: ", user.plano] })] })] }));
}
