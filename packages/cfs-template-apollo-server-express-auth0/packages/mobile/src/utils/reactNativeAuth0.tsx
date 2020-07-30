// Adapted from
// https://github.com/expo/examples/tree/master/with-auth0
import * as AuthSession from "expo-auth-session";
import * as Random from "expo-random";
import React, { useContext, useEffect, useState } from "react";
import { Alert, Platform } from "react-native";

interface User {
  // Database & Google user
  name: string;
  nickname: string;
  picture: string;
  sub: string;
  updated_at: string;

  // Google user
  email?: string;
  email_verified?: boolean;
  given_name?: string;
  family_name?: string;
  locale?: string;
}

// Create a custom type for result to fix AuthSession.AuthSessionResult
// https://github.com/microsoft/TypeScript/issues/12815
// TODO: File an expo bug
// https://github.com/expo/expo/issues/new?labels=Issue+needs+review&template=bug_report.md
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
  loginWithRedirect?(): void;
  user?: User;
  token?: string;
}
interface Auth0ProviderOptions {
  children: React.ReactElement;
  clientId: string;
  audience: string;
  authorizationEndpoint: string;
  onRedirectCallback(): void;
}

const useProxy = Platform.select({ web: false, default: true });
const redirectUri = AuthSession.makeRedirectUri({ useProxy });

export const Auth0Context = React.createContext<Auth0Context>({
  request: undefined,
  result: undefined,
  loginWithRedirect: undefined,
  user: undefined,
  token: undefined,
});
export const useAuth0 = () => useContext(Auth0Context);
export const Auth0Provider = ({
  children,
  clientId,
  audience,
  authorizationEndpoint,
  onRedirectCallback,
}: Auth0ProviderOptions) => {
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

  const [request, auth0Result, promptAsync] = AuthSession.useAuthRequest(
    {
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
    },
    {
      authorizationEndpoint,
    } as AuthSession.DiscoveryDocument
  );
  const result = auth0Result as Result;

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

          const userInfoResponse = await fetch(
            `https://${process.env.AUTH0_DOMAIN}/userinfo`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          const userInfo = await userInfoResponse.json();
          setUser(userInfo);
          onRedirectCallback();
        }
      }
    };
    getTokenAndUser();
  }, [onRedirectCallback, result]);

  return (
    <Auth0Context.Provider
      value={{
        request,
        result,
        loginWithRedirect: () => promptAsync?.({ useProxy }),
        user,
        // TODO: Token refresh
        token,
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
