import React, { useState, useEffect } from 'react'
import produce from 'immer';

export { Store }

type Provider<S, T extends Store<S>> = React.FunctionComponent<ProviderProps<S, T>>
type ProviderProps<S, M extends Store<S>> = { store: M, children: React.ReactChild }
type StoreClass<T> = { new(...args: any[]) : T }

type StateCallback<S> = ((state: S) => S | void)

abstract class Store<S> {
  // `this.state` should only be referenced during render.
  // If you need to modify the state based on the current state, use the version
  // of state passed to `this.setState` or `this.produceState`. This will ensure
  // you don't accidently overwrite your changes when you're making multiple
  // state writes at a time.
  readonly state: S;

  // This is the version of setState that is passed from React.useState().
  protected setState: (state: StateCallback<S>) => void;

  // A lifecycle hooks that works as a great place to log the current state of
  // a store each time it's created.
  protected init() {}

  constructor(state: S, setState: (state: StateCallback<S>) => void) {
    this.state = state;
    this.setState = setState;
    this.init();
  }

  // A combination of Immer's `produce()` and React's `setState()`. Sets the
  // Store's state based on modifications made to a mutable "draft" version of the state.
  protected produceState(recipe: (draft: S) => S | void) {
    // We have to use the callback version because otherwise multiple calls to the same function will override previous setStates in the queue
    this.setState(state => {
      let produced = produce(state, recipe) as S;
      // console.log(this.constructor.name, 'SET', produced);
      return produced;
    });
  }

  // Creates a React Context for this Store. Returns a Provider and a hook for using the context.
  static createContext<S, M extends Store<S>>(
    this: StoreClass<M>,
    initialState: S
  ): [Provider<S, M>, () => M] {
    let self = this;
    let defaultInst = new self(initialState, () => {});
    const Context = React.createContext(defaultInst);

    function Provider(props: ProviderProps<S, M>) {
      return (
        <Context.Provider value={props.store || defaultInst}>
          {props.children}
        </Context.Provider>
      );
    }

    function useHook() {
      return React.useContext(Context);
    }

    return [Provider, useHook];
  }

  // Like React's useState, but returns a version of the state that's wrapped in
  // a Store, giving it access to it's relavent methods.
  static useState<S, C extends Store<S>>(
    this: StoreClass<C>,
    initialState: S
  ): C {
    let self = this;
    let [state, setState] = useState(initialState);
    return new self(state, setState);
  }
}