import { DateTime } from 'luxon'
import { Optional, Drop } from '../../utils/types'
import nanoid from 'nanoid'
import { Store } from '../../utils/store'
import { busyDay } from './fixtures';

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

/*=======*\
*  Store  *
\*=======*/

export class EntriesStore extends Store<Entry[]> {
  static initialState: Entry[] = busyDay

  // init() {
  //   console.log('entries:', this.state.map(({id, description}) => ({ id, description })))
  // }

  create(entry: Optional<'id', Entry>) {
    this.produceState((draft) => {
      let { id = nanoid(8), ...entryData } = entry;
      draft.push({ id, ...entryData })
    })
  }

  update(id: string, changes: Partial<EntryData>) {
    this.produceState((draft) => {
      let i = draft.findIndex((entry) => entry.id === id)
      Object.assign(draft[i], changes)
    })
  }

  delete(id: string) {
    this.produceState((draft) => {
      let i = draft.findIndex((entry) => entry.id === id)
      draft.splice(i, 1)
    })
  }

  find(id: string) {
    return this.state.find((entry) => entry.id === id)
  }
}

export let [ EntriesProvider, useEntries ] = EntriesStore.createContext(EntriesStore.initialState)