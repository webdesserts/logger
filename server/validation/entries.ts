import * as T from 'io-ts'
import { Request } from './requests'

export const FindEntryData = T.type({
  id: T.string,
})
export type FindEntryData = T.TypeOf<typeof FindEntryData>

export const UpdateEntryData = T.partial({
  description: T.string,
  start: T.string,
  end: T.string,
  sector: T.string,
  project: T.string,
})
export type UpdateEntryData = T.TypeOf<typeof UpdateEntryData>

export const FindAllEntriesData = T.partial({
  description: T.string,
})
export type FindAllEntriesData = T.TypeOf<typeof FindAllEntriesData>

export const CreateEntryData = T.intersection([
  T.type({
    description: T.string,
    sector: T.string,
    project: T.string
  }),
  T.partial({
    start: T.string,
    end: T.string
  })
])
export type CreateEntryData = T.TypeOf<typeof CreateEntryData>

export const CreateEntryRequest = Request(T.type({}), CreateEntryData)
export type CreateEntryRequest = T.TypeOf<typeof CreateEntryRequest>

export const UpdateEntryRequest = Request(FindEntryData, UpdateEntryData)
export type UpdateEntryRequest = T.TypeOf<typeof UpdateEntryRequest>

export const FindEntryRequest = Request(FindEntryData, T.type({}))
export type FindEntryRequest = T.TypeOf<typeof FindEntryRequest>

export const FindAllEntriesRequest = Request(T.type({}), FindAllEntriesData)
export type FindAllEntriesRequest = T.TypeOf<typeof FindAllEntriesRequest>