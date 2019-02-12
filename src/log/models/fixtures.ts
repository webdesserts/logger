import { EntriesState } from './entries'
import nanoid from 'nanoid'
import { DateTime } from 'luxon';
import { ActiveEntryState } from './active_entry';

let today = DateTime.local().startOf('day')
today.set({ hour: 8 })

export const busyWork: ActiveEntryState = {
  id: nanoid(8),
  sector: "Code",
  project: "Dashboard",
  description: "busy work",
  start: DateTime.local(),
}

export const busyDay: EntriesState = [
  {
    id: nanoid(8),
    sector: "Manage",
    project: "Dashboard",
    description: "Review stuff",
    start: today.set({ hour: 8 }),
    end: today.set({ hour: 8, minute: 30 })
  }, {
    id: nanoid(8),
    sector: "Code",
    project: "Dashboard",
    description: "Build stuff",
    start: today.set({ hour: 9 }),
    end: today.set({ hour: 10, minute: 0 })
  }, {
    id: nanoid(8),
    sector: "Design",
    project: "Dashboard",
    description: "Regret stuff",
    start: today.set({ hour: 11 }),
    end: today.set({ hour: 11, minute: 45 })
  }, {
    id: nanoid(8),
    sector: "Code",
    project: "Dashboard",
    description: "Destroy stuff",
    start: today.set({ hour: 1, minute: 15 }),
    end: today.set({ hour: 2, minute: 0 })
  }
];