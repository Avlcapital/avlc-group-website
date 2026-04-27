const { hash } = require("bcryptjs");
const { ObjectId } = require("mongodb");

const { getCurrentAdminUser } = require("../middleware/auth");
const { getMongoDb } = require("../middleware/db");

const ADMIN_USERS_COLLECTION = "admin_users";
const ADMIN_ROLES = ["super_admin", "editor"];

function toPublicAdminUser(user) {
  return {
    id: String(user._id),
    username: user.username,
    email: typeof user.email === "string" ? user.email : "",
    role: user.role || "editor",
    isActive: user.isActive !== false,
    createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : String(user.createdAt || ""),
    updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : String(user.updatedAt || ""),
  };
}

function assertAuthenticatedAdmin(user) {
  if (user) {
    return user;
  }

  const error = new Error("Unauthorized.");
  error.status = 401;
  throw error;
}

function assertSuperAdmin(user) {
  if (user.role === "super_admin") {
    return;
  }

  const error = new Error("Only super admins can manage admin users.");
  error.status = 403;
  throw error;
}

function assertValidAdminUserId(id) {
  if (ObjectId.isValid(id)) {
    return new ObjectId(id);
  }

  const error = new Error("Invalid admin user id.");
  error.status = 400;
  throw error;
}

function validateAdminEmail(email) {
  const normalized = String(email || "").trim().toLowerCase();

  if (!normalized) {
    const error = new Error("Email is required.");
    error.status = 400;
    throw error;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    const error = new Error("A valid email address is required.");
    error.status = 400;
    throw error;
  }

  return normalized;
}

function validateAdminCreationPayload(payload) {
  const username = String(payload?.username || "").trim().toLowerCase();
  const email = validateAdminEmail(payload?.email);
  const password = String(payload?.password || "");
  const role = ADMIN_ROLES.includes(payload?.role) ? payload.role : "editor";

  if (!username) {
    const error = new Error("Username is required.");
    error.status = 400;
    throw error;
  }

  if (!/^[a-z0-9._-]{3,50}$/.test(username)) {
    const error = new Error("Username must be 3-50 characters and use letters, numbers, dots, underscores, or hyphens.");
    error.status = 400;
    throw error;
  }

  if (password.length < 8) {
    const error = new Error("Password must be at least 8 characters long.");
    error.status = 400;
    throw error;
  }

  return { username, email, password, role };
}

function validateAdminUpdatePayload(payload) {
  const username = String(payload?.username || "").trim().toLowerCase();
  const email = validateAdminEmail(payload?.email);
  const password = String(payload?.password || "");
  const role = ADMIN_ROLES.includes(payload?.role) ? payload.role : null;
  const isActive = typeof payload?.isActive === "boolean" ? payload.isActive : null;

  if (!username) {
    const error = new Error("Username is required.");
    error.status = 400;
    throw error;
  }

  if (!/^[a-z0-9._-]{3,50}$/.test(username)) {
    const error = new Error("Username must be 3-50 characters and use letters, numbers, dots, underscores, or hyphens.");
    error.status = 400;
    throw error;
  }

  if (!role) {
    const error = new Error("Role is required.");
    error.status = 400;
    throw error;
  }

  if (isActive === null) {
    const error = new Error("Active status is required.");
    error.status = 400;
    throw error;
  }

  if (password && password.length < 8) {
    const error = new Error("Password must be at least 8 characters long.");
    error.status = 400;
    throw error;
  }

  return { username, email, password, role, isActive };
}

async function getAdminUsersCollection() {
  const db = await getMongoDb();
  const users = db.collection(ADMIN_USERS_COLLECTION);
  await users.createIndex({ username: 1 }, { unique: true });
  await users.createIndex({ email: 1 }, { unique: true, sparse: true });
  return users;
}

async function countActiveSuperAdmins(users, excludingId) {
  const query = { role: "super_admin", isActive: true };
  if (excludingId) {
    query._id = { $ne: excludingId };
  }
  return users.countDocuments(query);
}

async function listAdminUsers(request) {
  const currentAdmin = assertAuthenticatedAdmin(await getCurrentAdminUser(request));
  const usersCollection = await getAdminUsersCollection();
  const users = await usersCollection
    .find({}, { projection: { passwordHash: 0 } })
    .sort({ createdAt: -1, username: 1 })
    .toArray();

  return {
    currentAdmin: {
      id: String(currentAdmin._id),
      username: currentAdmin.username,
      email: typeof currentAdmin.email === "string" ? currentAdmin.email : "",
      role: currentAdmin.role || "editor",
    },
    users: users.map(toPublicAdminUser),
  };
}

async function createAdminUser(request, payload) {
  const currentAdmin = assertAuthenticatedAdmin(await getCurrentAdminUser(request));
  assertSuperAdmin(currentAdmin);

  const { username, email, password, role } = validateAdminCreationPayload(payload);
  const users = await getAdminUsersCollection();

  const existing = await users.findOne({
    $or: [{ username }, { email }],
  });
  if (existing?.username === username) {
    const error = new Error(`Admin user '${username}' already exists.`);
    error.status = 409;
    throw error;
  }
  if (existing?.email === email) {
    const error = new Error(`Admin email '${email}' already exists.`);
    error.status = 409;
    throw error;
  }

  const now = new Date();
  const passwordHash = await hash(password, 12);
  const document = {
    username,
    email,
    passwordHash,
    role,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  const result = await users.insertOne(document);
  return {
    user: toPublicAdminUser({
      ...document,
      _id: result.insertedId,
    }),
  };
}

async function updateAdminUser(request, id, payload) {
  const currentAdmin = assertAuthenticatedAdmin(await getCurrentAdminUser(request));
  assertSuperAdmin(currentAdmin);

  const userId = assertValidAdminUserId(id);
  const users = await getAdminUsersCollection();
  const existingUser = await users.findOne({ _id: userId });
  if (!existingUser) {
    const error = new Error("Admin user not found.");
    error.status = 404;
    throw error;
  }

  const { username, email, password, role, isActive } = validateAdminUpdatePayload(payload);
  const duplicate = await users.findOne(
    {
      _id: { $ne: userId },
      $or: [{ username }, { email }],
    },
    { projection: { _id: 1, username: 1, email: 1 } },
  );
  if (duplicate?.username === username) {
    const error = new Error(`Admin user '${username}' already exists.`);
    error.status = 409;
    throw error;
  }
  if (duplicate?.email === email) {
    const error = new Error(`Admin email '${email}' already exists.`);
    error.status = 409;
    throw error;
  }

  const isEditingSelf = String(existingUser._id) === String(currentAdmin._id);
  if (isEditingSelf && !isActive) {
    const error = new Error("You cannot deactivate your own admin account.");
    error.status = 400;
    throw error;
  }

  const removesSuperAdminAccess = existingUser.role === "super_admin" && existingUser.isActive !== false && (!isActive || role !== "super_admin");
  if (removesSuperAdminAccess) {
    const remainingSuperAdmins = await countActiveSuperAdmins(users, userId);
    if (remainingSuperAdmins === 0) {
      const error = new Error("At least one active super admin must remain.");
      error.status = 400;
      throw error;
    }
  }

  const now = new Date();
  const update = {
    username,
    email,
    role,
    isActive,
    updatedAt: now,
  };

  if (password) {
    update.passwordHash = await hash(password, 12);
  }

  await users.updateOne({ _id: userId }, { $set: update });
  const updatedUser = await users.findOne({ _id: userId }, { projection: { passwordHash: 0 } });
  return {
    user: toPublicAdminUser(updatedUser),
  };
}

async function deleteAdminUser(request, id) {
  const currentAdmin = assertAuthenticatedAdmin(await getCurrentAdminUser(request));
  assertSuperAdmin(currentAdmin);

  const userId = assertValidAdminUserId(id);
  const users = await getAdminUsersCollection();
  const existingUser = await users.findOne({ _id: userId });
  if (!existingUser) {
    const error = new Error("Admin user not found.");
    error.status = 404;
    throw error;
  }

  const isDeletingSelf = String(existingUser._id) === String(currentAdmin._id);
  if (isDeletingSelf) {
    const error = new Error("You cannot delete your own admin account.");
    error.status = 400;
    throw error;
  }

  if (existingUser.role === "super_admin" && existingUser.isActive !== false) {
    const remainingSuperAdmins = await countActiveSuperAdmins(users, userId);
    if (remainingSuperAdmins === 0) {
      const error = new Error("At least one active super admin must remain.");
      error.status = 400;
      throw error;
    }
  }

  await users.deleteOne({ _id: userId });
  return { ok: true };
}

module.exports = {
  createAdminUser,
  deleteAdminUser,
  listAdminUsers,
  updateAdminUser,
};
