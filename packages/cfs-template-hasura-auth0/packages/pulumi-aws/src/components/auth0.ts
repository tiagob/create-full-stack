import * as auth0 from "@pulumi/auth0";
import * as pulumi from "@pulumi/pulumi";

const localDevUrl = "http://localhost:3000";

export interface Auth0Args {
  webUrl: string;
  graphqlUrl: string;
  auth0MobileCallback: string;
}

export default class Auth0 extends pulumi.ComponentResource {
  webClientId: pulumi.Output<string>;

  mobileClientId: pulumi.Output<string>;

  constructor(name: string, args: Auth0Args, opts?: pulumi.ResourceOptions) {
    const { webUrl, graphqlUrl, auth0MobileCallback } = args;
    super("auth0:Auth0", name, args, opts);

    this.webClientId = new auth0.Client(
      `${name}-web-client`,
      {
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
      },
      { parent: this }
    ).clientId;

    // TODO: Conditionally create based on if mobile is selected
    this.mobileClientId = new auth0.Client(
      `${name}-mobile-client`,
      {
        isTokenEndpointIpHeaderTrusted: false,
        name: "Mobile",
        isFirstParty: true,
        oidcConformant: true,
        ssoDisabled: false,
        crossOriginAuth: false,
        callbacks: [auth0MobileCallback],
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

    new auth0.ResourceServer(
      `${name}-resource-server`,
      {
        name: "Apollo Server Express",
        identifier: graphqlUrl,
        allowOfflineAccess: false,
        skipConsentForVerifiableFirstPartyClients: true,
        tokenLifetime: 86400,
        tokenLifetimeForWeb: 7200,
        signingAlg: "RS256",
      },
      { parent: this }
    );

    this.registerOutputs({
      webClientId: this.webClientId,
      mobileClient: this.mobileClientId,
    });
  }
}
