import { getDockerPolicy } from "./policies";

export const capabilities = {
  docker_policy: {
    description: "Returns Docker security constraints",
    input_schema: {
      type: "object",
      properties: {
        service_type: { type: "string" }
      }
    },
    handler: async () => {
      return await getDockerPolicy();
    }
  }
};
