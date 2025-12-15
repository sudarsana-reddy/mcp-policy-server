import { evaluateDockerPolicy } from "./policies.js";
import http from "http";
import { URL } from "url";

export const capabilities = {
  docker_policy: {
    description: "Evaluates Dockerfile against central Docker policies",
    input_schema: {
      type: "object",
      properties: {
        dockerfile: { type: "string" }
      }
    },
    handler: async ({ dockerfile }: { dockerfile: string }) =>
      await evaluateDockerPolicy(dockerfile)
  }
};

function jsonResponse(res: http.ServerResponse, status: number, data: unknown) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body).toString()
  });
  res.end(body);
}

function notFound(res: http.ServerResponse, msg = "Not found") {
  jsonResponse(res, 404, { error: msg });
}

function methodNotAllowed(res: http.ServerResponse) {
  jsonResponse(res, 405, { error: "Method not allowed" });
}

async function handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
  try {
    const base = `http://localhost`;
    const url = new URL(req.url ?? "", base);
    const parts = url.pathname.replace(/^\/+/, "").split("/");

    // GET /
    if (url.pathname === "/" && req.method === "GET") {
      return jsonResponse(res, 200, {
        name: "MCP Policy Server",
        capabilities: Object.keys(capabilities)
      });
    }

    // GET /capabilities
    if (url.pathname === "/capabilities" && req.method === "GET") {
      const info: Record<string, { description: string; input_schema: unknown }> = {};
      for (const [k, v] of Object.entries(capabilities)) {
        info[k] = { description: (v as any).description, input_schema: (v as any).input_schema };
      }
      return jsonResponse(res, 200, info);
    }

    // POST /capabilities/:name
    if (parts[0] === "capabilities" && parts[1] && req.method === "POST") {
      const name = parts[1];
      const cap = (capabilities as any)[name];
      if (!cap) return notFound(res, `Unknown capability: ${name}`);

      // read body
      let body = "";
      for await (const chunk of req) {
        body += chunk;
      }
      let parsed: any = {};
      if (body) {
        try {
          parsed = JSON.parse(body);
        } catch (err) {
          return jsonResponse(res, 400, { error: "Invalid JSON body" });
        }
      }

      try {
        const result = await cap.handler(parsed ?? {});
        return jsonResponse(res, 200, { ok: true, result });
      } catch (err: any) {
        console.error("handler error:", err);
        return jsonResponse(res, 500, { ok: false, error: String(err) });
      }
    }

    // Unknown route/method
    if (req.method && req.method !== "GET" && req.method !== "POST") {
      return methodNotAllowed(res);
    }

    return notFound(res);
  } catch (err) {
    console.error("request handler failure:", err);
    jsonResponse(res, 500, { error: String(err) });
  }
}

/**
 * Start an HTTP server exposing capability endpoints.
 * Default port: 3000 (or override with PORT env).
 */
export function startServer(port = Number(process.env.PORT) || 3000) {
  const server = http.createServer(handleRequest);
  server.listen(port, () => {
    console.log(`🚀 MCP Policy Server listening on http://localhost:${port}`);
    console.log("Available capabilities:", Object.keys(capabilities));
  });
  return server;
}
