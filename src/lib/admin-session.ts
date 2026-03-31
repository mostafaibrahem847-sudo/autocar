export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_SESSION_VALUE = "true";

export function hasValidAdminSession(value: string | undefined) {
  return value === ADMIN_SESSION_VALUE;
}
