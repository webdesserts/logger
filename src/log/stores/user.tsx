import React, { useRef, useState, useEffect, useContext } from "react";
import createAuth0Client from "@auth0/auth0-spa-js";
import Auth0Client from "@auth0/auth0-spa-js/dist/typings/Auth0Client";
import { Store } from "../../utils/store";

const DEFAULT_REDIRECT_CALLBACK = () => {
  window.history.replaceState({}, document.title, window.location.pathname);
};

type UserState = {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

type Auth0ClientParams<K extends keyof Auth0Client> = Parameters<
  Auth0Client[K]
>;
type AuthProviderProps = {
  config: Auth0ClientOptions;
};

export class UserStore extends Store<UserState> {
  private static clientPromise: Promise<Auth0Client> | null = null;
  static initialState: UserState = {
    token: null,
    isAuthenticated: false,
    isLoading: true
  };

  static AuthProvider: React.FC<AuthProviderProps> = props => {
    const {
      onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
      ...otherConfig
    } = props.config;
    const user = UserStore.useState(UserStore.initialState);

    useEffect(() => {
      const initAuth0 = async () => {
        UserStore["clientPromise"] = createAuth0Client({
          onRedirectCallback,
          ...otherConfig
        });

        const client = await UserStore["clientPromise"];

        if (window.location.search.includes("code=")) {
          const { appState } = await client.handleRedirectCallback();
          onRedirectCallback(appState);
        }

        const isAuthenticated = await client.isAuthenticated();
        user.setState(state => ({ ...state, isAuthenticated }));

        if (isAuthenticated) {
          const token = await client.getTokenSilently();
          user.setState(state => ({ ...state, token }));
        }
        user.setState(state => ({ ...state, isLoading: false }));
      };
      initAuth0();
    }, []);
    return <UserProvider store={user}>{props.children}</UserProvider>;
  };

  private async getClient() {
    if (UserStore.clientPromise) {
      return await UserStore.clientPromise;
    } else {
      throw new Error("User method was called prior to mounting AuthProvider");
    }
  }

  login = async (...params: Auth0ClientParams<"loginWithRedirect">) => {
    const client = await this.getClient();
    return await client.loginWithRedirect(...params);
  };

  logout = async (...params: Auth0ClientParams<"logout">) => {
    const client = await this.getClient();
    return await client.logout(...params);
  };

  handleRedirectCallback = async (
    ...params: Auth0ClientParams<"handleRedirectCallback">
  ) => {
    this.setState(state => ({ ...state, isLoading: true }));
    const client = await this.getClient();
    const result = await client.handleRedirectCallback(...params);
    const token = await client.getTokenSilently();
    this.setState(state => ({
      ...state,
      isAuthenticated: true,
      isLoading: false,
      token
    }));
    return result;
  };
}

const [UserProvider, useUser] = UserStore.createContext(UserStore.initialState);
const AuthProvider = UserStore.AuthProvider;

export { useUser, AuthProvider };
