import React from 'react'
import produce, { Draft } from 'immer'

type ProviderProps<S> = { state?: S, children: React.ReactChild }
type ModelClass<T> = { new(...args: any[]) : T }

export class Model<S> {
  readonly state: S;
  protected setState: (state: S) => void;
  constructor(state: S, setState: (state: S) => void) {
    this.state = state;
    this.setState = setState;
  }

  protected produceState(recipe: (draft: Draft<S>) => S | void) {
    this.setState(produce(this.state, recipe));
  }

  static createContext<S, T extends Model<S>>(this: ModelClass<T>, initialState: S):
  [ React.FunctionComponent<ProviderProps<S>>, () => T ]
   {
    let self = this;
    let inst = new self(initialState, () => {});
    const Context = React.createContext(inst);

    function Provider(props: ProviderProps<S>) {
      let [state, setState] = React.useState(props.state || initialState);

      let inst = new self(state, setState);

      return (
        <Context.Provider value={inst}>
          {props.children}
        </Context.Provider>
      );
    }

    function useHook () {
      return React.useContext(Context)
    }

    return [ Provider, useHook ];
  }
}
