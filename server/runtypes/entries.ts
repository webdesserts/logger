import * as T from 'io-ts'
import { API } from './api'
import { EntryModel } from '../models/EntryModel'
import { DateTimeFromISOString } from './shared'

export const FindEntryData = T.type({
  id: T.string,
})
export type FindEntryData = T.TypeOf<typeof FindEntryData>

export const UpdateEntryData = T.partial({
  sector: T.string,
  project: T.string,
  description: T.string,
  start: DateTimeFromISOString,
  end: DateTimeFromISOString,
})
export type UpdateEntryData = T.TypeOf<typeof UpdateEntryData>

export const FindAllEntriesData = T.partial({
  description: T.string,
})
export type FindAllEntriesData = T.TypeOf<typeof FindAllEntriesData>

export const CreateEntryData = T.type({
    sector: T.string,
    project: T.string,
    description: T.string,
    start: DateTimeFromISOString,
    end: DateTimeFromISOString
})

export type CreateEntryData = T.TypeOf<typeof CreateEntryData>

export const CreateEntryRequest = API.RequestData(T.type({}), CreateEntryData)
export type CreateEntryRequest = T.TypeOf<typeof CreateEntryRequest>
export type CreateEntryResponse = API.ResponseBody<{
  entry: AsyncReturnType<EntryModel['create']>
}>

export const UpdateEntryRequest = API.RequestData(FindEntryData, UpdateEntryData)
export type UpdateEntryRequest = T.TypeOf<typeof UpdateEntryRequest>
export type UpdateEntryResponse = API.ResponseBody<{
  entry: AsyncReturnType<EntryModel['update']>
}>

export type DeleteEntryResponse = API.ResponseBody<{}>

export const FindEntryRequest = API.RequestData(FindEntryData, T.type({}))
export type FindEntryRequest = T.TypeOf<typeof FindEntryRequest>
export type FindEntryResponse = API.ResponseBody<{
  entry: AsyncReturnType<EntryModel['findById']>
}>

export const FindAllEntriesRequest = API.RequestData(T.type({}), FindAllEntriesData)
export type FindAllEntriesRequest = T.TypeOf<typeof FindAllEntriesRequest>
export type FindAllEntriesResponse = API.ResponseBody<{
  entries: AsyncReturnType<EntryModel['findAll']>
}>