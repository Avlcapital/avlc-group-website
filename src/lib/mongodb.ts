import { MongoClient, Db, MongoClientOptions, ServerApiVersion } from "mongodb";

const globalForMongo = globalThis as unknown as {
  mongoClientPromise?: Promise<MongoClient>;
};

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  const normalized = uri.trim().replace(/^['"]|['"]$/g, "");
  if (!normalized.startsWith("mongodb://") && !normalized.startsWith("mongodb+srv://")) {
    throw new Error("MONGODB_URI must start with mongodb:// or mongodb+srv://");
  }

  return normalized;
}

function getMongoClientOptions(): MongoClientOptions {
  return {
    family: 4,
    tls: true,
    retryWrites: true,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    maxPoolSize: 10,
    serverApi: {
      version: ServerApiVersion.v1,
      strict: false,
      deprecationErrors: true,
    },
  };
}

export function getMongoClient(): Promise<MongoClient> {
  if (!globalForMongo.mongoClientPromise) {
    const client = new MongoClient(getMongoUri(), getMongoClientOptions());
    globalForMongo.mongoClientPromise = client.connect().catch((error) => {
      globalForMongo.mongoClientPromise = undefined;
      throw error;
    });
  }
  return globalForMongo.mongoClientPromise;
}

export async function getMongoDb(): Promise<Db> {
  const client = await getMongoClient();
  const dbName = process.env.MONGODB_DB || "avlc_group_website";
  return client.db(dbName);
}

export async function pingMongo(): Promise<void> {
  const db = await getMongoDb();
  await db.command({ ping: 1 });
}
