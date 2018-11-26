import { DateTime } from 'luxon'
import { createAction } from 'typesafe-actions'
import { ExtractActions, Nullable, Empty } from './types'
import { Entry } from './entries'
import nanoid from 'nanoid'
import produce from 'immer'
import { Reducer } from 'redux';

/*=======*\
*  Types  *
\*=======*/

export type State = ActiveEntry
export type Actions = ExtractActions<typeof creators>
export type ActiveEntry = Nullable<'start', Empty<'end', Entry>>

/*==========*\
*  Creators  *
\*==========*/

export const creators = {
  update: createAction('@active_entry/UPDATE', resolve =>
    (entry: Partial<ActiveEntry>) => resolve(entry)),
  reset: createAction('@active_entry/RESET', resolve =>
    () => resolve({})
  ),
}

/*=========*\
*  Reducer  *
\*=========*/

export const initialState: State = { id: nanoid(8), sector: '', project: '', description: '', start: null }
export const reducer : Reducer<State, Actions> = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch(action.type) {
      case '@active_entry/UPDATE':
        Object.assign(draft, action.payload)
        return;
      case '@active_entry/RESET':
        draft.id = nanoid(8)
        draft.description = ''
        draft.start = null
        return;
    }
  })
}