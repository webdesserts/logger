import * as T from 'io-ts'
import { API } from './api'
import { DateTimeFromISOString } from './shared'
import { Entry } from './entries'

export namespace ActiveEntry {
  export const Data = T.type({
    id: T.string,
    sector: T.string,
    project: T.string,
    description: T.string,
    start: DateTimeFromISOString
  })

  /*==========*\
  *  Requests  *
  \*==========*/

  export namespace Request {
    const { id, ...data } = Data.props

    export const Find = API.RequestDetails({
      method: 'GET',
      path: "/log/active"
    });
    export const Start = API.RequestDetails({
      method: 'POST',
      path: "/log/active/start",
      body: T.type({ ...data })
    });
    export const Stop = API.RequestDetails({
      method: 'PATCH',
      path: "/log/active/stop",
      body: T.type({ end: DateTimeFromISOString })
    });
    export const Update = API.RequestDetails({
      method: 'PATCH',
      path: "/log/active",
      body: T.partial({ ...data })
    });
  }

  /*==========*\
  *  Response  *
  \*==========*/

  export namespace Response {
    export const Start = API.ResponseDetails({
      body: T.type({
        entry: T.union([ Entry.Data, T.null ]),
        activeEntry: Data
      })
    })
    export const Stop = API.ResponseDetails({
      body: T.type({
        activeEntry: T.null,
        entry: Entry.Data
      })
    })
    export const Find = API.ResponseDetails({
      body: T.type({ activeEntry: T.union([Data, T.null]) })
    })
    export const Update = API.ResponseDetails({
      body: T.type({ activeEntry: Data })
    });
    export const Delete = API.ResponseDetails({
      body: T.type({})
    });
  }
}

