import spawn from "cross-spawn";

// eslint-disable-next-line import/prefer-default-export
export function runYarn(cwd: string, args: string[] = []) {
  const command = "yarnpkg";
  const argsWithCwd = ["--cwd", cwd, ...args];
  const proc = spawn.sync(command, argsWithCwd, { stdio: "inherit" });
  if (proc.status !== 0) {
    console.error(`\`${command} ${argsWithCwd.join(" ")}\` failed`);
    process.exit(1);
  }
}
