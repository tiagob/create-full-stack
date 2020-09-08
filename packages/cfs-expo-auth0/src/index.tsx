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
  login?(): void;
  logout?(): void;
  user?: User;
  token?: string;
}
interface Auth0ProviderOptions {
  children: React.ReactElement;
  clientId: string;
  audience: string;
  domain: string;
  onLogin: () => void;
}

const useProxy = Platform.select({ web: false, default: true });
const redirectUri = AuthSession.makeRedirectUri({ useProxy });

export const Auth0Context = React.createContext<Auth0Context>({
  request: undefined,
  result: undefined,
  login: undefined,
  logout: undefined,
  user: undefined,
  token: undefined,
});
export const useAuth0 = () => useContext(Auth0Context);
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
