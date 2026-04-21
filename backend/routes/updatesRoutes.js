const {
  createAdminUpdate,
  listAdminUpdates,
  listPublicUpdates,
  removeAdminUpdate,
  updateAdminUpdate,
} = require("../controllers/updatesController");
const { readJson, sendJson } = require("../middleware/http");

async function handleUpdateRoutes(request, response, pathName, method) {
  if (method === "GET" && pathName === "/api/updates") {
    sendJson(response, request, 200, await listPublicUpdates(), { "Cache-Control": "no-store" });
    return true;
  }

  if (method === "GET" && pathName === "/api/admin/updates") {
    sendJson(response, request, 200, await listAdminUpdates());
    return true;
  }

  if (method === "POST" && pathName === "/api/admin/updates") {
    sendJson(response, request, 200, await createAdminUpdate(await readJson(request)));
    return true;
  }

  const updateIdMatch = pathName.match(/^\/api\/admin\/updates\/([^/]+)$/);
  if (updateIdMatch && method === "PUT") {
    sendJson(response, request, 200, await updateAdminUpdate(updateIdMatch[1], await readJson(request)));
    return true;
  }

  if (updateIdMatch && method === "DELETE") {
    sendJson(response, request, 200, await removeAdminUpdate(updateIdMatch[1]));
    return true;
  }

  return false;
}

module.exports = { handleUpdateRoutes };
