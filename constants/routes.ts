/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/home",
  "/home/services",
  "/home/services/:serviceId",
  "/home/products",
  "/home/products/:productId",
  "/home/events",
  "/home/events/:eventId",
  "/auth/new-verification",
  "/api/uploadthing",
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/error",
  "/auth/onboarding",
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication puposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * Routes that require authentication
 * @type {RegExp[]}
 */
export const protectedRoutes = [
  /^\/home\/services\/add$/,
  /^\/home\/services\/my-services$/,
  /^\/home\/services\/[^/]+\/edit$/,
  /^\/home\/services\/[^/]+\/book$/,
  /^\/home\/products\/add$/,
  /^\/home\/products\/my-products$/,
  /^\/home\/products\/[^/]+\/edit$/,
  /^\/home\/events\/create$/,
  /^\/home\/events\/[^/]+\/edit$/,
];

/**
 * The default redirect path after loggin in
 * @type {string}
 */
export const DEFAULT_SIGNIN_REDIRECT = "/home/services";