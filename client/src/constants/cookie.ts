export const COOKIE_OPTIONS = {
  path: "/",
  secure: true,
  sameSite: "None" as const,
};

export const COOKIE_EXPIRES = {
  session: 7, // 7 ngày
} as const;
