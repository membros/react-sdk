import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export var LoadingScreen = function (_a) {
    var _b = _a.className, className = _b === void 0 ? "" : _b, _c = _a.message, message = _c === void 0 ? "Loading..." : _c;
    return (_jsx("div", { className: "flex h-full w-full items-center justify-center ".concat(className), children: _jsxs("div", { className: "flex flex-col items-center gap-4", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" }), _jsx("p", { className: "text-gray-600", children: message })] }) }));
};
