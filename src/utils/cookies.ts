// Cookie utilities to replace nookies dependency
// Provides the same interface as nookies for seamless replacement

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
export const setCookie = (
  ctx: any, // For compatibility with nookies API (not used in client-side)
  name: string,
  value: string,
  options: CookieOptions = {}
): void => {
  if (typeof window === 'undefined') {
    // Server-side handling would go here if needed
    return;
  }

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (options.path) {
    cookieString += `; path=${options.path}`;
  }

  if (options.domain) {
    cookieString += `; domain=${options.domain}`;
  }

  if (options.maxAge) {
    cookieString += `; max-age=${options.maxAge}`;
  }

  if (options.expires) {
    cookieString += `; expires=${options.expires.toUTCString()}`;
  }

  if (options.secure) {
    cookieString += `; secure`;
  }

  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`;
  }

  if (options.httpOnly) {
    cookieString += `; httponly`;
  }

  document.cookie = cookieString;
};

/**
 * Parse cookies from document.cookie and return as an object
 */
export const parseCookies = (ctx?: any): Record<string, string> => {
  if (typeof window === 'undefined') {
    // Server-side handling would go here if needed
    return {};
  }

  const cookies: Record<string, string> = {};
  
  if (document.cookie) {
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        try {
          cookies[decodeURIComponent(name)] = decodeURIComponent(value);
        } catch (e) {
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
export const destroyCookie = (
  ctx: any, // For compatibility with nookies API (not used in client-side)
  name: string,
  options: Omit<CookieOptions, 'maxAge' | 'expires'> = {}
): void => {
  if (typeof window === 'undefined') {
    // Server-side handling would go here if needed
    return;
  }

  setCookie(ctx, name, '', {
    ...options,
    expires: new Date(0), // Set expiration to Unix epoch (past date)
  });
}; 