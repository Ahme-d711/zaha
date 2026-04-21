import { env } from "../config/env.js";

export interface CookieOptions {
  httpOnly?: boolean;
  secure: boolean;
  sameSite: "strict" | "lax" | "none";
  domain?: string;
  path: string;
  maxAge?: number;
}

/**
 * Get cookie options for authentication tokens
 * Works with both HTTP and HTTPS
 */
export const getCookieOptions = (): CookieOptions => {
  const isProduction = env.nodeEnv === "production";
  const useHttps = env.useHttps || isProduction;

  return {
    httpOnly: env.cookieHttpOnly, // Configurable via env, default false
    secure: useHttps, // true for HTTPS, false for HTTP
    sameSite: useHttps ? "none" : "lax", // "none" requires secure=true for cross-site
    ...(env.cookieDomain && { domain: env.cookieDomain }),
    path: "/",
  };
};

/**
 * Get cookie options for access token (15 minutes)
 */
export const getAccessTokenCookieOptions = (): CookieOptions => {
  return {
    ...getCookieOptions(),
    maxAge: 15 * 60 * 1000, // 15 minutes
  };
};

