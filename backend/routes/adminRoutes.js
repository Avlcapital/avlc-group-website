const { loginAdmin, logoutAdmin } = require("../controllers/adminController");
const { readJson, sendJson } = require("../middleware/http");

async function handleAdminAuthRoutes(request, response, pathName, method) {
  if (method === "POST" && pathName === "/api/admin/login") {
    const result = await loginAdmin(await readJson(request));
    sendJson(response, request, 200, result.payload, result.headers);
    return true;
  }

  if (method === "POST" && pathName === "/api/admin/logout") {
    const result = await logoutAdmin(request);
    sendJson(response, request, 200, result.payload, result.headers);
    return true;
  }

  return false;
}

module.exports = { handleAdminAuthRoutes };
