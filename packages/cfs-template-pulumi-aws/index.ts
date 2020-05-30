import * as fargate from "./src/fargate";
import * as staticWebsite from "./src/staticWebsite";

export const { url } = fargate;
export const { contentBucketUri } = staticWebsite;
export const { contentBucketWebsiteEndpoint } = staticWebsite;
