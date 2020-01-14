import * as T from 'io-ts'
import { API } from './api'
import { SectorModel } from '../models/SectorModel'

export const SectorData = T.type({
  name: T.string
})

export const FindSectorData = SectorData
export type FindSectorData = T.TypeOf<typeof FindSectorData>

export const FindAllSectorsData = T.partial({})
export type FindAllSectorsData = T.TypeOf<typeof FindAllSectorsData>

export const CreateSectorData = SectorData
export type CreateSectorData = T.TypeOf<typeof CreateSectorData>

export const CreateSectorRequest = API.RequestData(T.type({}), CreateSectorData)
export type CreateSectorRequest = T.TypeOf<typeof CreateSectorRequest>
export type CreateSectorResponse = API.ResponseBody<{
  sector: AsyncReturnType<SectorModel['create']>
}>

export const FindSectorRequest = API.RequestData(FindSectorData, T.type({}))
export type FindSectorRequest = T.TypeOf<typeof FindSectorRequest>
export type FindSectorResponse = API.ResponseBody<{
  sector: AsyncReturnType<SectorModel['find']>
}>

export const FindAllSectorsRequest = API.RequestData(FindAllSectorsData, T.type({}))
export type FindAllSectorsRequest = T.TypeOf<typeof FindAllSectorsRequest>
export type FindAllSectorsResponse = API.ResponseBody<{
  sectors: AsyncReturnType<SectorModel['findAll']>
}>

export type DeleteSectorResponse = API.ResponseBody<{}>