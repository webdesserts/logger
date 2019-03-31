import { DateTime } from 'luxon'
import { Optional, Drop } from '../../utils/types'
import nanoid from 'nanoid'
import { Model } from '../../utils/model'
import { busyDay } from './fixtures';
import { findDOMNode } from 'react-dom';

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
*  Model  *
\*=======*/

export class EntriesModel extends Model<Entry[]> {
  static initialState: Entry[] = busyDay
  find(id: string) {
    return this.state.find((entry) => entry.id === id)
  }
  create(entry: Optional<'id', Entry>) {
    this.produceState((draft) => {
      let {
        id = nanoid(8),
        ...entryData
      } = entry

      draft.push({ id, ...entryData })
      return draft;
    })
  }
  update(id: string, changes: Partial<EntryData>) {
    this.produceState((draft) => {
      let i = draft.findIndex((entry) => entry.id === id)
      Object.assign(draft[i], changes)
      return draft;
    })
  }
  delete(id: string) {
    this.produceState((draft) => {
      let i = draft.findIndex((entry) => entry.id === id)
      draft.splice(i, 1)
      return draft;
    })
  }
}

export let [ EntriesProvider, useEntries ] = EntriesModel.createContext(EntriesModel.initialState)