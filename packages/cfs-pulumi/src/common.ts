import * as pulumi from "@pulumi/pulumi";

export type Env =
  | {
      [key: string]: pulumi.Output<string | undefined> | string | undefined;
    }
  | undefined;

export type InputEnv = pulumi.Input<
  | {
      [key: string]: pulumi.Input<string | undefined> | string | undefined;
    }
  | undefined
>;
