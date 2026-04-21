const {
  listGuaranteeRequests,
  submitGuaranteeRequest,
  updateGuaranteeRequestStatus,
} = require("../controllers/guaranteeRequestController");
const { readFormData, readJson, sendJson } = require("../middleware/http");

async function handleGuaranteeRequestRoutes(request, response, pathName, method) {
  if (method === "POST" && pathName === "/api/guarantee-requests") {
    sendJson(response, request, 201, await submitGuaranteeRequest(await readFormData(request)));
    return true;
  }

  if (method === "GET" && pathName === "/api/admin/guarantee-requests") {
    sendJson(response, request, 200, await listGuaranteeRequests());
    return true;
  }

  const statusMatch = pathName.match(/^\/api\/admin\/guarantee-requests\/([^/]+)\/status$/);
  if (statusMatch && method === "PATCH") {
    sendJson(response, request, 200, await updateGuaranteeRequestStatus(statusMatch[1], await readJson(request)));
    return true;
  }

  return false;
}

module.exports = { handleGuaranteeRequestRoutes };
