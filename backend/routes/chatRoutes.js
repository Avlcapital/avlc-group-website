const {
  createVisitorChat,
  getAdminChat,
  listAdminChats,
  sendAdminChatReply,
  updateAdminChatStatus,
} = require("../controllers/chatController");
const { readJson, sendJson } = require("../middleware/http");

async function handleChatRoutes(request, response, pathName, method) {
  if (method === "POST" && pathName === "/api/chat/sessions") {
    sendJson(response, request, 201, await createVisitorChat(await readJson(request)));
    return true;
  }

  if (method === "GET" && pathName === "/api/admin/chat/sessions") {
    sendJson(response, request, 200, await listAdminChats());
    return true;
  }

  const adminChatMatch = pathName.match(/^\/api\/admin\/chat\/sessions\/([^/]+)$/);
  if (adminChatMatch && method === "GET") {
    sendJson(response, request, 200, await getAdminChat(adminChatMatch[1]));
    return true;
  }

  if (adminChatMatch && method === "PATCH") {
    sendJson(response, request, 200, await updateAdminChatStatus(adminChatMatch[1], await readJson(request)));
    return true;
  }

  const adminChatMessageMatch = pathName.match(/^\/api\/admin\/chat\/sessions\/([^/]+)\/messages$/);
  if (adminChatMessageMatch && method === "POST") {
    sendJson(response, request, 201, await sendAdminChatReply(adminChatMessageMatch[1], await readJson(request)));
    return true;
  }

  return false;
}

module.exports = { handleChatRoutes };
