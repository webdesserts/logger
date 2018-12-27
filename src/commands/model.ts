import { Model } from '../model';

/*=======*\
*  Types  *
\*=======*/

export type ContextsState = Context[]
export type Context = { path: string, id?: string }

/*=======*\
*  Model  *
\*=======*/

export class ContextsModel extends Model<ContextsState> {
  match(search: Context) {
    return this.state.find((context: Context) => (
      context.path === search.path &&
      context.id === search.id
    ))
  }
  add(context: Context) {
    let match = this.match(context)
    this.produceState((draft) => {
      if (!match) draft.push(context)
    })
  }
  remove(context: Context) {
    let match = this.match(context)
    this.produceState((draft) => {
      if (match) draft.splice(draft.indexOf(match), 1)
    })
  }
}

const initialState: ContextsState = []
export const [ ContextsProvider, useContexts ] = ContextsModel.createContext(initialState)