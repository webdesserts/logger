import React, { useState, useEffect, useContext } from "react";
import createAuth0Client from "@auth0/auth0-spa-js";

type Auth0ContextValue = {
  user: {} | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  isPopupOpen: boolean,
  loginWithPopup: () => void,
  handleRedirectCallback: () => void,

  getIdTokenClaims: () => void,
  loginWithRedirect: () => void,
  getTokenSilently: () => void,
  getTokenWithPopup: () => void,
  logout: () => void
}

type Auth0ProviderProps = {
  children?: React.ReactNode
} & Auth0ClientOptions

const DEFAULT_REDIRECT_CALLBACK = () => {
  window.history.replaceState({}, document.title, window.location.pathname);
}

const defaultContext: Auth0ContextValue = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isPopupOpen: false,
  loginWithPopup () {},
  handleRedirectCallback () {},
  getIdTokenClaims () {},
  loginWithRedirect () {},
  getTokenSilently () {},
  getTokenWithPopup () {},
  logout () {},
}

export const Auth0Context = React.createContext<Auth0ContextValue>(defaultContext);
export const useAuth = () => useContext(Auth0Context);
export const AuthProvider:React.FC<Auth0ProviderProps> = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}) => {
  const [user, setUser] = useState();
  const [auth0Client, setAuth0] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [isLoading, setLoading] = useState(true);
  const [isPopupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions);
      setAuth0(auth0FromHook);

      if (window.location.search.includes("code=")) {
        const { appState } = await auth0FromHook.handleRedirectCallback();
        onRedirectCallback(appState);
      }

      const isAuthenticated = await auth0FromHook.isAuthenticated();

      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const user = await auth0FromHook.getUser();
        setUser(user);
      }

      setLoading(false);
    };
    initAuth0();
  }, []);

  const loginWithPopup = async (params = {}) => {
    setPopupOpen(true);
    try {
      await auth0Client.loginWithPopup(params);
    } catch (error) {
      console.error(error);
    } finally {
      setPopupOpen(false);
    }
    const user = await auth0Client.getUser();
    setUser(user);
    setIsAuthenticated(true);
  };

  const handleRedirectCallback = async () => {
    setLoading(true);
    await auth0Client.handleRedirectCallback();
    const user = await auth0Client.getUser();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(user);
  };
  let value: Auth0ContextValue = {
    user,
    isAuthenticated,
    isLoading,
    isPopupOpen,
    loginWithPopup,
    handleRedirectCallback,
    getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
    loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
    getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
    getTokenWithPopup: (...p) => auth0Client.getTokenWithPopup(...p),
    logout: (...p) => auth0Client.logout(...p)
  } 
  let Provider = Auth0Context.Provider;
  return <Provider value={value}>{children}</Provider>
} ;