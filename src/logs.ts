import { DateTime } from 'luxon'


export function getLog () : Promise<Entry[]> {
  return import('./logs.json').then(({ default: log }) => {
    return log.map(({ start, end, ...props}) => ({
      start: DateTime.fromISO(start),
      end: end ? DateTime.fromISO(end) : null,
      ...props
    }))
  })
}

export type Entry = {
  project: string,
  sector: string,
  description: string,
  start: DateTime,
  end: DateTime | null,
}

export type IncompleteEntry = {
  project: string,
  sector: string,
  description: string,
  start: DateTime,
  end: null,
}
