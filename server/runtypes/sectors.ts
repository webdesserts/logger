import * as T from 'io-ts'
import { API } from './api'

export namespace Sector {
  const Data = T.type({
    name: T.string
  })

  export namespace RequestParams {
    export const Find = Data
    export type Find = T.TypeOf<typeof Find>

    export const Delete = Data
    export type Delete = T.TypeOf<typeof Delete>
  }

  export namespace RequestBody {
    export const Create = Data
    export type Create = T.TypeOf<typeof Create>
  }

  export namespace Request {
    export const Create = API.RequestDetails(T.type({}), RequestBody.Create)
    export const Find = API.RequestDetails(RequestParams.Find, T.type({}))
    export const FindAll = API.RequestDetails(T.type({}), T.type({}))
    export const Delete = API.RequestDetails(RequestParams.Find, T.type({}))

    export type Create = T.TypeOf<typeof Create>
    export type Find = T.TypeOf<typeof Find>
    export type FindAll = T.TypeOf<typeof FindAll>
    export type Delete = T.TypeOf<typeof Delete>
  }

  export namespace Response {
    export const Create = API.ResponseBody(T.strict({ sector: Data }))
    export const Find = API.ResponseBody(T.strict({ sector: T.union([Data, T.null]) }))
    export const FindAll = API.ResponseBody(T.strict({ sectors: T.array(Data.props.name) }))
    export const Delete = API.ResponseBody(T.strict({}))

    export type CreateJSON = T.OutputOf<typeof Create>
    export type FindJSON = T.OutputOf<typeof Find>
    export type FindAllJSON = T.OutputOf<typeof FindAll>
    export type DeleteJSON = T.OutputOf<typeof Delete>
  }
}