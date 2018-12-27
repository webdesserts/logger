import { Nullable, Empty } from '../../types'
import { Entry } from './entries'
import nanoid from 'nanoid'
import { Model } from './model';

/*=======*\
*  Types  *
\*=======*/

export type ActiveEntryState = Nullable<'start', Empty<'end', Entry>>

/*=======*\
*  Model  *
\*=======*/

export class ActiveEntryModel extends Model<ActiveEntryState> {
  update(entry: Partial<ActiveEntryState>) {
    this.produceState((draft) => {
      Object.assign(draft, entry)
    })
  }
  reset() {
    this.produceState((draft) => {
      draft.id = nanoid(8)
      draft.description = ''
      draft.start = null
    })
  }
}

export const initialState: ActiveEntryState = { id: nanoid(8), sector: '', project: '', description: '', start: null }
export const [ ActiveEntryProvider, useActiveEntry ] = ActiveEntryModel.createContext(initialState)