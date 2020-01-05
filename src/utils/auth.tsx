import React, { useRef, useState, useEffect, useContext } from "react";
import createAuth0Client from "@auth0/auth0-spa-js";
import Auth0Client from "@auth0/auth0-spa-js/dist/typings/Auth0Client";

type Auth0ContextValue = {
  user: {} | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  isPopupOpen: boolean,
  loginWithPopup: Auth0Client['loginWithPopup'],
  handleRedirectCallback: Auth0Client['handleRedirectCallback'],

  getIdTokenClaims: Auth0Client['getIdTokenClaims'],
  loginWithRedirect: Auth0Client['loginWithRedirect'],
  getTokenSilently: Auth0Client['getTokenSilently'],
  getTokenWithPopup: Auth0Client['getTokenWithPopup'],
  logout: Auth0Client['logout']
}

type Auth0ProviderProps = {
  children?: React.ReactNode
} & Auth0ClientOptions

const DEFAULT_REDIRECT_CALLBACK = () => {
  window.history.replaceState({}, document.title, window.location.pathname);
}

const calledBeforeReady = () : never => {
  throw new Error('Called Before Ready')
}

const defaultContext: Auth0ContextValue = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isPopupOpen: false,
  loginWithPopup: calledBeforeReady,
  handleRedirectCallback: calledBeforeReady,
  getIdTokenClaims: calledBeforeReady,
  loginWithRedirect: calledBeforeReady,
  getTokenSilently: calledBeforeReady,
  getTokenWithPopup: calledBeforeReady,
  logout: calledBeforeReady,
}

export const Auth0Context = React.createContext<Auth0ContextValue>(defaultContext);
export const useAuth = () => useContext(Auth0Context);
export const AuthProvider:React.FC<Auth0ProviderProps> = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}) => {
  const [user, setUser] = useState(null);
  const [auth0ClientPromise] = useState<Promise<Auth0Client>>(createAuth0Client(initOptions));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isPopupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const initAuth0 = async () => {
      let client;
      try {
        client = await auth0ClientPromise
      } catch(error) {
        console.log({ error })
      }

      if (window.location.search.includes("code=")) {
        const { appState } = await client.handleRedirectCallback();
        onRedirectCallback(appState);
      }

      const isAuthenticated = await client.isAuthenticated();

      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const user = await client.getUser();
        setUser(user);
      }

      setLoading(false);
    };
    initAuth0();
  }, []);

  const loginWithPopup = async (params = {}) => {
    setPopupOpen(true);
    const client = await auth0ClientPromise
    try {
      await client.loginWithPopup(params);
    } catch (error) {
      console.error(error);
    } finally {
      setPopupOpen(false);
    }
    const user = await client.getUser();
    setUser(user);
    setIsAuthenticated(true);
  };

  const handleRedirectCallback = async () => {
    setLoading(true);
    const client = await auth0ClientPromise
    const result = await client.handleRedirectCallback();
    const user = await client.getUser();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(user);
    return result
  };
  let value: Auth0ContextValue = {
    user,
    isAuthenticated,
    isLoading,
    isPopupOpen,
    loginWithPopup,
    handleRedirectCallback,
    getIdTokenClaims: (...p) => auth0ClientPromise.then((client) => client.getIdTokenClaims(...p)),
    loginWithRedirect: (...p) => auth0ClientPromise.then((client) => client.loginWithRedirect(...p)),
    getTokenSilently: (...p) => auth0ClientPromise.then((client) => client.getTokenSilently(...p)),
    getTokenWithPopup: (...p) => auth0ClientPromise.then((client) => client.getTokenWithPopup(...p)),
    logout: (...p) => auth0ClientPromise.then((client) => client.logout(...p)),
  } 
  let Provider = Auth0Context.Provider;
  return <Provider value={value}>{children}</Provider>
} ;