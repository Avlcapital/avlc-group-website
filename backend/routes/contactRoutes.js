const { submitContactForm } = require("../controllers/contactController");
const { readFormData, sendJson } = require("../middleware/http");

async function handleContactRoutes(request, response, pathName, method) {
  if (method === "POST" && pathName === "/api/contact-submissions") {
    sendJson(response, request, 200, await submitContactForm(await readFormData(request)));
    return true;
  }

  return false;
}

module.exports = { handleContactRoutes };
