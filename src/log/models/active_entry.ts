import { Entry } from './entries'
import nanoid from 'nanoid'
import { Model } from '../../utils/model';
import { DateTime } from 'luxon';
import { sleep } from '../../utils/sleep'

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
  static initialState: ActiveEntryState = {
    id: nanoid(8),
    sector: "",
    project: "",
    description: "",
    start: null
  };

  async start(data: { sector: string; description: string; project: string }) {
    await sleep(1000)
    this.produceState(draft => {
      draft.sector = data.sector;
      draft.project = data.project;
      draft.description = data.description;
      draft.start = DateTime.local();
    });
  }

  async update(changes: Partial<ActiveEntryState>) {
    await sleep(1000)
    this.produceState(draft => Object.assign(draft, changes));
  }

  async stop() {
    await sleep(1000)
    this.produceState(draft => {
      draft.id = nanoid(8);
      draft.description = "";
      draft.start = null;
    });
    return this.state.start
      ? ({ ...this.state, end: DateTime.local() } as Entry)
      : null;
  }
}

export const [ ActiveEntryProvider, useActiveEntry ] = ActiveEntryModel.createContext(ActiveEntryModel.initialState)