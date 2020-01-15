import * as T from 'io-ts'
import { API } from './api'
import { DateTimeFromISOString } from './shared'

export namespace Entry {
  export const Data = T.type({
    id: T.string,
    sector: T.string,
    project: T.string,
    description: T.string,
    start: DateTimeFromISOString,
    end: DateTimeFromISOString,
  })

  export namespace RequestParams {
    const { id } = Data.props

    export const Find = T.type({ id })
    export type Find = T.TypeOf<typeof Find>
  }

  export namespace RequestBody {
    const { id, ...bodyProps } = Data.props

    export const Create = T.type({ ...bodyProps })
    export const Update = T.partial({ ...bodyProps })

    export type Create = T.TypeOf<typeof Create>
    export type Update = T.TypeOf<typeof Update>
  }

  export namespace Request {
    export const Create = API.RequestDetails(T.type({}), RequestBody.Create)
    export const Find = API.RequestDetails(RequestParams.Find, T.type({}))
    export const FindAll = API.RequestDetails(T.type({}), T.type({}))
    export const Update = API.RequestDetails(RequestParams.Find, RequestBody.Update)
    export const Delete = API.RequestDetails(RequestParams.Find, T.type({}))

    export type Create = T.TypeOf<typeof Create>
    export type Find = T.TypeOf<typeof Find>
    export type FindAll = T.TypeOf<typeof FindAll>
    export type Update = T.TypeOf<typeof Update>
    export type Delete = T.TypeOf<typeof Delete>
  }

  export namespace Response {
    export const Create = API.ResponseBody(T.type({ entry: Data }))
    export const Find = API.ResponseBody(T.type({ entry: T.union([Data, T.null]) }))
    export const FindAll = API.ResponseBody(T.type({ entries: T.array(Data) }))
    export const Update = API.ResponseBody(T.type({ entry: Data }))
    export const Delete = API.ResponseBody(T.type({}))

    export type Create = T.TypeOf<typeof Create>
    export type CreateJSON = T.OutputOf<typeof Create>
    export type Find = T.TypeOf<typeof Find>
    export type FindJSON = T.OutputOf<typeof Find>
    export type FindAll = T.TypeOf<typeof FindAll>
    export type FindAllJSON = T.OutputOf<typeof FindAll>
    export type Update = T.TypeOf<typeof Update>
    export type UpdateJSON = T.OutputOf<typeof Update>
    export type Delete = T.TypeOf<typeof Delete>
    export type DeleteJSON = T.OutputOf<typeof Delete>
  }
}