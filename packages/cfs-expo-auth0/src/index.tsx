// Adapted from
// https://github.com/expo/examples/tree/master/with-auth0
import * as AuthSession from "expo-auth-session";
import * as Random from "expo-random";
import React, { useContext, useEffect, useState } from "react";
import { Alert, Platform } from "react-native";

export interface User {
  // Common auth0 user fields
  name: string;
  nickname: string;
  picture: string;
  sub: string;
  updated_at: string;

  // Google user fields
  email?: string;
  email_verified?: boolean;
  given_name?: string;
  family_name?: string;
  locale?: string;
}

// Create a custom type for result to fix AuthSession.AuthSessionResult
// https://github.com/expo/expo/issues/10104
type Result = {
  type: "cancel" | "dismiss" | "locked" | "error" | "success";
  errorCode?: string | null;
  error?: AuthSession.AuthError | null;
  params?: {
    [key: string]: string;
  };
  url?: string;
};

interface Auth0Context {
  request?: AuthSession.AuthRequest | null;
  result?: Result;
  /**
   * ```ts
   * await login();
   * ```
   *
   * Prompt the user to authenticate in a user interaction or web browsers will
   * block it.
   */
  login?(): void;
  user?: User;
  /**
   * The Auth0 access token.
   */
  token?: string;
}
interface Auth0ProviderOptions {
  /**
   * The child nodes your provider has wrapped.
   */
  children: React.ReactElement;
  /**
   * The client ID found on your application settings page.
   */
  clientId: string;
  /**
   * The default audience to be used for requesting API access.
   */
  audience: string;
  /**
   * Your Auth0 account domain such as `'example.auth0.com'`,
   * `'example.eu.auth0.com'` or , `'example.mycompany.com'`
   * (when using [custom domains](https://auth0.com/docs/custom-domains))
   */
  domain: string;
  /**
   * Callback for auth0 login.
   */
  onLogin: () => void;
}

const useProxy = Platform.select({ web: false, default: true });
const redirectUri = AuthSession.makeRedirectUri({ useProxy });

export const Auth0Context = React.createContext<Auth0Context>({
  request: undefined,
  result: undefined,
  login: undefined,
  user: undefined,
  token: undefined,
});
/**
 * ```ts
 * const {
 *   // Auth state:
 *   request,
 *   result,
 *   user,
 *   token,
 *   // Auth methods:
 *   login,
 * } = useAuth0();
 * ```
 *
 * Use the `useAuth0` hook in your components to access the auth state and methods.
 */
export const useAuth0 = () => useContext(Auth0Context);

/**
 * ```jsx
 * <Auth0Provider
 *   domain={domain}
 *   clientId={clientId}
 *   audience={audience}>
 *   <MyApp />
 * </Auth0Provider>
 * ```
 *
 * Provides the Auth0Context to its child components.
 */
export function Auth0Provider({
  children,
  clientId,
  audience,
  domain,
  onLogin,
}: Auth0ProviderOptions) {
  const [token, setToken] = useState<string | undefined>();
  const [user, setUser] = useState<User | undefined>();
  const [nonce, setNonce] = useState<string>("nonce");

  useEffect(() => {
    const getNonce = async () => {
      const randomBytes = await Random.getRandomBytesAsync(16);
      setNonce(randomBytes.toString());
    };
    getNonce();
  }, []);

  const authSessionParams = {
    redirectUri,
    clientId,
    // id_token will return a JWT token
    responseType: AuthSession.ResponseType.Token,
    // retrieve the user's profile
    scopes: ["openid", "profile"],
    extraParams: {
      nonce,
      audience,
    },
  };
  const authorizationEndpoint = `https://${domain}/authorize`;
  const [auth0request, auth0Result, promptAsync] = AuthSession.useAuthRequest(
    {
      ...authSessionParams,
      // Server should prompt the user to re-authenticate.
      prompt: AuthSession.Prompt.Login,
    },
    {
      authorizationEndpoint,
    } as AuthSession.DiscoveryDocument
  );
  // Re-login after token expiration since refresh tokens aren't possible
  // https://github.com/expo/examples/issues/209
  const [
    refreshAuth0Request,
    refreshAuth0Result,
    refreshPromptAsync,
  ] = AuthSession.useAuthRequest(
    {
      ...authSessionParams,
      // Server should NOT prompt the user to re-authenticate.
      prompt: AuthSession.Prompt.None,
    },
    {
      authorizationEndpoint,
    } as AuthSession.DiscoveryDocument
  );
  const result = (refreshAuth0Result || auth0Result) as Result;

  useEffect(() => {
    const getTokenAndUser = async () => {
      if (result) {
        if (result.error) {
          Alert.alert(
            "Authentication error",
            result?.params?.error_description || "something went wrong"
          );
          return;
        }
        if (result.type === "success") {
          // Retrieve the JWT token and decode it
          const accessToken = result?.params?.access_token;
          setToken(accessToken);
          if (result?.params?.expires_in) {
            setTimeout(() => {
              refreshPromptAsync?.({ useProxy });
            }, Number(result?.params?.expires_in) * 1000);
          }

          const userInfoResponse = await fetch(`https://${domain}/userinfo`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const userInfo = await userInfoResponse.json();
          setUser(userInfo);
          onLogin();
        }
      }
    };
    getTokenAndUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onLogin, result]);

  return (
    <Auth0Context.Provider
      value={{
        request: refreshAuth0Request || auth0request,
        result,
        login: () => promptAsync?.({ useProxy }),
        user,
        token,
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
}
