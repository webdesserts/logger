import * as T from 'io-ts'
import { API } from './api'
import { DateTimeFromISOString } from './shared'
import { Entry } from './entries'

export namespace ActiveEntry {
  export const DataRequired = T.type({
    sector: T.string,
    project: T.string,
    description: T.string,
  })

  export const DataOptional = T.type({
    start: DateTimeFromISOString
  })

  export const Data = T.type({
    ...DataRequired.props,
    ...DataOptional.props
  })

  /*==========*\
  *  Requests  *
  \*==========*/

  export namespace RequestBody {
    export const Start = T.intersection([ DataRequired, T.partial(DataOptional.props) ])
    export const Stop = T.type({ end: DateTimeFromISOString })
    export const Update = T.partial(Data.props)

    export type Start = T.TypeOf<typeof Start>
    export type Stop = T.TypeOf<typeof Stop>
    export type Update = T.TypeOf<typeof Update>
  }

  export namespace Request {
    export const Start = API.RequestDetails(T.type({}), RequestBody.Start)
    export const Stop = API.RequestDetails(T.type({}), RequestBody.Stop)
    export const Find = API.RequestDetails(T.type({}), T.type({}))
    export const Update = API.RequestDetails(T.type({}), RequestBody.Update)

    export type Start = T.TypeOf<typeof Start>
    export type Stop = T.TypeOf<typeof Stop>
    export type Find = T.TypeOf<typeof Find>
    export type Update = T.TypeOf<typeof Update>
  }

  /*==========*\
  *  Response  *
  \*==========*/

  export namespace Response {
    export const Start = API.ResponseBody(T.type({ activeEntry: Data }))
    export const Stop = API.ResponseBody(T.type({
      activeEntry: T.null,
      entry: Entry.Data
    }))
    export const Find = API.ResponseBody(T.type({ activeEntry: T.union([Data, T.null]) }))
    export const Update = API.ResponseBody(T.type({ activeEntry: Data }))
    export const Delete = API.ResponseBody(T.type({}))

    export type Start = T.TypeOf<typeof Start>
    export type Stop = T.TypeOf<typeof Stop>
    export type Find = T.TypeOf<typeof Find>
    export type Update = T.TypeOf<typeof Update>
    export type Delete = T.TypeOf<typeof Delete>

    export type StartJSON = T.OutputOf<typeof Start>
    export type StopJSON = T.OutputOf<typeof Stop>
    export type FindJSON = T.OutputOf<typeof Find>
    export type UpdateJSON = T.OutputOf<typeof Update>
    export type DeleteJSON = T.OutputOf<typeof Delete>
  }
}
