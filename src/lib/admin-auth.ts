import { NextRequest } from "next/server";

import { isSessionTokenValid } from "@/lib/admin-users";

export const ADMIN_COOKIE_NAME = "avlc_admin_session";

export async function isAdminSessionValid(cookieValue: string | undefined | null): Promise<boolean> {
  return isSessionTokenValid(cookieValue);
}

export async function isAdminAuthorized(request: NextRequest): Promise<boolean> {
  const cookieValue = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return isAdminSessionValid(cookieValue);
}
