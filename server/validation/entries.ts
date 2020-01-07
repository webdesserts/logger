import * as T from 'io-ts'
import { Request } from './requests'

export const FindEntryData = T.type({
  id: T.string,
})
export type FindEntryData = T.TypeOf<typeof FindEntryData>

export const UpdateEntryData = T.partial({
  sector: T.string,
  project: T.string,
  description: T.string,
  start: T.string,
  end: T.string,
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
    start: T.string,
    end: T.string
})

export type CreateEntryData = T.TypeOf<typeof CreateEntryData>

export const CreateEntryRequest = Request(T.type({}), CreateEntryData)
export type CreateEntryRequest = T.TypeOf<typeof CreateEntryRequest>

export const UpdateEntryRequest = Request(FindEntryData, UpdateEntryData)
export type UpdateEntryRequest = T.TypeOf<typeof UpdateEntryRequest>

export const FindEntryRequest = Request(FindEntryData, T.type({}))
export type FindEntryRequest = T.TypeOf<typeof FindEntryRequest>

export const FindAllEntriesRequest = Request(T.type({}), FindAllEntriesData)
export type FindAllEntriesRequest = T.TypeOf<typeof FindAllEntriesRequest>