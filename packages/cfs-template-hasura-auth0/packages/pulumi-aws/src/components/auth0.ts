import * as auth0 from "@pulumi/auth0";
import * as pulumi from "@pulumi/pulumi";
import fs from "fs";

// @remove-mobile-begin
import mobileConfig from "../../../mobile/app.json";
// @remove-mobile-end

export interface Auth0Args {
  resourceServerName: string;
  // @remove-web-begin
  webClientName: string;
  webUrl: string;
  // @remove-web-end
  // @remove-mobile-begin
  mobileClientName: string;
  expoUsername: string;
  // @remove-mobile-end
}

export default class Auth0 extends pulumi.ComponentResource {
  audience: pulumi.Output<string | undefined>;

  // @remove-web-begin
  webClientId: pulumi.Output<string>;
  // @remove-web-end

  // @remove-mobile-begin
  mobileClientId: pulumi.Output<string>;
  // @remove-mobile-end

  constructor(name: string, args: Auth0Args, opts?: pulumi.ResourceOptions) {
    const {
      resourceServerName,
      // @remove-web-begin
      webClientName,
      webUrl,
      // @remove-web-end
      // @remove-mobile-begin
      mobileClientName,
      expoUsername,
      // @remove-mobile-end
    } = args;
    super("auth0:Auth0", name, args, opts);

    // @remove-web-begin
    this.webClientId = new auth0.Client(
      `${name}-web-client`,
      {
        isTokenEndpointIpHeaderTrusted: false,
        name: webClientName,
        isFirstParty: true,
        oidcConformant: true,
        ssoDisabled: false,
        crossOriginAuth: false,
        allowedLogoutUrls: [webUrl],
        callbacks: [webUrl],
        jwtConfiguration: {
          alg: "RS256",
          lifetimeInSeconds: 36000,
          secretEncoded: false,
        },
        tokenEndpointAuthMethod: "none",
        appType: "spa",
        grantTypes: ["authorization_code", "implicit", "refresh_token"],
        webOrigins: [webUrl],
        customLoginPageOn: true,
      },
      { parent: this }
    ).clientId;
    // @remove-web-end

    // @remove-mobile-begin
    this.mobileClientId = new auth0.Client(
      `${name}-mobile-client`,
      {
        isTokenEndpointIpHeaderTrusted: false,
        name: mobileClientName,
        isFirstParty: true,
        oidcConformant: true,
        ssoDisabled: false,
        crossOriginAuth: false,
        callbacks: [
          `https://auth.expo.io/@${expoUsername}/${mobileConfig.slug}`,
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
    // @remove-mobile-end

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

    new auth0.Rule(`${name}-rule`, {
      name: "hasuraAccessToken",
      enabled: true,
      script: fs.readFileSync("./auth0-rules/hasuraAccessToken.js", "utf8"),
    });

    new auth0.Prompt(`${name}-prompt`, {
      universalLoginExperience: "new",
    });

    this.registerOutputs({
      audience: this.audience,
      // @remove-web-begin
      webClientId: this.webClientId,
      // @remove-web-end
      // @remove-mobile-begin
      mobileClient: this.mobileClientId,
      // @remove-mobile-end
    });
  }
}
