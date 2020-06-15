import createAuth0Client, {
  Auth0ClientOptions,
  getIdTokenClaimsOptions,
  GetTokenSilentlyOptions,
  GetTokenWithPopupOptions,
  IdToken,
  LogoutOptions,
  PopupLoginOptions,
  RedirectLoginOptions,
  RedirectLoginResult,
} from "@auth0/auth0-spa-js";
import Auth0Client from "@auth0/auth0-spa-js/dist/typings/Auth0Client";
import React, { useContext, useEffect, useState } from "react";

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

interface Auth0Context {
  isAuthenticated: boolean;
  user?: User;
  loading: boolean;
  popupOpen: boolean;
  loginWithPopup?(options: PopupLoginOptions): Promise<void>;
  handleRedirectCallback?(): Promise<RedirectLoginResult>;
  getIdTokenClaims?(o?: getIdTokenClaimsOptions): Promise<IdToken>;
  loginWithRedirect?(o: RedirectLoginOptions): Promise<void>;
  getTokenSilently?(o?: GetTokenSilentlyOptions): Promise<string | undefined>;
  getTokenWithPopup?(o?: GetTokenWithPopupOptions): Promise<string | undefined>;
  logout?(o?: LogoutOptions): void;
  token?: string;
}
interface Auth0ProviderOptions {
  children: React.ReactElement;
  onRedirectCallback?(result: RedirectLoginResult): void;
}

const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);

export const Auth0Context = React.createContext<Auth0Context>({
  isAuthenticated: false,
  user: undefined,
  loading: true,
  popupOpen: false,
  loginWithPopup: undefined,
  handleRedirectCallback: undefined,
  getIdTokenClaims: undefined,
  loginWithRedirect: undefined,
  getTokenWithPopup: undefined,
  logout: undefined,
  token: undefined,
});
export const useAuth0 = () => useContext(Auth0Context);
export const Auth0Provider = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}: Auth0ProviderOptions & Auth0ClientOptions) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState();
  const [auth0Client, setAuth0] = useState<Auth0Client>();
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions);
      setAuth0(auth0FromHook);

      if (
        window.location.search.includes("code=") &&
        window.location.search.includes("state=")
      ) {
        const { appState } = await auth0FromHook.handleRedirectCallback();
        onRedirectCallback(appState);
      }

      const isUserAuthenticated = await auth0FromHook.isAuthenticated();

      setIsAuthenticated(isUserAuthenticated);

      if (isUserAuthenticated) {
        const auth0User = await auth0FromHook.getUser();
        setUser(auth0User);
      }

      setLoading(false);
    };
    initAuth0();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginWithPopup = async (params: PopupLoginOptions) => {
    if (!auth0Client) {
      return;
    }

    setPopupOpen(true);
    try {
      await auth0Client.loginWithPopup(params);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setPopupOpen(false);
    }
    const auth0User = await auth0Client.getUser();
    setUser(auth0User);
    setIsAuthenticated(true);
  };

  const handleRedirectCallback = async () => {
    if (!auth0Client) {
      return { appState: undefined };
    }

    setLoading(true);
    const result = await auth0Client.handleRedirectCallback();
    const auth0User = await auth0Client.getUser();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(auth0User);
    return result;
  };

  const [token, setToken] = useState<string | undefined>();
  useEffect(() => {
    const getToken = async () => {
      const t = await auth0Client?.getTokenSilently();
      setToken(t);
    };
    getToken();
  }, [auth0Client]);

  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        popupOpen,
        loginWithPopup,
        handleRedirectCallback,
        getIdTokenClaims: auth0Client
          ? (o: getIdTokenClaimsOptions | undefined) =>
              auth0Client.getIdTokenClaims(o)
          : undefined,
        loginWithRedirect: auth0Client
          ? (o: RedirectLoginOptions) => auth0Client.loginWithRedirect(o)
          : undefined,
        getTokenWithPopup: auth0Client
          ? (o: GetTokenWithPopupOptions | undefined) =>
              auth0Client.getTokenWithPopup(o)
          : undefined,
        logout: auth0Client
          ? (o: LogoutOptions | undefined) => auth0Client.logout(o)
          : undefined,
        token,
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
