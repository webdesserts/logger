import { Entry } from './entries'
import nanoid from 'nanoid'
import { Model } from '../../utils/model';
import { DateTime } from 'luxon';

/*=======*\
*  Types  *
\*=======*/

export interface ActiveEntryState {
  id: string,
  sector: string,
  project: string,
  description: string,
  start: DateTime | null
}

/*=======*\
*  Model  *
\*=======*/

export class ActiveEntryModel extends Model<ActiveEntryState> {
  static initialState: ActiveEntryState = { id: nanoid(8), sector: '', project: '', description: '', start: null }

  update(changes: Partial<ActiveEntryState>) {
    this.produceState((draft) => Object.assign(draft, changes))
  }
  start(data: { sector: string, description: string, project: string }) {
    this.produceState((draft) => {
      draft.sector = data.sector
      draft.project = data.project
      draft.description = data.description
      draft.start = DateTime.local()
    })
  }
  stop() {
    this.produceState((draft) => {
      draft.id = nanoid(8)
      draft.description = ''
      draft.start = null
    })
    return this.state.start ? { ...this.state, end: DateTime.local() } as Entry : null
  }
}

export const [ ActiveEntryProvider, useActiveEntry ] = ActiveEntryModel.createContext(ActiveEntryModel.initialState)