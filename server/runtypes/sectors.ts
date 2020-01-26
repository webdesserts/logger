import * as T from 'io-ts'
import { API } from './api'
import { METHODS } from '../http'

export namespace Sector {
  const Data = T.type({
    name: T.string
  })

  export namespace Request {
    export const Create = API.RequestDetails({
      method: METHODS.POST,
      path: "/sectors",
      body: Data
    });
    export const FindAll = API.RequestDetails({
      method: METHODS.GET,
      path: "/sectors"
    });
    export const Find = API.RequestDetails({
      method: METHODS.GET,
      path: "/sectors/:name",
      params: Data
    });
    export const Delete = API.RequestDetails({
      method: METHODS.DELETE,
      path: "/sectors/:name",
      params: Data
    });
  }

  export namespace Response {
    export const Create = API.ResponseDetails({
      body: T.type({ sector: Data })
    })
    export const Find = API.ResponseDetails({
      body: T.type({ sector: T.union([Data, T.null]) })
    })
    export const FindAll = API.ResponseDetails({
      body: T.type({ sectors: T.array(Data.props.name) })
    })
    export const Delete = API.ResponseDetails({
      body: T.type({})
    })
  }
}