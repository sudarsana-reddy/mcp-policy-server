import fs from "fs";

export async function getDockerPolicy() {
  const approvedImages = JSON.parse(
    fs.readFileSync("/policies/docker/approved-images.json", "utf8")
  );

  return {
    constraints: [
      "Do not use :latest tag",
      "Run container as non-root user",
      "Do not expose port 22"
    ],
    approved_images: approvedImages.approved_images
  };
}
