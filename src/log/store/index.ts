import { combineReducers } from 'redux'
import * as entries from './entries'
import * as active_entry from './active_entry'
import { AppState } from '../../store'

export const reducer = combineReducers({
  entries: entries.reducer,
  active_entry: active_entry.reducer
})

export const selectors = {
  log({ log }: AppState) { return { log } },
  entries({ log }: AppState) { return { entries: log.entries } },
  active_entry({ log }: AppState) { return { active_entry: log.active_entry } }
}