import * as pulumi from "@pulumi/pulumi";
import { StaticWebsite } from "cfs-pulumi";
import path from "path";

const webPath = "../web";

const stack = pulumi.getStack();
const config = new pulumi.Config();
const auth0Stack = new pulumi.StackReference(
  `${config.require("organization")}/cfs-server/${stack}`
);

new StaticWebsite(path.basename(webPath), {
  certificateArn: auth0Stack.getOutput("certificateArn") as pulumi.Output<
    string
  >,
  domain: config.require("domain"),
  webPath,
});
