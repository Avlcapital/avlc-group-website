const {
  createAdminUser,
  deleteAdminUser,
  listAdminUsers,
  updateAdminUser,
} = require("../controllers/adminUsersController");
const { readJson, sendJson } = require("../middleware/http");

async function handleAdminUsersRoutes(request, response, pathName, method) {
  if (pathName === "/api/admin/users" && method === "GET") {
    sendJson(response, request, 200, await listAdminUsers(request));
    return true;
  }

  if (pathName === "/api/admin/users" && method === "POST") {
    sendJson(response, request, 200, await createAdminUser(request, await readJson(request)));
    return true;
  }

  const userIdMatch = pathName.match(/^\/api\/admin\/users\/([^/]+)$/);
  if (userIdMatch && method === "PUT") {
    sendJson(response, request, 200, await updateAdminUser(request, userIdMatch[1], await readJson(request)));
    return true;
  }

  if (userIdMatch && method === "DELETE") {
    sendJson(response, request, 200, await deleteAdminUser(request, userIdMatch[1]));
    return true;
  }

  return false;
}

module.exports = { handleAdminUsersRoutes };
