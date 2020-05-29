import spawn from "cross-spawn";
import path from "path";

export function installDependencies(projectName: string) {
  const command = "yarnpkg";
  const args = ["--cwd", projectName];
  console.log(`Installing packages using ${command}...`);
  console.log();

  const proc = spawn.sync(command, args, { stdio: "inherit" });
  if (proc.status !== 0) {
    console.error(`\`${command} ${args.join(" ")}\` failed`);
    process.exit(1);
  }
}

export function buildNodeServer(projectName: string) {
  const command = "yarnpkg";
  const args = ["--cwd", path.join(projectName, "packages/server"), "build"];
  console.log(`Building the node server...`);
  console.log();

  const proc = spawn.sync(command, args, { stdio: "inherit" });
  if (proc.status !== 0) {
    console.error(`\`${command} ${args.join(" ")}\` failed`);
    process.exit(1);
  }
}

export function runPrettier(projectName: string) {
  const command = "yarnpkg";
  const args = ["--cwd", projectName, "prettier"];
  const proc = spawn.sync(command, args, { stdio: "inherit" });
  if (proc.status !== 0) {
    console.error(`\`${command} ${args.join(" ")}\` failed`);
    process.exit(1);
  }
}
