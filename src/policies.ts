import * as opa from "@open-policy-agent/opa-wasm";
import { fetchFile } from "./github.js";
import { parseDockerfile } from "./dockerParser.js";

/**
 * Evaluates Docker policies using centrally governed artifacts.
 * Fetches:
 *  - docker/baseline.rego
 *  - docker/approved-images.json
 */
export async function evaluateDockerPolicy(dockerfile?: string) {

  // 1. Fetch BOTH Docker policy artifacts
  const regoSource = await fetchFile("docker/baseline.rego");
  const approvedImagesRaw = await fetchFile("docker/approved-images.json");

  const approvedImages = JSON.parse(approvedImagesRaw).approved_images;

  let violations: string[] = [];

  // 2. Evaluate Rego policy if Dockerfile is provided
  if (dockerfile) {
    const input = parseDockerfile(dockerfile);

    const policy = await opa.loadPolicy(regoSource);
    const results = policy.evaluate({ input });

    violations = results.map((r: any) => r.msg);

    // 3. Explicit approved-image enforcement
    if (!approvedImages.includes(input.from)) {
      violations.push(
        `Base image '${input.from}' is not in the approved images list`
      );
    }
  }

  return {
    approved_images: approvedImages,
    violations
  };
}
