// Cookie utilities to replace nookies dependency
// Provides the same interface as nookies for seamless replacement
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
/**
 * Set a cookie with the given name, value and options
 */
export var setCookie = function (ctx, // For compatibility with nookies API (not used in client-side)
name, value, options) {
    if (options === void 0) { options = {}; }
    if (typeof window === 'undefined') {
        // Server-side handling would go here if needed
        return;
    }
    var cookieString = "".concat(encodeURIComponent(name), "=").concat(encodeURIComponent(value));
    if (options.path) {
        cookieString += "; path=".concat(options.path);
    }
    if (options.domain) {
        cookieString += "; domain=".concat(options.domain);
    }
    if (options.maxAge) {
        cookieString += "; max-age=".concat(options.maxAge);
    }
    if (options.expires) {
        cookieString += "; expires=".concat(options.expires.toUTCString());
    }
    if (options.secure) {
        cookieString += "; secure";
    }
    if (options.sameSite) {
        cookieString += "; samesite=".concat(options.sameSite);
    }
    if (options.httpOnly) {
        cookieString += "; httponly";
    }
    document.cookie = cookieString;
};
/**
 * Parse cookies from document.cookie and return as an object
 */
export var parseCookies = function (ctx) {
    if (typeof window === 'undefined') {
        // Server-side handling would go here if needed
        return {};
    }
    var cookies = {};
    if (document.cookie) {
        document.cookie.split(';').forEach(function (cookie) {
            var _a = cookie.trim().split('='), name = _a[0], value = _a[1];
            if (name && value) {
                try {
                    cookies[decodeURIComponent(name)] = decodeURIComponent(value);
                }
                catch (e) {
                    // Skip malformed cookies
                    console.warn('Failed to parse cookie:', name, value);
                }
            }
        });
    }
    return cookies;
};
/**
 * Remove a cookie by setting its expiration to the past
 */
export var destroyCookie = function (ctx, // For compatibility with nookies API (not used in client-side)
name, options) {
    if (options === void 0) { options = {}; }
    if (typeof window === 'undefined') {
        // Server-side handling would go here if needed
        return;
    }
    setCookie(ctx, name, '', __assign(__assign({}, options), { expires: new Date(0) }));
};
