import { StateType } from 'typesafe-actions'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger';
import * as commands from './commands'

/*=======*\
*  Types  *
\*=======*/

// A Redux Action with Flux-style payloads
export type Action<T = string, P = {}> = { type: T, payload: P }

// Extracts all Action Creators listed in a given object
export type ActionCreators<A extends Action = Action> = { [key: string] : (...args: any[]) => A }

// Extracts the return type of all Action Creators listed a given object
export type ExtractActions<C extends ActionCreators<Action>> = C extends ActionCreators<infer A> ? A : never;

// Extracts the Action Type from an Action Creator
export type ExtractType<A> = A extends Action<infer T> ? T : never;

/*=========*\
*  Reducer  *
\*=========*/

const reducer = combineReducers({
  context: commands.reducer
})

/*=======*\
*  Store  *
\*=======*/

export type AppState = StateType<typeof reducer>
export const store = createStore(
  reducer,
  applyMiddleware(createLogger({ collapsed: true }))
)