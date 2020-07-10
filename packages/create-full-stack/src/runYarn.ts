import spawn from "cross-spawn";

export default function runYarn(cwd: string, args: string[] = []) {
  const command = "yarnpkg";
  const argsWithCwd = ["--cwd", cwd, ...args];
  const proc = spawn.sync(command, argsWithCwd, { stdio: "inherit" });
  if (proc.status !== 0) {
    console.error(`\`${command} ${argsWithCwd.join(" ")}\` failed`);
    process.exit(1);
  }
}
