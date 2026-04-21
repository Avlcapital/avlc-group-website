const { ObjectId } = require("mongodb");
const { getMongoDb } = require("../middleware/db");
const { assertEmailConfigured, createTransporter } = require("../middleware/email");

function parseObjectId(id) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

async function getChatCollections() {
  const db = await getMongoDb();
  return {
    sessions: db.collection("chat_sessions"),
    messages: db.collection("chat_messages"),
  };
}

function serializeMessage(message) {
  return {
    id: message._id.toHexString(),
    sender: message.sender,
    body: message.body,
    createdAt: message.createdAt.toISOString(),
  };
}

function serializeSession(session, lastMessagePreview) {
  return {
    id: session._id.toHexString(),
    visitorName: session.visitorName,
    visitorEmail: session.visitorEmail,
    status: session.status,
    unreadForAdmin: session.unreadForAdmin,
    unreadForVisitor: session.unreadForVisitor,
    createdAt: session.createdAt.toISOString(),
    updatedAt: session.updatedAt.toISOString(),
    lastMessageAt: session.lastMessageAt.toISOString(),
    lastMessagePreview,
  };
}

async function createChatSession(visitorName, visitorEmail, initialMessage) {
  const { sessions, messages } = await getChatCollections();
  const now = new Date();
  const sessionId = new ObjectId();

  await sessions.insertOne({
    _id: sessionId,
    visitorName,
    visitorEmail,
    status: "open",
    unreadForAdmin: true,
    unreadForVisitor: false,
    createdAt: now,
    updatedAt: now,
    lastMessageAt: now,
  });

  await messages.insertOne({
    _id: new ObjectId(),
    sessionId,
    sender: "visitor",
    body: initialMessage,
    createdAt: now,
  });

  const session = await getChatSessionDetails(sessionId.toHexString(), "visitor");
  if (!session) {
    throw new Error("Failed to load the created chat session.");
  }
  return session;
}

async function addChatMessage(sessionId, sender, body) {
  const id = parseObjectId(sessionId);
  if (!id) {
    return null;
  }

  const { sessions, messages } = await getChatCollections();
  const session = await sessions.findOne({ _id: id });
  if (!session) {
    return null;
  }

  const now = new Date();
  const messageId = new ObjectId();
  await messages.insertOne({ _id: messageId, sessionId: id, sender, body, createdAt: now });
  await sessions.updateOne(
    { _id: id },
    {
      $set: {
        updatedAt: now,
        lastMessageAt: now,
        unreadForAdmin: sender === "visitor",
        unreadForVisitor: sender === "admin",
      },
    },
  );

  return serializeMessage({ _id: messageId, sessionId: id, sender, body, createdAt: now });
}

async function setChatSessionStatus(sessionId, status) {
  const id = parseObjectId(sessionId);
  if (!id) {
    return false;
  }
  const { sessions } = await getChatCollections();
  const result = await sessions.updateOne({ _id: id }, { $set: { status, updatedAt: new Date() } });
  return result.matchedCount > 0;
}

async function getChatSessionDetails(sessionId, viewer) {
  const id = parseObjectId(sessionId);
  if (!id) {
    return null;
  }

  const { sessions, messages } = await getChatCollections();
  const session = await sessions.findOne({ _id: id });
  if (!session) {
    return null;
  }

  const sessionMessages = await messages.find({ sessionId: id }).sort({ createdAt: 1 }).toArray();

  if (viewer === "visitor" && session.unreadForVisitor) {
    await sessions.updateOne({ _id: id }, { $set: { unreadForVisitor: false, updatedAt: new Date() } });
    session.unreadForVisitor = false;
  }

  if (viewer === "admin" && session.unreadForAdmin) {
    await sessions.updateOne({ _id: id }, { $set: { unreadForAdmin: false, updatedAt: new Date() } });
    session.unreadForAdmin = false;
  }

  return {
    id: session._id.toHexString(),
    visitorName: session.visitorName,
    visitorEmail: session.visitorEmail,
    status: session.status,
    unreadForAdmin: session.unreadForAdmin,
    unreadForVisitor: session.unreadForVisitor,
    createdAt: session.createdAt.toISOString(),
    updatedAt: session.updatedAt.toISOString(),
    lastMessageAt: session.lastMessageAt.toISOString(),
    messages: sessionMessages.map(serializeMessage),
  };
}

async function listChatSessions() {
  const { sessions, messages } = await getChatCollections();
  const sessionList = await sessions.find({}).sort({ lastMessageAt: -1 }).toArray();
  return Promise.all(
    sessionList.map(async (session) => {
      const lastMessage = await messages.find({ sessionId: session._id }).sort({ createdAt: -1 }).limit(1).toArray();
      return serializeSession(session, lastMessage[0]?.body || "");
    }),
  );
}

async function createVisitorChat(payload) {
  const visitorName = String(payload?.visitorName || "").trim();
  const visitorEmail = String(payload?.visitorEmail || "").trim();
  const message = String(payload?.message || "").trim();

  if (!visitorName || !visitorEmail || !message) {
    const error = new Error("Name, email, and first message are required.");
    error.status = 400;
    throw error;
  }

  return { session: await createChatSession(visitorName, visitorEmail, message) };
}

async function listAdminChats() {
  return { sessions: await listChatSessions() };
}

async function getAdminChat(id) {
  const session = await getChatSessionDetails(id, "admin");
  if (!session) {
    const error = new Error("Chat session not found.");
    error.status = 404;
    throw error;
  }
  return { session };
}

async function updateAdminChatStatus(id, payload) {
  if (payload?.status !== "open" && payload?.status !== "closed") {
    const error = new Error("Valid status is required.");
    error.status = 400;
    throw error;
  }

  const updated = await setChatSessionStatus(id, payload.status);
  if (!updated) {
    const error = new Error("Chat session not found.");
    error.status = 404;
    throw error;
  }
  return { ok: true };
}

async function sendAdminChatReply(id, payload) {
  const body = String(payload?.body || "").trim();
  if (!body) {
    const error = new Error("Message body is required.");
    error.status = 400;
    throw error;
  }

  assertEmailConfigured();
  const session = await getChatSessionDetails(id, "admin");
  if (!session) {
    const error = new Error("Chat session not found.");
    error.status = 404;
    throw error;
  }

  const latestVisitorMessage =
    [...session.messages].reverse().find((message) => message.sender === "visitor")?.body || "No prior message found.";

  await createTransporter().sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: session.visitorEmail,
    replyTo: process.env.CONTACT_TO_EMAIL || process.env.SMTP_FROM || process.env.SMTP_USER,
    subject: "Reply from AVLC Group",
    text: [
      `Hello ${session.visitorName},`,
      "",
      "Thank you for contacting AVLC Group.",
      "",
      body,
      "",
      "If you need further assistance, you can reply to this email or send us another message through the website.",
      "",
      "Original message:",
      latestVisitorMessage,
    ].join("\n"),
  });

  const message = await addChatMessage(id, "admin", body);
  return { message, emailed: true };
}

module.exports = {
  createVisitorChat,
  getAdminChat,
  listAdminChats,
  sendAdminChatReply,
  updateAdminChatStatus,
};
