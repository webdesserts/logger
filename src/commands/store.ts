import { createAction } from 'typesafe-actions'
import { ExtractActions } from '../store'
import { Nullable, Empty } from '../types'
import { Reducer } from 'redux';
import produce from 'immer'

/*=======*\
*  Types  *
\*=======*/

export type State = Context[]
export type Actions = ExtractActions<typeof creators>

export type Context = { path: string, id?: string }

/*==========*\
*  Creators  *
\*==========*/

export const creators = {
  add: createAction('@context/ADD', resolve =>
    (context: Context) => resolve(context)),
  remove: createAction('@context/REMOVE', resolve =>
    (context: Context) => resolve(context)),
}

/*=========*\
*  Reducer  *
\*=========*/

export const initialState: State = []
export const reducer : Reducer<State, Actions> = (state = initialState, action) => {
  let match = state.find((context: Context) => (
    context.path === action.payload.path &&
    context.id === action.payload.id
  ))

  return produce(state, (draft) => {
    switch(action.type) {
      case '@context/ADD':
        if (!match) state.push(action.payload)
        return;
      case '@context/REMOVE':
        if (match) state.splice(state.indexOf(match), 1)
        return;
    }
  })
}