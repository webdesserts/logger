import React, { useState } from 'react'
import produce, { Draft, Produced, PatchListener } from 'immer'

export { Model }

type Provider<S> = React.FunctionComponent<ProviderProps<S>>
type ProviderProps<S> = { state?: S, children: React.ReactChild }
type ModelClass<T> = { new(...args: any[]) : T }

class Model<S> {
  readonly state: S;
  protected setState: (state: (state: S) => S) => void;
  constructor(state: S, setState: (state: (state: S) => S ) => void) {
    this.state = state;
    this.setState = setState;
  }

  protected produceState(recipe: (draft: Draft<S>) => S | void) {
    this.setState((state: S) => {
      return produce(state, recipe) as S
    });
  }

  static createContext<S, T extends Model<S>>(this: ModelClass<T>, initialState: S): [Provider<S>, () => T] {
    let self = this;
    let defaultInst = new self(initialState, () => { });
    const Context = React.createContext(defaultInst);

    function Provider(props: ProviderProps<S>) {
      let [state, setState] = useState(props.state || initialState);

      let inst = new self(state, setState);

      return (
        <Context.Provider value={inst}>
          {props.children}
        </Context.Provider>
      )
    }

    function useHook() {
      return React.useContext(Context);
    }

    return [Provider, useHook];
  }
}