const DEFAULT_FRONTEND_ORIGINS = ["http://localhost:3000", "https://avlc-group-website.vercel.app","https://www.avlcapital.com","https://www.avlc-group.com"];

function getAllowedOrigins() {
  return [...DEFAULT_FRONTEND_ORIGINS, ...(process.env.FRONTEND_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)]
    .filter((origin, index, allOrigins) => allOrigins.indexOf(origin) === index);
}

function isOriginAllowed(origin) {
  return Boolean(origin) && getAllowedOrigins().includes(origin);
}

function getAllowedOrigin(origin) {
  if (!origin) {
    return null;
  }

  return isOriginAllowed(origin) ? origin : null;
}

function createCorsHeaders(request) {
  const allowedOrigin = getAllowedOrigin(request.headers.origin);
  const headers = {
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Vary": "Origin",
  };

  if (allowedOrigin) {
    headers["Access-Control-Allow-Origin"] = allowedOrigin;
    headers["Access-Control-Allow-Credentials"] = "true";
  }

  return headers;
}

function sendJson(response, request, status, payload, extraHeaders = {}) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    ...createCorsHeaders(request),
    ...extraHeaders,
  });
  response.end(JSON.stringify(payload));
}

function sendNoContent(response, request) {
  response.writeHead(204, createCorsHeaders(request));
  response.end();
}

function parseCookies(cookieHeader) {
  return cookieHeader.split(";").reduce((cookies, part) => {
    const [rawKey, ...rawValue] = part.trim().split("=");
    if (!rawKey) {
      return cookies;
    }
    cookies[rawKey] = decodeURIComponent(rawValue.join("="));
    return cookies;
  }, {});
}

function serializeCookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (options.maxAge !== undefined) {
    parts.push(`Max-Age=${options.maxAge}`);
  }
  parts.push(`Path=${options.path || "/"}`);
  parts.push("HttpOnly");

  const sameSite = process.env.ADMIN_COOKIE_SAME_SITE || (process.env.NODE_ENV === "production" ? "None" : "Lax");
  parts.push(`SameSite=${sameSite}`);

  if (process.env.NODE_ENV === "production" || sameSite === "None" || options.secure) {
    parts.push("Secure");
  }

  return parts.join("; ");
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }
  if (chunks.length === 0) {
    return null;
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return null;
  }
}

async function readFormData(request) {
  const url = `http://${request.headers.host || "localhost"}${request.url}`;
  const webRequest = new Request(url, {
    method: request.method,
    headers: request.headers,
    body: request,
    duplex: "half",
  });
  return webRequest.formData();
}

module.exports = {
  createCorsHeaders,
  getAllowedOrigins,
  isOriginAllowed,
  parseCookies,
  readFormData,
  readJson,
  sendJson,
  sendNoContent,
  serializeCookie,
};
