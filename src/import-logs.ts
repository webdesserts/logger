import { DateTime, Interval } from 'luxon'
// import { Entry } from './store/log/entries'

// export function getLog () : Promise<Entry[]> {
//   return import('./logs.json').then(({ default: log }) => {
//     return log.map(({ start, end, ...props}) => ({
//       start: DateTime.fromISO(start),
//       end: end ? DateTime.fromISO(end) : null,
//       ...props
//     }))
//   })
// }