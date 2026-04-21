const { MongoClient, ServerApiVersion } = require("mongodb");

let mongoClientPromise;

function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  const normalized = uri.trim().replace(/^["']|["']$/g, "");
  if (!normalized.startsWith("mongodb://") && !normalized.startsWith("mongodb+srv://")) {
    throw new Error("MONGODB_URI must start with mongodb:// or mongodb+srv://");
  }

  return normalized;
}

function getMongoClient() {
  if (!mongoClientPromise) {
    const client = new MongoClient(getMongoUri(), {
      family: 4,
      tls: true,
      retryWrites: true,
      serverSelectionTimeoutMS: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || 30000),
      connectTimeoutMS: Number(process.env.MONGODB_CONNECT_TIMEOUT_MS || 30000),
      maxPoolSize: 10,
      serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
      },
    });

    mongoClientPromise = client.connect().catch((error) => {
      mongoClientPromise = undefined;
      throw error;
    });
  }

  return mongoClientPromise;
}

async function getMongoDb() {
  const client = await getMongoClient();
  return client.db(process.env.MONGODB_DB || "avlc_group_website");
}

async function checkMongoConnection() {
  const db = await getMongoDb();
  await db.command({ ping: 1 });
  return {
    connected: true,
    database: process.env.MONGODB_DB || "avlc_group_website",
  };
}

function getMongoConfigSummary() {
  const uri = process.env.MONGODB_URI || "";
  const normalized = uri.trim().replace(/^["']|["']$/g, "");
  const maskedUri = normalized.replace(/\/\/([^:]+):([^@]+)@/, "//$1:***@");

  return {
    hasMongoUri: Boolean(normalized),
    mongoDb: process.env.MONGODB_DB || "avlc_group_website",
    maskedUri,
  };
}

function formatMongoConnectionError(error) {
  if (!error || typeof error !== "object") {
    return String(error);
  }

  const details = {
    name: error.name,
    message: error.message,
    code: error.code,
  };

  if (error.reason?.servers instanceof Map) {
    details.servers = Array.from(error.reason.servers.entries()).map(([server, description]) => ({
      server,
      type: description.type,
      error: description.error?.message,
    }));
  }

  return JSON.stringify(details, null, 2);
}

module.exports = { checkMongoConnection, formatMongoConnectionError, getMongoConfigSummary, getMongoDb };
