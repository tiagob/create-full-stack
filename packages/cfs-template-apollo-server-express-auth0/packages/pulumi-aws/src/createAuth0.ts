import * as auth0 from "@pulumi/auth0";

const localDevUrl = "http://localhost:3000";

export default function createAuth0(webUrl: string, graphqlServerUrl: string) {
  const webClient = new auth0.Client("web-client", {
    isTokenEndpointIpHeaderTrusted: false,
    name: "Web",
    isFirstParty: true,
    oidcConformant: true,
    ssoDisabled: false,
    crossOriginAuth: false,
    allowedLogoutUrls: [localDevUrl, webUrl],
    callbacks: [localDevUrl, webUrl],
    jwtConfiguration: {
      alg: "RS256",
      lifetimeInSeconds: 36000,
      secretEncoded: false,
    },
    tokenEndpointAuthMethod: "none",
    appType: "spa",
    grantTypes: ["authorization_code", "implicit", "refresh_token"],
    webOrigins: [localDevUrl, webUrl],
    customLoginPageOn: true,
  });

  // TODO: Conditionally create based on if mobile is selected
  const mobileClient = new auth0.Client("mobile-client", {
    isTokenEndpointIpHeaderTrusted: false,
    name: "Mobile",
    isFirstParty: true,
    oidcConformant: true,
    ssoDisabled: false,
    crossOriginAuth: false,
    // TODO: Set from CLI
    callbacks: ["https://auth.expo.io/@tiagsters/mobile"],
    jwtConfiguration: {
      alg: "RS256",
      lifetimeInSeconds: 36000,
      secretEncoded: false,
    },
    tokenEndpointAuthMethod: "none",
    appType: "native",
    grantTypes: ["authorization_code", "implicit", "refresh_token"],
    customLoginPageOn: true,
  });

  new auth0.ResourceServer("resource-server", {
    name: "Apollo Server Express",
    identifier: graphqlServerUrl,
    allowOfflineAccess: false,
    skipConsentForVerifiableFirstPartyClients: true,
    tokenLifetime: 86400,
    tokenLifetimeForWeb: 7200,
    signingAlg: "RS256",
  });

  return { webClient, mobileClient };
}
