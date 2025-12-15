import "dotenv/config";
import { capabilities, startServer } from "./server.js";

/**
 * Minimal MCP server bootstrap.
 * In real MCP SDKs, this would register capabilities.
 * For demo, we expose them over stdio / HTTP.
 */

console.log("🚀 MCP Policy Server started");
console.log("Available capabilities:");
console.log(Object.keys(capabilities));

// Example local invocation (for testing)
if (process.env.TEST_DOCKERFILE) {
  capabilities.docker_policy
    .handler({ dockerfile: process.env.TEST_DOCKERFILE })
    .then(console.log)
    .catch(console.error);
}

// Start the HTTP server (default port 3000 or override with PORT env)
startServer();
