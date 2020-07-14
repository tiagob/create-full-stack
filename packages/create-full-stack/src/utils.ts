import spawn from "cross-spawn";

export function runYarn(cwd: string, args: string[] = []) {
  const command = "yarnpkg";
  const argsWithCwd = ["--cwd", cwd, ...args];
  const proc = spawn.sync(command, argsWithCwd, { stdio: "inherit" });
  if (proc.status !== 0) {
    console.error(`\`${command} ${argsWithCwd.join(" ")}\` failed`);
    process.exit(1);
  }
}

export function checkPulumiAndAws() {
  const pulumiProc = spawn.sync("pulumi", ["version"], { stdio: "inherit" });
  if (pulumiProc.status !== 0) {
    console.error(
      "Pulumi CLI is required. See https://www.pulumi.com/docs/get-started/aws/begin/#install-pulumi"
    );
    process.exit(1);
  }
  const awsProc = spawn.sync("aws", ["--version"], { stdio: "inherit" });
  if (awsProc.status !== 0) {
    console.error(
      "AWS CLI is required. See https://www.pulumi.com/docs/get-started/aws/begin/#configure-aws"
    );
    process.exit(1);
  }
}
