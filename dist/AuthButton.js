"use client";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { setCookie } from "./utils/cookies";
import { useAuth } from "./AuthContext";
import { MEMBROS_API_URL } from "./constants";
// Hook for auth functionality
export var useAuthButton = function (onAuthSuccess, redirectMode) {
    if (redirectMode === void 0) { redirectMode = "popup"; }
    var _a = useAuth(), loadUserByToken = _a.loadUserByToken, publicKey = _a.publicKey;
    var fetchToken = function (authorizationCode, useToast) { return __awaiter(void 0, void 0, void 0, function () {
        var res, responseData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, fetch("".concat(MEMBROS_API_URL, "/user/auth/token"), {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ authorization_code: authorizationCode }),
                        })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    responseData = _a.sent();
                    if (!(res.ok && responseData.access_token)) return [3 /*break*/, 4];
                    // Store tokens in cookies
                    setCookie(null, "nextauth.token", responseData.access_token, {
                        path: "/",
                    });
                    setCookie(null, "nextauth.refreshToken", responseData.refresh_token, {
                        path: "/",
                    });
                    return [4 /*yield*/, loadUserByToken(responseData.access_token)];
                case 3:
                    _a.sent();
                    // Optionally call a callback with the access token
                    if (onAuthSuccess)
                        onAuthSuccess(responseData.access_token);
                    if (useToast) {
                        useToast({
                            title: "Authentication Successful",
                            description: "Access token received.",
                        });
                    }
                    return [3 /*break*/, 5];
                case 4:
                    if (useToast) {
                        useToast({
                            title: "Error",
                            description: responseData.message || "Failed to retrieve token.",
                            status: "error",
                        });
                    }
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    console.error("Error fetching token:", error_1);
                    if (useToast) {
                        useToast({
                            title: "Server Error",
                            description: "An error occurred while fetching the token.",
                            status: "error",
                        });
                    }
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Check for auth code in URL on component mount (for redirect mode)
    useEffect(function () {
        if (redirectMode === "redirect") {
            var urlParams = new URLSearchParams(window.location.search);
            var code = urlParams.get('code');
            if (code) {
                fetchToken(code);
                // Clean up URL
                var newUrl = window.location.pathname;
                window.history.replaceState({}, document.title, newUrl);
            }
        }
    }, [redirectMode]);
    var handleLogin = function (useToast) {
        if (redirectMode === "redirect") {
            // Full page redirect using OAuth2 page
            var redirectUri = encodeURIComponent(window.location.href);
            var authUrl = "http://localhost:3003/oauth2/".concat(publicKey, "?flow=redirect&redirect_uri=").concat(redirectUri);
            window.location.href = authUrl;
        }
        else {
            // Popup window (default behavior)
            var width = 500;
            var height = 550;
            var left = window.screen.width / 2 - width / 2;
            var top_1 = window.screen.height / 2 - height / 2;
            var specs = "width=".concat(width, ",height=").concat(height, ",top=").concat(top_1, ",left=").concat(left, ",menubar=no,toolbar=no,location=no,status=no");
            var redirectOrigin = encodeURIComponent(window.location.origin);
            var authUrl = "http://localhost:3003/oauth2/".concat(publicKey, "?flow=popup&redirect_origin=").concat(redirectOrigin);
            var authWindow_1 = window.open(authUrl, "_blank", specs);
            var handleAuthCodeFromMessage_1 = function (event) {
                // Allow localhost for debugging
                console.log("Received message from origin:", event.origin);
                console.log("Message data:", event.data);
                if (event.origin !== "http://localhost:3003") {
                    console.error("Invalid origin for OAuth response:", event.origin);
                    return;
                }
                if (event.data.type === "oauth" && event.data.code) {
                    var authorizationCode = event.data.code;
                    // Fetch the token using the authorization code
                    fetchToken(authorizationCode, useToast);
                    if (authWindow_1) {
                        authWindow_1.close();
                    }
                    window.removeEventListener("message", handleAuthCodeFromMessage_1);
                }
            };
            // Listen for messages from the popup
            window.addEventListener("message", handleAuthCodeFromMessage_1);
        }
    };
    return { handleLogin: handleLogin, fetchToken: fetchToken };
};
// Default button component
export var MembrosAuthButton = function (_a) {
    var onAuthSuccess = _a.onAuthSuccess, _b = _a.className, className = _b === void 0 ? "" : _b, children = _a.children, useToast = _a.useToast, _c = _a.redirectMode, redirectMode = _c === void 0 ? "popup" : _c;
    var handleLogin = useAuthButton(onAuthSuccess, redirectMode).handleLogin;
    return (_jsx("button", { className: "border w-full items-center flex bg-[#1F54B3] flex-row min-h-[50px] justify-center rounded-lg px-[20px] ".concat(className), onClick: function () { return handleLogin(useToast); }, children: children || (_jsx("div", { className: "text-white text-md xl:text-md font-medium", children: "Entrar com a Membros" })) }));
};
