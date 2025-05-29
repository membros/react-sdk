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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState, } from "react";
import { setCookie, destroyCookie, parseCookies } from "nookies";
import { Toaster, toast } from "sonner";
import { MEMBROS_API_URL } from "./constants";
var AuthContext = createContext(undefined);
export var useAuth = function () {
    var context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an MembrosProvider");
    }
    return context;
};
export var signOut = function () {
    destroyCookie(null, "nextauth.token");
    destroyCookie(null, "nextauth.refreshToken");
    window.location.reload();
};
export var MembrosProvider = function (_a) {
    var children = _a.children, clientId = _a.clientId, authorizationParams = _a.authorizationParams;
    var _b = useState(null), user = _b[0], setUser = _b[1];
    var _c = useState(null), token = _c[0], setToken = _c[1];
    var _d = useState(true), internalIsLoadingUser = _d[0], setInternalIsLoadingUser = _d[1];
    var _e = useState(true), internalIsLoadingSubscriptions = _e[0], setInternalIsLoadingSubscriptions = _e[1];
    var _f = useState(null), error = _f[0], setError = _f[1];
    var _g = useState(false), adimplent = _g[0], setAdimplent = _g[1];
    var _h = useState(null), originalUser = _h[0], setOriginalUser = _h[1];
    var _j = useState([]), userSubscriptions = _j[0], setUserSubscriptions = _j[1];
    var _k = useState(false), isLoggingOut = _k[0], setIsLoggingOut = _k[1];
    var isAuthenticated = !!user;
    var isLoading = internalIsLoadingUser || internalIsLoadingSubscriptions;
    useEffect(function () {
        var loadUserFromCookies = function () { return __awaiter(void 0, void 0, void 0, function () {
            var urlParams, authCode, newUrl, accessToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setInternalIsLoadingUser(true);
                        setInternalIsLoadingSubscriptions(true);
                        urlParams = new URLSearchParams(window.location.search);
                        authCode = urlParams.get('code');
                        if (!authCode) return [3 /*break*/, 2];
                        console.log("Found authorization code in URL, processing...");
                        return [4 /*yield*/, login(authCode)];
                    case 1:
                        _a.sent();
                        newUrl = window.location.pathname;
                        window.history.replaceState({}, document.title, newUrl);
                        return [2 /*return*/];
                    case 2:
                        accessToken = parseCookies()["nextauth.token"];
                        if (!accessToken) return [3 /*break*/, 4];
                        return [4 /*yield*/, loadUserByToken(accessToken)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        setInternalIsLoadingUser(false);
                        setInternalIsLoadingSubscriptions(false);
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        loadUserFromCookies();
    }, []);
    var loadUserSubscriptions = function (email, currentToken) { return __awaiter(void 0, void 0, void 0, function () {
        var response, subscriptions, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setInternalIsLoadingSubscriptions(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch("".concat(MEMBROS_API_URL, "/subscription/account/email/").concat(email), {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer ".concat(currentToken),
                            },
                        })];
                case 2:
                    response = _a.sent();
                    if (response.status === 404) {
                        setUserSubscriptions([]);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    subscriptions = _a.sent();
                    setUserSubscriptions(subscriptions);
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _a.sent();
                    console.error("An unexpected error occurred while loading subscriptions", error_1);
                    setUserSubscriptions([]);
                    return [3 /*break*/, 6];
                case 5:
                    setInternalIsLoadingSubscriptions(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var loadUserByToken = function (accessToken) { return __awaiter(void 0, void 0, void 0, function () {
        var response, userData, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    setError(null);
                    setInternalIsLoadingUser(true);
                    setToken(accessToken);
                    setCookie(null, "nextauth.token", accessToken, {
                        path: "/",
                        maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
                    });
                    return [4 /*yield*/, fetch("".concat(MEMBROS_API_URL, "/whoami"), {
                            headers: { Authorization: "Bearer ".concat(accessToken) },
                        })];
                case 1:
                    response = _a.sent();
                    if (response.status === 401) {
                        signOut();
                        setInternalIsLoadingUser(false);
                        setInternalIsLoadingSubscriptions(false);
                        return [2 /*return*/];
                    }
                    if (!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 2:
                    userData = _a.sent();
                    setUser(userData);
                    setInternalIsLoadingUser(false);
                    return [4 /*yield*/, loadUserSubscriptions(userData.email, accessToken)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    console.error("Failed to load user data");
                    setUser(null);
                    setToken(null);
                    destroyCookie(null, "nextauth.token");
                    destroyCookie(null, "nextauth.refreshToken");
                    setInternalIsLoadingUser(false);
                    setInternalIsLoadingSubscriptions(false);
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    console.error("Error in loadUserByToken:", error_2);
                    setError(error_2);
                    setUser(null);
                    setToken(null);
                    destroyCookie(null, "nextauth.token");
                    destroyCookie(null, "nextauth.refreshToken");
                    setInternalIsLoadingUser(false);
                    setInternalIsLoadingSubscriptions(false);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var loginWithRedirect = function (options) { return __awaiter(void 0, void 0, void 0, function () {
        var redirectUri, authUrl;
        var _a;
        return __generator(this, function (_b) {
            redirectUri = ((_a = options === null || options === void 0 ? void 0 : options.authorizationParams) === null || _a === void 0 ? void 0 : _a.redirect_uri) ||
                (options === null || options === void 0 ? void 0 : options.redirectUri) ||
                (authorizationParams === null || authorizationParams === void 0 ? void 0 : authorizationParams.redirect_uri) ||
                window.location.origin;
            authUrl = "http://localhost:3003/oauth2/".concat(clientId, "?flow=redirect&redirect_uri=").concat(encodeURIComponent(redirectUri));
            window.location.href = authUrl;
            return [2 /*return*/];
        });
    }); };
    var loginWithPopup = function (options) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var redirectOrigin = window.location.origin;
                    // Use the OAuth2 page with popup flow
                    var authUrl = "http://localhost:3003/oauth2/".concat(clientId, "?flow=popup&redirect_origin=").concat(encodeURIComponent(redirectOrigin));
                    var popup = window.open(authUrl, "auth-popup", "width=500,height=600");
                    var checkClosed = setInterval(function () {
                        if (popup === null || popup === void 0 ? void 0 : popup.closed) {
                            clearInterval(checkClosed);
                            reject(new Error("Popup was closed"));
                        }
                    }, 1000);
                    var messageHandler = function (event) {
                        // Allow localhost for debugging
                        if (event.origin !== "http://localhost:3003")
                            return;
                        if (event.data.type === "oauth" && event.data.code) {
                            clearInterval(checkClosed);
                            popup === null || popup === void 0 ? void 0 : popup.close();
                            window.removeEventListener("message", messageHandler);
                            login(event.data.code).then(function () { return resolve(); }).catch(reject);
                        }
                    };
                    window.addEventListener("message", messageHandler);
                })];
        });
    }); };
    var getAccessTokenSilently = function (options) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!token) {
                throw new Error("No access token available. User might need to log in again.");
            }
            return [2 /*return*/, token];
        });
    }); };
    var login = function (authorizationCode) { return __awaiter(void 0, void 0, void 0, function () {
        var mockToken, mockRefreshToken, mockUser, res, responseData, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    // For debugging with mock codes, simulate token exchange
                    if (authorizationCode.startsWith("auth_code_")) {
                        mockToken = "mock_token_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9));
                        mockRefreshToken = "mock_refresh_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9));
                        setCookie(null, "nextauth.token", mockToken, {
                            path: "/",
                            maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
                        });
                        setCookie(null, "nextauth.refreshToken", mockRefreshToken, {
                            path: "/",
                            maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
                        });
                        mockUser = {
                            id: "mock-user-id",
                            name: "Mock User",
                            email: "mock@example.com",
                            plano: "vestibulando",
                        };
                        setUser(mockUser);
                        setToken(mockToken);
                        setInternalIsLoadingUser(false);
                        setInternalIsLoadingSubscriptions(false);
                        toast.success("Login Successful", { description: "You are now logged in (mock mode)." });
                        return [2 /*return*/];
                    }
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
                    setCookie(null, "nextauth.token", responseData.access_token, {
                        path: "/",
                        maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
                    });
                    setCookie(null, "nextauth.refreshToken", responseData.refresh_token, {
                        path: "/",
                        maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
                    });
                    return [4 /*yield*/, loadUserByToken(responseData.access_token)];
                case 3:
                    _a.sent();
                    toast.success("Login Successful", { description: "You are now logged in." });
                    return [3 /*break*/, 5];
                case 4:
                    toast.error("Login Failed", { description: responseData.message || "Failed to retrieve token." });
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_3 = _a.sent();
                    console.error("Login error:", error_3);
                    toast.error("Server Error", { description: "An error occurred while fetching the token." });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var logout = function (options) {
        var _a;
        setIsLoggingOut(true);
        destroyCookie(null, "nextauth.token");
        destroyCookie(null, "nextauth.refreshToken");
        setUser(null);
        setToken(null);
        setUserSubscriptions([]);
        setOriginalUser(null);
        setInternalIsLoadingUser(false);
        setInternalIsLoadingSubscriptions(false);
        var returnTo = ((_a = options === null || options === void 0 ? void 0 : options.logoutParams) === null || _a === void 0 ? void 0 : _a.returnTo) ||
            (options === null || options === void 0 ? void 0 : options.returnTo) ||
            window.location.origin;
        if (typeof window !== "undefined") {
            window.location.href = returnTo;
        }
    };
    var hasActivePlan = function (planIds) {
        if (!userSubscriptions || userSubscriptions.length === 0) {
            return false;
        }
        if (!planIds || planIds.length === 0) {
            return userSubscriptions.some(function (sub) { return sub.status === 'active'; });
        }
        for (var _i = 0, userSubscriptions_1 = userSubscriptions; _i < userSubscriptions_1.length; _i++) {
            var subscription = userSubscriptions_1[_i];
            var subscriptionPlanId = String(subscription.plan.id);
            if (planIds.includes(subscriptionPlanId)) {
                if (subscription.status === 'active') {
                    return true;
                }
            }
        }
        return false;
    };
    var overwriteUser = function (newUser) {
        if (!originalUser) {
            setOriginalUser(user);
        }
        setUser(newUser);
        if (typeof window !== "undefined") {
            window.location.href = "/";
        }
    };
    var revertToOriginalUser = function () {
        if (originalUser) {
            setUser(originalUser);
            setOriginalUser(null);
        }
    };
    return (_jsxs(AuthContext.Provider, { value: {
            user: user,
            isAuthenticated: isAuthenticated,
            isLoading: isLoading,
            isLoggingOut: isLoggingOut,
            error: error,
            loginWithRedirect: loginWithRedirect,
            loginWithPopup: loginWithPopup,
            logout: logout,
            getAccessTokenSilently: getAccessTokenSilently,
            originalUser: originalUser,
            token: token,
            login: login,
            loadUserByToken: loadUserByToken,
            adimplent: adimplent,
            overwriteUser: overwriteUser,
            revertToOriginalUser: revertToOriginalUser,
            publicKey: clientId,
            hasActivePlan: hasActivePlan,
            userSubscriptions: userSubscriptions,
        }, children: [_jsx(Toaster, { richColors: true }), children] }));
};
