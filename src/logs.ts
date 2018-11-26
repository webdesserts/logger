import { DateTime, Interval } from 'luxon'

export interface Entry {
  id: string,
  project: string,
  sector: string,
  description: string,
  start: DateTime,
  end: DateTime | null,
}

export interface CompleteEntry extends Entry { end: DateTime, }
export interface IncompleteEntry extends Entry { end: null, }

export function getLog () : Promise<Entry[]> {
  return import('./logs.json').then(({ default: log }) => {
    return log.map(({ start, end, ...props}) => ({
      start: DateTime.fromISO(start),
      end: end ? DateTime.fromISO(end) : null,
      ...props
    }))
  })
}

export function getInterval(entry: Entry) : Interval {
  return Interval.fromDateTimes(entry.start, entry.end || DateTime.local())
}

export function isIncomplete(entry: Entry) : entry is IncompleteEntry {
  return entry.end === null
}

export function isComplete(entry: Entry) : entry is CompleteEntry {
  return entry.end instanceof DateTime
}