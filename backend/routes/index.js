const { handleAdminAuthRoutes } = require("./adminRoutes");
const { handleAssetRecoveryRoutes } = require("./assetRecoveryRoutes");
const { handleChatRoutes } = require("./chatRoutes");
const { handleContactRoutes } = require("./contactRoutes");
const { handleGuaranteeRequestRoutes } = require("./guaranteeRequestRoutes");
const { handleUpdateRoutes } = require("./updatesRoutes");
const { requireAdmin } = require("../middleware/auth");
const { checkMongoConnection } = require("../middleware/db");
const { isOriginAllowed, sendJson, sendNoContent } = require("../middleware/http");

async function routeRequest(request, response) {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  const pathName = url.pathname.replace(/\/+$/, "") || "/";
  const method = request.method || "GET";
  const origin = request.headers.origin;

  if (method === "OPTIONS") {
    sendNoContent(response, request);
    return;
  }

  if (origin && !isOriginAllowed(origin)) {
    sendJson(response, request, 403, { error: "Origin not allowed." });
    return;
  }

  if (method === "GET" && pathName === "/health") {
    try {
      const database = await checkMongoConnection();
      sendJson(response, request, 200, { ok: true, service: "avlc-backend", database });
    } catch (error) {
      sendJson(response, request, 503, {
        ok: false,
        service: "avlc-backend",
        database: {
          connected: false,
          error: error instanceof Error ? error.message : "MongoDB connection failed.",
        },
      });
    }
    return;
  }

  if (await handleAdminAuthRoutes(request, response, pathName, method)) {
    return;
  }

  if (pathName.startsWith("/api/admin/") && !(await requireAdmin(request))) {
    sendJson(response, request, 401, { error: "Unauthorized." });
    return;
  }

  if (await handleUpdateRoutes(request, response, pathName, method)) {
    return;
  }

  if (await handleChatRoutes(request, response, pathName, method)) {
    return;
  }

  if (await handleContactRoutes(request, response, pathName, method)) {
    return;
  }

  if (await handleGuaranteeRequestRoutes(request, response, pathName, method)) {
    return;
  }

  if (await handleAssetRecoveryRoutes(request, response, pathName, method)) {
    return;
  }

  sendJson(response, request, 404, { error: "Not found." });
}

module.exports = { routeRequest };
