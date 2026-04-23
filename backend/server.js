const http = require("node:http");
const { loadEnv } = require("./middleware/env");
const { checkMongoConnection, formatMongoConnectionError, getMongoConfigSummary } = require("./middleware/db");
const { routeRequest } = require("./routes");
const { getAllowedOrigins, sendJson } = require("./middleware/http");

loadEnv();

const PORT = Number(process.env.BACKEND_PORT || process.env.PORT || 4000);

const server = http.createServer((request, response) => {
  routeRequest(request, response).catch((error) => {
    console.error("Backend route failed", error);
    sendJson(response, request, error.status || 500, { error: error.message || "Internal server error." });
  });
});

server.listen(PORT, () => {
  console.log(`AVLC backend running on http://localhost:${PORT}`);
  console.log(`Allowed frontend origins: ${getAllowedOrigins().join(", ")}`);
  const mongoConfig = getMongoConfigSummary();
  console.log(`MongoDB URI configured: ${mongoConfig.hasMongoUri ? "yes" : "no"}`);
  console.log(`MongoDB database: ${mongoConfig.mongoDb}`);

  checkMongoConnection()
    .then((database) => {
      console.log(`MongoDB connected successfully. Database: ${database.database}`);
    })
    .catch((error) => {
      console.error("MongoDB connection failed on startup.");
      console.error(formatMongoConnectionError(error));
    });
});
