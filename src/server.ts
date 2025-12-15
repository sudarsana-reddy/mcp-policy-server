import { getDockerPolicyConstraints } from "./policies";

export const capabilities = {
  docker_policy: {
    description: "Evaluates Dockerfile against org policies",
    input_schema: {
      type: "object",
      properties: {
        dockerfile: { type: "string" }
      }
    },
    handler: async ({ dockerfile }) =>
      await getDockerPolicyConstraints(dockerfile)
  }
};
