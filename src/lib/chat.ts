import { ObjectId } from "mongodb";

import { getMongoDb } from "@/lib/mongodb";

export type ChatSessionStatus = "open" | "closed";
export type ChatSender = "visitor" | "admin";

type ChatSessionRecord = {
  _id: ObjectId;
  visitorName: string;
  visitorEmail: string;
  status: ChatSessionStatus;
  unreadForAdmin: boolean;
  unreadForVisitor: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt: Date;
};

type ChatMessageRecord = {
  _id: ObjectId;
  sessionId: ObjectId;
  sender: ChatSender;
  body: string;
  createdAt: Date;
};

export type ChatMessage = {
  id: string;
  sender: ChatSender;
  body: string;
  createdAt: string;
};

export type ChatSessionSummary = {
  id: string;
  visitorName: string;
  visitorEmail: string;
  status: ChatSessionStatus;
  unreadForAdmin: boolean;
  unreadForVisitor: boolean;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
  lastMessagePreview: string;
};

export type ChatSessionDetails = {
  id: string;
  visitorName: string;
  visitorEmail: string;
  status: ChatSessionStatus;
  unreadForAdmin: boolean;
  unreadForVisitor: boolean;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
  messages: ChatMessage[];
};

const SESSIONS_COLLECTION = "chat_sessions";
const MESSAGES_COLLECTION = "chat_messages";

function serializeMessage(message: ChatMessageRecord): ChatMessage {
  return {
    id: message._id.toHexString(),
    sender: message.sender,
    body: message.body,
    createdAt: message.createdAt.toISOString(),
  };
}

function serializeSession(
  session: ChatSessionRecord,
  lastMessagePreview: string,
): ChatSessionSummary {
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

function parseObjectId(id: string): ObjectId | null {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  return new ObjectId(id);
}

async function getCollections() {
  const db = await getMongoDb();
  return {
    sessions: db.collection<ChatSessionRecord>(SESSIONS_COLLECTION),
    messages: db.collection<ChatMessageRecord>(MESSAGES_COLLECTION),
  };
}

export async function createChatSession(
  visitorName: string,
  visitorEmail: string,
  initialMessage: string,
): Promise<ChatSessionDetails> {
  const { sessions, messages } = await getCollections();
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

export async function addChatMessage(
  sessionId: string,
  sender: ChatSender,
  body: string,
): Promise<ChatMessage | null> {
  const id = parseObjectId(sessionId);
  if (!id) {
    return null;
  }

  const { sessions, messages } = await getCollections();
  const now = new Date();
  const messageId = new ObjectId();

  const session = await sessions.findOne({ _id: id });
  if (!session) {
    return null;
  }

  await messages.insertOne({
    _id: messageId,
    sessionId: id,
    sender,
    body,
    createdAt: now,
  });

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

  return serializeMessage({
    _id: messageId,
    sessionId: id,
    sender,
    body,
    createdAt: now,
  });
}

export async function setChatSessionStatus(
  sessionId: string,
  status: ChatSessionStatus,
): Promise<boolean> {
  const id = parseObjectId(sessionId);
  if (!id) {
    return false;
  }

  const { sessions } = await getCollections();
  const result = await sessions.updateOne(
    { _id: id },
    { $set: { status, updatedAt: new Date() } },
  );

  return result.matchedCount > 0;
}

export async function getChatSessionDetails(
  sessionId: string,
  viewer: ChatSender,
): Promise<ChatSessionDetails | null> {
  const id = parseObjectId(sessionId);
  if (!id) {
    return null;
  }

  const { sessions, messages } = await getCollections();
  const session = await sessions.findOne({ _id: id });
  if (!session) {
    return null;
  }

  const sessionMessages = await messages
    .find({ sessionId: id })
    .sort({ createdAt: 1 })
    .toArray();

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

export async function listChatSessions(): Promise<ChatSessionSummary[]> {
  const { sessions, messages } = await getCollections();
  const sessionList = await sessions.find({}).sort({ lastMessageAt: -1 }).toArray();

  const summaries = await Promise.all(
    sessionList.map(async (session) => {
      const lastMessage = await messages.find({ sessionId: session._id }).sort({ createdAt: -1 }).limit(1).toArray();
      const preview = lastMessage[0]?.body || "";
      return serializeSession(session, preview);
    }),
  );

  return summaries;
}
