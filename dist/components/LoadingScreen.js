import { jsx as _jsx } from "react/jsx-runtime";
export var LoadingScreen = function (_a) {
    var _b = _a.className, className = _b === void 0 ? "" : _b;
    return (_jsx("div", { className: "flex h-full w-full items-center justify-center ".concat(className), children: _jsx("div", { className: "flex flex-col items-center gap-4", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" }) }) }));
};
