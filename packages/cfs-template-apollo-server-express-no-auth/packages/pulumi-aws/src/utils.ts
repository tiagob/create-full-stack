// @remove-mobile-begin
import * as pulumi from "@pulumi/pulumi";
import spawn from "cross-spawn";
// @remove-mobile-end

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

// @remove-mobile-begin
export function publishExpo(graphqlUrl: string, mobilePath: string) {
  // https://docs.expo.io/workflow/publishing/
  spawn.sync("expo", ["publish", "--release-channel", pulumi.getStack()], {
    cwd: mobilePath,
    env: {
      ...process.env,
      GRAPHQL_URL: graphqlUrl,
    },
  });
}
// @remove-mobile-end
