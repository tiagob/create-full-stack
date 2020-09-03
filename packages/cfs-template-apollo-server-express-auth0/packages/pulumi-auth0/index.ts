import * as pulumi from "@pulumi/pulumi";
import { Auth0, overrideEnvVars } from "cfs-pulumi";
import path from "path";

import mobileConfig from "../mobile/app.json";

const serverPath = "../server";
const webPath = "../web";
const mobilePath = "../mobile";

const stack = pulumi.getStack();
const config = new pulumi.Config();
const expoConfig = new pulumi.Config("expo");
const auth0Config = new pulumi.Config("auth0");
const isDevelopment = stack === "development";

export const webUrl = `${isDevelopment ? "http" : "https"}://${config.require(
  "domain"
)}`;
export const domain = auth0Config.require("domain");

export const { audience, webClientId, mobileClientId } = new Auth0("auth0", {
  resourceServerName: path.basename(serverPath),
  web: {
    clientName: path.basename(webPath),
    url: webUrl,
  },
  mobile: {
    clientName: path.basename(mobilePath),
    expoUsername: expoConfig.require("username"),
    expoLogoutUrl: expoConfig.require("logoutUrl"),
    slug: mobileConfig.slug,
  },
});

if (isDevelopment) {
  overrideEnvVars(`${serverPath}/.env.development`, {
    AUTH0_AUDIENCE: audience,
    AUTH0_DOMAIN: domain,
  });
  overrideEnvVars(`${webPath}/.env.development`, {
    REACT_APP_AUTH0_CLIENT_ID: webClientId,
    REACT_APP_AUTH0_AUDIENCE: audience,
    REACT_APP_AUTH0_DOMAIN: domain,
  });
  overrideEnvVars(`${mobilePath}/.env.development`, {
    AUTH0_CLIENT_ID: mobileClientId,
    AUTH0_AUDIENCE: audience,
    AUTH0_DOMAIN: domain,
  });
}
