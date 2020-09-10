import * as auth0 from "@pulumi/auth0";
import * as pulumi from "@pulumi/pulumi";

export interface Auth0Args {
  resourceServerName: string;
  web?: {
    clientName: string;
    /**
     * The website URL.
     *
     * Set as the Auth0 web client allowed logout and callback URL.
     */
    url: string;
  };
  mobile?: {
    clientName: string;
    /**
     * Your Expo username. Found by running `expo whoami`.
     *
     * Used for constructing the Auth0 mobile client callback URL.
     */
    expoUsername: string;
    /**
     * The Expo app slug. Found in `packages/mobile/app.json`.
     *
     * Used for constructing the Auth0 mobile client callback URL.
     */
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
      /**
       * The unique identifier of the audience for an issued token, identified
       * within a JSON Web Token as the `aud` claim. The audience value is
       * either the application (`Client ID`) for an ID Token or the API that
       * is being called (`API Identifier`) for an Access Token. At Auth0, the
       * Audience value sent in a request for an Access Token dictates whether
       * that token is returned in an opaque or JWT format.
       */
      audience: this.audience,
      /**
       * The generated Auth0 SPA application client ID.
       */
      webClientId: this.webClientId,
      /**
       * The generated Auth0 native application client ID.
       */
      mobileClientId: this.mobileClientId,
    });
  }
}
