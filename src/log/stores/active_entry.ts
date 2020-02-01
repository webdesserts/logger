import { Store } from '../../utils/store';
import { DateTime } from 'luxon';
import { API, Types } from '../../../server/runtypes';
import { UserStore } from './user';

/*=======*\
*  Types  *
\*=======*/

export interface ActiveEntryState {
  id: string,
  sector: string,
  project: string,
  description: string,
  start: DateTime
}

type StartData = { sector: string, project: string, description: string }
type UpdateData = { sector: string, project: string, description: string, start: DateTime }

/*==========*\
*  Fetchers  *
\*==========*/

const fetchStop = API.createFetcher(
  Types.ActiveEntry.Request.Stop,
  Types.ActiveEntry.Response.Stop
)

const fetchStart = API.createFetcher(
  Types.ActiveEntry.Request.Start,
  Types.ActiveEntry.Response.Start
);

const fetchFind = API.createFetcher(
  Types.ActiveEntry.Request.Find,
  Types.ActiveEntry.Response.Find
);

const fetchUpdate = API.createFetcher(
  Types.ActiveEntry.Request.Update,
  Types.ActiveEntry.Response.Update
);

/*=======*\
*  Store  *
\*=======*/

export class ActiveEntryStore extends Store<ActiveEntryState | null> {
  static initialState: ActiveEntryState | null = null

  init() {
    console.log(this.state)
  }

  async fetch(user: UserStore) {
    const res = await fetchFind({}, user.state.token)
    if ("error" in res) return null
    this.setState(() => res.activeEntry)
    return res.activeEntry
  }

  async start(data: StartData, user: UserStore) {
    const res = await fetchStart({ ...data, start: DateTime.local() }, user.state.token)
    if ("error" in res) return null
    this.setState(() => res.activeEntry)
    return res.activeEntry
  }

  async stop(user: UserStore) {
    const res = await fetchStop({ end: DateTime.local() }, user.state.token)
    if ("error" in res) return null
    this.setState(() => res.activeEntry)
    return res.entry
  }

  async update(changes: UpdateData, user: UserStore) {
    const res = await fetchUpdate(changes, user.state.token)
    if ("error" in res) return null
    this.setState(() => res.activeEntry)
    return res.activeEntry
  }
}

export const [ ActiveEntryProvider, useActiveEntry ] = ActiveEntryStore.createContext(ActiveEntryStore.initialState)