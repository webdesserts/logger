import * as T from 'io-ts'
import { API } from './api'
import { DateTimeFromISOString } from './shared'
import { METHODS } from '../http'

export namespace Entry {
  export const Data = T.type({
    id: T.string,
    sector: T.string,
    project: T.string,
    description: T.string,
    start: DateTimeFromISOString,
    end: DateTimeFromISOString,
  })

  export namespace Request {
    const { id, ...bodyProps } = Data.props

    export const Create = API.RequestDetails({
      method: 'POST',
      path: "/log",
      body: T.type({ ...bodyProps })
    });

    export const FindAll = API.RequestDetails({
      method: 'GET',
      path: "/log"
    });

    export const Find = API.RequestDetails({
      method: 'GET',
      path: "/log:id",
      params: T.type({ id })
    });

    export const Update = API.RequestDetails({
      method: 'PATCH',
      path: "/log/:id",
      params: T.type({ id }),
      body: T.partial({ ...bodyProps })
    });

    export const Delete = API.RequestDetails({
      method: 'DELETE',
      path: "/log/:id",
      params: T.type({ id })
    });
  }

  export namespace Response {
    export const Create = API.ResponseDetails({
      body: T.type({ entry: Data })
    });
    export const Find = API.ResponseDetails({
      body: T.type({ entry: T.union([Data, T.null]) })
    });
    export const FindAll = API.ResponseDetails({
      body: T.type({ entries: T.array(Data) })
    });
    export const Update = API.ResponseDetails({
      body: T.type({ entry: Data })
    });
    export const Delete = API.ResponseDetails({
      body: T.type({})
    });
  }
}