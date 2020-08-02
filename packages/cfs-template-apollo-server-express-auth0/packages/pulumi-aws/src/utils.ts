import * as pulumi from "@pulumi/pulumi";
// @remove-mobile-begin
import spawn from "cross-spawn";
// @remove-mobile-end
import fs from "fs";

import Auth0 from "./components/auth0";

// Split a domain name into its subdomain and parent domain names.
// e.g. "www.example.com" => "www", "example.com".
export function getDomainAndSubdomain(domain: string) {
  const parts = domain.split(".");
  if (parts.length < 2) {
    throw new Error(`No TLD found on ${domain}`);
  }
  // No subdomain, e.g. awesome-website.com.
  if (parts.length === 2) {
    return { subdomain: "", parentDomain: domain };
  }

  const subdomain = parts[0];
  parts.shift(); // Drop first element.
  return {
    subdomain,
    // Trailing "." to canonicalize domain.
    parentDomain: `${parts.join(".")}.`,
  };
}

function overrideEnvVars(
  envFilename: string,
  envVars: { [index: string]: string | undefined }
) {
  let content: string = fs.existsSync(envFilename)
    ? fs.readFileSync(envFilename, "utf8")
    : "";

  for (const [key, value] of Object.entries(envVars)) {
    const regex = new RegExp(`^${key}=.*?$`, "gm");
    if (content.match(regex)) {
      content = content.replace(regex, `${key}=${value}`);
    } else {
      content = content.concat(
        `${content.endsWith("\n") || content.length === 0 ? "" : "\n"}${key}=${
          value || ""
        }\n`
      );
    }
  }

  fs.writeFileSync(envFilename, content);
}

// TODO: #100 Cleanup when there's neither web nor mobile
export function setDevelopmentEnv(
  auth0: Auth0,
  auth0Domain: string,
  serverPath: string,
  // @remove-web-begin
  graphqlUrl: string,
  webPath: string,
  // @remove-web-end
  // @remove-mobile-begin
  mobilePath: string
  // @remove-mobile-end
) {
  pulumi
    .all([
      auth0.audience,
      // @remove-web-begin
      auth0.webClientId,
      // @remove-web-end
      // @remove-mobile-begin
      auth0.mobileClientId,
      // @remove-mobile-end
    ])
    .apply(
      ([
        audience,
        // @remove-web-begin
        webClientId,
        // @remove-web-end
        // @remove-mobile-begin
        mobileClientId,
        // @remove-mobile-end
      ]) => {
        overrideEnvVars(`${serverPath}/.env.development`, {
          AUTH0_AUDIENCE: audience,
          AUTH0_DOMAIN: auth0Domain,
        });
        // @remove-web-begin
        overrideEnvVars(`${webPath}/.env.development`, {
          REACT_APP_GRAPHQL_URL: graphqlUrl,
          REACT_APP_AUTH0_CLIENT_ID: webClientId,
          REACT_APP_AUTH0_AUDIENCE: audience,
          REACT_APP_AUTH0_DOMAIN: auth0Domain,
        });
        // @remove-web-end
        // @remove-mobile-begin
        overrideEnvVars(`${mobilePath}/.env.development`, {
          AUTH0_CLIENT_ID: mobileClientId,
          AUTH0_AUDIENCE: audience,
          AUTH0_DOMAIN: auth0Domain,
        });
        // @remove-mobile-end
      }
    );
}

// @remove-mobile-begin
export function publishExpo(
  graphqlUrl: string,
  mobilePath: string,
  auth0: Auth0,
  auth0Domain: string
) {
  pulumi
    .all([auth0.audience, auth0.mobileClientId])
    .apply(([audience, clientId]) => {
      // https://docs.expo.io/workflow/publishing/
      spawn.sync("expo", ["publish", "--release-channel", pulumi.getStack()], {
        cwd: mobilePath,
        env: {
          ...process.env,
          GRAPHQL_URL: graphqlUrl,
          AUTH0_AUDIENCE: audience,
          AUTH0_DOMAIN: auth0Domain,
          AUTH0_CLIENT_ID: clientId,
        },
      });
    });
}
// @remove-mobile-end
