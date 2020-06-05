import * as pulumi from "@pulumi/pulumi";

import createFargate from "./src/createFargate";
import createRds from "./src/createRds";

// Import our Pulumi configuration.
const config = new pulumi.Config();

const { connectionString, cluster } = createRds(config);
const fargate = createFargate(connectionString, cluster);
// eslint-disable-next-line import/prefer-default-export
export const { url } = fargate;
