/**
 * Static, build-time application metadata.
 * Runtime/secret configuration belongs in env modules (added with the backend).
 */
export const siteConfig = {
  name: "Todo",
  tagline: "Organize your work and life, finally.",
  description:
    "Become focused, organized, and calm with Todo. The world's favorite task manager and to-do list app.",
  routes: {
    home: "/",
    signup: "/signup",
    login: "/login",
    forgotPassword: "/reset-password",
    app: "/app",
  },
} as const;

export type SiteConfig = typeof siteConfig;
