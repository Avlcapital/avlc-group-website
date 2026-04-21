const { submitAssetRecoveryForm } = require("../controllers/assetRecoveryController");
const { readFormData, sendJson } = require("../middleware/http");

async function handleAssetRecoveryRoutes(request, response, pathName, method) {
  if (method === "POST" && pathName === "/api/asset-recovery-submissions") {
    sendJson(response, request, 200, await submitAssetRecoveryForm(await readFormData(request)));
    return true;
  }

  return false;
}

module.exports = { handleAssetRecoveryRoutes };
