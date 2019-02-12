import { Nullable, Empty } from '../../utils/types'
import { Entry } from './entries'
import nanoid from 'nanoid'
import { Model } from '../../utils/model';
import { busyWork } from './fixtures';
import { DateTime } from 'luxon';

/*=======*\
*  Types  *
\*=======*/

export interface ActiveEntryState extends Nullable<'start', Empty<'end', Entry>> {
}

/*=======*\
*  Model  *
\*=======*/

export class ActiveEntryModel extends Model<ActiveEntryState> {
  update(changes: Partial<ActiveEntryState>) {
    this.produceState((draft) => Object.assign(draft, changes))
  }
  start() {
    this.produceState((draft) => {
      draft.start = DateTime.local()
    })
  }
  stop() {
    this.produceState((draft) => {
      draft.id = nanoid(8)
      draft.description = ''
      draft.start = null
    })
  }
}

export const initialState: ActiveEntryState = busyWork
// export const initialState: ActiveEntryState = { id: nanoid(8), sector: '', project: '', description: '', start: null }
export const [ ActiveEntryProvider, useActiveEntry ] = ActiveEntryModel.createContext(initialState)