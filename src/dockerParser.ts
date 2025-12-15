export function parseDockerfile(dockerfile: string) {
  const lines = dockerfile.split("\n");

  return {
    from: lines.find(l => l.startsWith("FROM"))?.split(" ")[1],
    user: lines.find(l => l.startsWith("USER"))?.split(" ")[1],
    exposed_ports: lines
      .filter(l => l.startsWith("EXPOSE"))
      .map(l => Number(l.split(" ")[1]))
  };
}
