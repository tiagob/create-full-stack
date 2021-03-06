import spawn from "cross-spawn";

export function runYarn(cwd: string, args: string[] = []) {
  const command = "yarn";
  const argsWithCwd = ["--cwd", cwd, ...args];
  const proc = spawn.sync(command, argsWithCwd, { stdio: "inherit" });
  if (proc.status !== 0) {
    throw new Error(`\`${command} ${argsWithCwd.join(" ")}\` failed`);
  }
}

export function hasDocker() {
  const pulumiProc = spawn.sync("docker-compose", ["--version"]);
  if (pulumiProc.status !== 0) {
    return false;
  }
  return true;
}
