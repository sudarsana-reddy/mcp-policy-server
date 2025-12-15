import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const [OWNER, REPO] = process.env.POLICY_REPO!.split("/");
const REF = process.env.POLICY_REF || "main";

/**
 * Generic file fetcher for central policy repo
 */
export async function fetchFile(path: string): Promise<string> {
  const res = await octokit.repos.getContent({
    owner: OWNER,
    repo: REPO,
    path,
    ref: REF
  });

  // @ts-ignore
  return Buffer.from(res.data.content, "base64").toString("utf8");
}
