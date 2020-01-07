import * as T from 'io-ts'
import { Request } from './requests'

export const FindActiveEntryData = T.type({ })
export type FindActiveEntryData = T.TypeOf<typeof FindActiveEntryData>

export const UpdateActiveEntryData = T.partial({
  sector: T.string,
  project: T.string,
  description: T.string,
  start: T.string,
})
export type UpdateActiveEntryData = T.TypeOf<typeof UpdateActiveEntryData>

export const StartActiveEntryData = T.intersection([
  T.type({
    sector: T.string,
    project: T.string,
    description: T.string,
  }), T.partial({
    start: T.string
  })
])
export type StartActiveEntryData = T.TypeOf<typeof StartActiveEntryData>

export const StopActiveEntryData = T.type({
  end: T.string
})
export type StopActiveEntryData = T.TypeOf<typeof StopActiveEntryData>

export const StartActiveEntryRequest = Request(T.type({}), StartActiveEntryData)
export type StartActiveEntryRequest = T.TypeOf<typeof StartActiveEntryRequest>

export const StopActiveEntryRequest = Request(T.type({}), StopActiveEntryData)
export type StopActiveEntryRequest = T.TypeOf<typeof StopActiveEntryRequest>

export const UpdateActiveEntryRequest = Request(FindActiveEntryData, UpdateActiveEntryData)
export type UpdateActiveEntryRequest = T.TypeOf<typeof UpdateActiveEntryRequest>

export const FindActiveEntryRequest = Request(FindActiveEntryData, T.type({}))
export type FindActiveEntryRequest = T.TypeOf<typeof FindActiveEntryRequest>