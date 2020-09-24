import * as pulumi from "@pulumi/pulumi";
import fs from "fs";

import { Env } from "./common";

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

export function overrideEnvVars(filename: string, env: Env = {}) {
  let content: string = fs.existsSync(filename)
    ? fs.readFileSync(filename, "utf8")
    : "";

  pulumi.all(Object.values(env)).apply((values) => {
    Object.keys(env).forEach((name, index) => {
      const value = values[index];
      const regex = new RegExp(`^${name}=.*?$`, "gm");
      if (content.match(regex)) {
        content = content.replace(regex, `${name}=${value}`);
      } else {
        content = content.concat(
          `${
            content.endsWith("\n") || content.length === 0 ? "" : "\n"
          }${name}=${value || ""}\n`
        );
      }
    });

    fs.writeFileSync(filename, content);
  });
}
