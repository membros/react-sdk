"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MembrosAuthButton } from "../AuthButton";
export var AuthScreen = function (_a) {
    var useToast = _a.useToast, _b = _a.logoSrc, logoSrc = _b === void 0 ? "/logo.png" : _b, _c = _a.title, title = _c === void 0 ? "Acesse agora" : _c, _d = _a.description, description = _d === void 0 ? "Clique no botão abaixo para fazer login." : _d, _e = _a.className, className = _e === void 0 ? "" : _e;
    return (_jsx("div", { className: "flex h-full w-full ".concat(className), children: _jsx("div", { className: "flex flex-1 overflow-hidden w-full p-5 md:p-8 items-center justify-center", children: _jsxs("div", { className: "flex flex-col gap-4 bg-white p-8 rounded-xl w-full max-w-md md:max-w-lg", children: [logoSrc && (_jsx("img", { src: logoSrc, alt: "Logo", className: "w-24 h-24 object-contain" })), _jsx("h1", { className: "font-bold text-blue-600 text-xl md:text-2xl", children: title }), _jsx("p", { className: "text-gray-700", children: description }), _jsx(MembrosAuthButton, { useToast: useToast, onAuthSuccess: function () { } })] }) }) }));
};
