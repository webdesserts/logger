import { Reducer } from 'redux'
import { DateTime } from 'luxon'
import { createAction } from 'typesafe-actions'
import { ExtractActions } from '../../store'
import { Optional, Drop } from '../../types'
import produce from 'immer'
import nanoid from 'nanoid'

/*=======*\
*  Types  *
\*=======*/

export type State = Entry[]
export type Actions = ExtractActions<typeof creators>

export type Entry = {
  id: string,
  project: string,
  sector: string,
  description: string,
  start: DateTime,
  end: DateTime,
}
export type EntryData = Drop<'id', Entry>

/*==========*\
*  Creators  *
\*==========*/

export const creators = {
  create: createAction('@entries/CREATE', resolve =>
    (entry: Optional<'id', Entry>) =>
      resolve(entry)
  ),
  update: createAction('@entries/UPDATE', resolve => 
    (id: string, changes: Partial<EntryData>) =>
      resolve({ id, changes })
  ),
  remove: createAction('@entries/REMOVE', resolve => 
    (id: string) =>
      resolve({ id })
  )
}

/*=========*\
*  Reducer  *
\*=========*/

const initialState: State = []

export const reducer: Reducer<State, Actions> = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch(action.type) {
      case '@entries/CREATE': {
        let {
          id = nanoid(8),
          ...entryData
        } = action.payload

        draft.push({ id, ...entryData })
        return;
      }
      case '@entries/UPDATE': {
        let i = draft.findIndex((entry) => entry.id === action.payload.id)
        Object.assign(draft[i], action.payload.changes)
        return;
      }
      case '@entries/REMOVE': {
        let i = draft.findIndex((entry) => entry.id === action.payload.id)
        draft.splice(i, 1)
        return;
      }
    }
  })
}