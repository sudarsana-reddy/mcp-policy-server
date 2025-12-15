import { fetchFile } from "./github";
import { parseDockerfile } from "./dockerParser";
import opa from "@open-policy-agent/opa-wasm";

export async function getDockerPolicyConstraints(dockerfile?: string) {
  const regoPolicy = await fetchFile("docker/baseline.rego");
  const approvedImagesRaw = await fetchFile("docker/approved-images.json");

  const approvedImages = JSON.parse(approvedImagesRaw);

  let violations: string[] = [];

  if (dockerfile) {
    const input = parseDockerfile(dockerfile);

    const policy = await opa.load(regoPolicy);
    violations = policy.evaluate({ input }).map((v: any) => v.msg);
  }

  return {
    approved_images: approvedImages.approved_images,
    rules: violations.length
      ? violations
      : ["All mandatory Docker security rules must be followed"]
  };
}
