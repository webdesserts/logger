import { StateType } from 'typesafe-actions'
import { createStore, combineReducers, applyMiddleware, Dispatch } from 'redux'
import { createLogger } from 'redux-logger';
import * as entries from './entries'
import * as active_entry from './active_entry'

const reducer = combineReducers({
  entries: entries.reducer,
  active_entry: active_entry.reducer
})

export const selectors = {
  all(store: AppState) { return { store } }
}

export type DispatchProps = {
  dispatch: Dispatch
}

export type AppState = StateType<typeof reducer>
export const store = createStore(
  reducer,
  applyMiddleware(createLogger({ collapsed: true }))
)