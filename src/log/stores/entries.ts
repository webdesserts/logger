import { DateTime } from 'luxon'
import { Drop } from '../../utils/types'
import { Store } from '../../utils/store'
import { busyDay } from './fixtures';
import { Types, API } from '../../../server/runtypes';
import { UserStore } from './user';

/*=======*\
*  Types  *
\*=======*/

export interface EntriesState extends Array<Entry> {}

export interface Entry {
  id: string,
  project: string,
  sector: string,
  description: string,
  start: DateTime,
  end: DateTime,
}
export type EntryData = Drop<'id', Entry>

/*==========*\
*  Fetchers  *
\*==========*/

const fetchOne = API.createFetcher(
  Types.Entry.Request.Find,
  Types.Entry.Response.Find
);

const fetchAll = API.createFetcher(
  Types.Entry.Request.FindAll,
  Types.Entry.Response.FindAll
);

const fetchCreate = API.createFetcher(
  Types.Entry.Request.Create,
  Types.Entry.Response.Create
);

const fetchUpdate = API.createFetcher(
  Types.Entry.Request.Update,
  Types.Entry.Response.Update
);

const fetchDelete = API.createFetcher(
  Types.Entry.Request.Delete,
  Types.Entry.Response.Delete
);

/*=======*\
*  Store  *
\*=======*/

export class EntriesStore extends Store<Entry[]> {
  static initialState: Entry[] = []

  // init() {
  //   console.log('entries:', this.state.map(({id, description}) => ({ id, description })))
  // }

  async create(data: EntryData, user: UserStore) : Promise<Entry | null> {
    const response = await fetchCreate(data, user.state.token)
    if ("error" in response) return null
    this.setState((entries) => [
      response.entry,
      ...entries
    ])
    return response.entry
  }

  async update(id: string, data: Partial<EntryData | null>, user: UserStore) : Promise<Entry | null> {
    const response = await fetchUpdate({ id, ...data }, user.state.token)
    if ("error" in response) return null
    this.produceState((draft) => {
      let i = draft.findIndex((entry) => entry.id === id)
      draft[i] = response.entry
    })
    return response.entry
  }

  async delete(id: string, user: UserStore) : Promise<void> {
    const response = await fetchDelete({ id }, user.state.token)
    if ("error" in response) return;
    this.produceState((draft) => {
      let i = draft.findIndex((entry) => entry.id === id)
      draft.splice(i, 1)
    })
  }

  async fetchOne(id: string, user: UserStore) : Promise<Entry | null>{
    const response = await fetchOne({ id }, user.state.token)
    if ("error" in response) return null;
    const { entry } = response
    if (!entry) return null
    this.produceState((draft) => {
      const i = draft.findIndex((entry) => entry.id === id)
      draft[i] = entry
    })
    return entry
  }

  async fetchAll(user: UserStore) {
    const response = await fetchAll({}, user.state.token)
    if ("error" in response) return null;
    this.setState((state) => response.entries)
    return response.entries
  }
}

export let [ EntriesProvider, useEntries ] = EntriesStore.createContext(EntriesStore.initialState)