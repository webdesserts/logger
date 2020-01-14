import * as T from 'io-ts'
import { API } from './api'
import { ActiveEntryModel } from '../models/ActiveEntryModel'
import { DateTimeFromISOString } from './shared'

export const FindActiveEntryData = T.type({ })
export type FindActiveEntryData = T.TypeOf<typeof FindActiveEntryData>

export const UpdateActiveEntryData = T.partial({
  sector: T.string,
  project: T.string,
  description: T.string,
  start: DateTimeFromISOString,
})
export type UpdateActiveEntryData = T.TypeOf<typeof UpdateActiveEntryData>

export const StartActiveEntryData = T.intersection([
  T.type({
    sector: T.string,
    project: T.string,
    description: T.string,
  }), T.partial({
    start: DateTimeFromISOString
  })
])
export type StartActiveEntryData = T.TypeOf<typeof StartActiveEntryData>

export const StopActiveEntryData = T.type({
  end: DateTimeFromISOString
})
export type StopActiveEntryData = T.TypeOf<typeof StopActiveEntryData>

export const FindActiveEntryRequest = API.RequestData(FindActiveEntryData, T.type({}))
export type FindActiveEntryRequest = T.TypeOf<typeof FindActiveEntryRequest>
export type FindActiveEntryResponse = API.ResponseBody<{
  activeEntry: AsyncReturnType<ActiveEntryModel['find']>
}>

export const StartActiveEntryRequest = API.RequestData(T.type({}), StartActiveEntryData)
export type StartActiveEntryRequest = T.TypeOf<typeof StartActiveEntryRequest>
export type StartActiveEntryResponse = API.ResponseBody<{
  activeEntry: AsyncReturnType<ActiveEntryModel['start']>
}>

export const StopActiveEntryRequest = API.RequestData(T.type({}), StopActiveEntryData)
export type StopActiveEntryRequest = T.TypeOf<typeof StopActiveEntryRequest>
export type StopActiveEntryResponse = API.ResponseBody<{
  activeEntry: null,
  entry: AsyncReturnType<ActiveEntryModel['stop']>
}>

export const UpdateActiveEntryRequest = API.RequestData(FindActiveEntryData, UpdateActiveEntryData)
export type UpdateActiveEntryRequest = T.TypeOf<typeof UpdateActiveEntryRequest>
export type UpdateActiveEntryResponse = API.ResponseBody<{
  activeEntry: AsyncReturnType<ActiveEntryModel['update']>
}>

export type DeleteActiveEntryResponse = API.ResponseBody<{}>