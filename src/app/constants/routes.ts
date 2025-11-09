const base = "api/v2/users"

export const ROUTES = {
    HOME: "/",
    USER: {
        LOGIN: `${base}/login`,
        REGISTER: `${base}/register`,
        VIEWER: `${base}/me`,
        LOGOUT: `${base}/logout`,
        VERIFY_EMAIL: `${base}/verifyEmail`,
    }
} as const