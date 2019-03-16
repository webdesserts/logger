import React, { useState } from 'react'
import produce from 'immer'

export { Model }

type Provider<S> = React.FunctionComponent<ProviderProps<S>>
type ProviderProps<S> = { model: Model<S>, children: React.ReactChild }
type ModelClass<T> = { new(...args: any[]) : T }

type StateCallback<S> = ((state: S) => S | void)

class Model<S> {
  readonly state: S;
  protected setState: (state: StateCallback<S>) => void;
  protected init() {}
  constructor(state: S, setState: (state: StateCallback<S>) => void) {
    this.state = state;
    this.setState = setState;
    this.init()
  }

  protected produceState(recipe: (draft: S) => S | void) {
    this.setState((state: S) => {
      return produce(state, recipe) as S
    });
  }

  static createContext<S, T extends Model<S>>(this: ModelClass<T>, initialState: S): [Provider<S>, () => T] {
    let self = this;
    let defaultInst = new self(initialState, () => { });
    const Context = React.createContext(defaultInst);

    function Provider(props: ProviderProps<S>) {
      return (
        <Context.Provider value={defaultInst}>
          {props.children}
        </Context.Provider>
      )
    }

    function useHook() {
      return React.useContext(Context);
    }

    return [Provider, useHook];
  }

  static use<S, T extends Model<S>>(this: ModelClass<T>, initialState: S): Model<S> {
    let self = this;
    let [ state, setState ] = useState(initialState)
    return new self(state, setState);
  }
}