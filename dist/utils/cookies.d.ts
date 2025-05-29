interface CookieOptions {
    path?: string;
    domain?: string;
    maxAge?: number;
    expires?: Date;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
}
/**
 * Set a cookie with the given name, value and options
 */
export declare const setCookie: (ctx: any, // For compatibility with nookies API (not used in client-side)
name: string, value: string, options?: CookieOptions) => void;
/**
 * Parse cookies from document.cookie and return as an object
 */
export declare const parseCookies: (ctx?: any) => Record<string, string>;
/**
 * Remove a cookie by setting its expiration to the past
 */
export declare const destroyCookie: (ctx: any, // For compatibility with nookies API (not used in client-side)
name: string, options?: Omit<CookieOptions, "maxAge" | "expires">) => void;
export {};
//# sourceMappingURL=cookies.d.ts.map