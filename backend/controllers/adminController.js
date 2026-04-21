const { compare } = require("bcryptjs");
const { getMongoDb } = require("../middleware/db");
const {
  ADMIN_COOKIE_NAME,
  cleanupExpiredSessions,
  createAdminSession,
  deleteSessionToken,
  findAdminUserByUsername,
} = require("../middleware/auth");
const { parseCookies, serializeCookie } = require("../middleware/http");

async function loginAdmin(payload) {
  const username = String(payload?.username || "").trim();
  const password = String(payload?.password || "");

  await getMongoDb().then((db) => db.command({ ping: 1 }));
  const user = await findAdminUserByUsername(username);
  if (!user || !(await compare(password, user.passwordHash))) {
    const error = new Error("Invalid admin credentials.");
    error.status = 401;
    throw error;
  }

  await cleanupExpiredSessions();
  const sessionValue = await createAdminSession(user);
  return {
    payload: { ok: true },
    headers: {
      "Set-Cookie": serializeCookie(ADMIN_COOKIE_NAME, sessionValue, { maxAge: 60 * 60 * 12 }),
    },
  };
}

async function logoutAdmin(request) {
  const cookies = parseCookies(request.headers.cookie || "");
  await deleteSessionToken(cookies[ADMIN_COOKIE_NAME]);
  return {
    payload: { ok: true },
    headers: {
      "Set-Cookie": serializeCookie(ADMIN_COOKIE_NAME, "", { maxAge: 0 }),
    },
  };
}

module.exports = { loginAdmin, logoutAdmin };
