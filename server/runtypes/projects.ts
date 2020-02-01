import * as T from 'io-ts'
import { API } from './api'

export namespace Project {
  const Data = T.type({
    name: T.string
  })

  export namespace Request {
    export const Create = API.RequestDetails({
      method: 'POST',
      path: "/projects",
      body: Data
    });
    export const FindAll = API.RequestDetails({
      method: 'GET',
      path: "/projects"
    });
    export const Find = API.RequestDetails({
      method: 'GET',
      path: "/projects/:name",
      params: Data
    });
    export const Delete = API.RequestDetails({
      method: 'DELETE',
      path: "/projects/:name",
      params: Data
    });
  }

  export namespace Response {
    export const Create = API.ResponseDetails({
      body: T.type({ project: Data })
    })
    export const Find = API.ResponseDetails({
      body: T.type({ project: T.union([Data, T.null]) })
    })
    export const FindAll = API.ResponseDetails({
      body: T.type({ projects: T.array(Data.props.name) })
    })
    export const Delete = API.ResponseDetails({
      body: T.type({})
    })
  }
}