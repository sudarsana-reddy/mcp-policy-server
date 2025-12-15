import { evaluateDockerPolicy } from "./policies";

export const capabilities = {
  docker_policy: {
    description: "Evaluates Dockerfile against central Docker policies",
    input_schema: {
      type: "object",
      properties: {
        dockerfile: { type: "string" }
      }
    },
    handler: async ({ dockerfile }) =>
      await evaluateDockerPolicy(dockerfile)
  }
};
