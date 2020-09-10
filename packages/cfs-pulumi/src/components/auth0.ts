import * as auth0 from "@pulumi/auth0";
import * as pulumi from "@pulumi/pulumi";

export interface Auth0Args {
  resourceServerName: string;
  web?: {
    clientName: string;
    url: string;
  };
  mobile?: {
    clientName: string;
    expoUsername: string;
    slug: string;
  };
}

export default class Auth0 extends pulumi.ComponentResource {
  audience: pulumi.Output<string | undefined>;

  webClientId: pulumi.Output<string> | undefined;

  mobileClientId: pulumi.Output<string> | undefined;

  constructor(name: string, args: Auth0Args, opts?: pulumi.ResourceOptions) {
    const { resourceServerName, web, mobile } = args;
    super("auth0:Auth0", name, args, opts);

    if (web) {
      this.webClientId = new auth0.Client(
        `${name}-web-client`,
        {
          isTokenEndpointIpHeaderTrusted: false,
          name: web.clientName,
          isFirstParty: true,
          oidcConformant: true,
          ssoDisabled: false,
          crossOriginAuth: false,
          allowedLogoutUrls: [web.url],
          callbacks: [web.url],
          jwtConfiguration: {
            alg: "RS256",
            lifetimeInSeconds: 36000,
            secretEncoded: false,
          },
          tokenEndpointAuthMethod: "none",
          appType: "spa",
          grantTypes: ["authorization_code", "implicit", "refresh_token"],
          webOrigins: [web.url],
          customLoginPageOn: true,
        },
        { parent: this }
      ).clientId;
    }

    if (mobile) {
      this.mobileClientId = new auth0.Client(
        `${name}-mobile-client`,
        {
          isTokenEndpointIpHeaderTrusted: false,
          name: mobile.clientName,
          isFirstParty: true,
          oidcConformant: true,
          ssoDisabled: false,
          crossOriginAuth: false,
          callbacks: [
            `https://auth.expo.io/@${mobile.expoUsername}/${mobile.slug}`,
          ],
          jwtConfiguration: {
            alg: "RS256",
            lifetimeInSeconds: 36000,
            secretEncoded: false,
          },
          tokenEndpointAuthMethod: "none",
          appType: "native",
          grantTypes: ["authorization_code", "implicit", "refresh_token"],
          customLoginPageOn: true,
        },
        { parent: this }
      ).clientId;
    }

    this.audience = new auth0.ResourceServer(
      `${name}-resource-server`,
      {
        name: resourceServerName,
        identifier: resourceServerName,
        allowOfflineAccess: false,
        skipConsentForVerifiableFirstPartyClients: true,
        tokenLifetime: 86400,
        tokenLifetimeForWeb: 7200,
        signingAlg: "RS256",
      },
      { parent: this }
    ).identifier;

    new auth0.Prompt(`${name}-prompt`, {
      universalLoginExperience: "new",
    });

    this.registerOutputs({
      audience: this.audience,
      webClientId: this.webClientId,
      mobileClient: this.mobileClientId,
    });
  }
}
