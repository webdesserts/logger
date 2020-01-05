import * as T from 'io-ts'
import { Request } from './requests'

export const SectorData = T.type({
  name: T.string
})

export const FindSectorData = SectorData
export type FindSectorData = T.TypeOf<typeof FindSectorData>

export const FindAllSectorsData = T.partial({})
export type FindAllSectorsData = T.TypeOf<typeof FindAllSectorsData>

export const CreateSectorData = SectorData
export type CreateSectorData = T.TypeOf<typeof CreateSectorData>

export const CreateSectorRequest = Request(T.type({}), CreateSectorData)
export type CreateSectorRequest = T.TypeOf<typeof CreateSectorRequest>

export const FindSectorRequest = Request(FindSectorData, T.type({}))
export type FindSectorRequest = T.TypeOf<typeof FindSectorRequest>

export const FindAllSectorsRequest = Request(FindAllSectorsData, T.type({}))
export type FindAllSectorsRequest = T.TypeOf<typeof FindAllSectorsRequest>