import * as T from 'io-ts'
import { ServerError } from '../errors'
import { NowResponse, NowRequest } from '@now/node'

type LibResponse = Response
type LibRequest = Request

export namespace API {
  export type ResponseBody<T extends {} = {}> = T | ServerError.JSON<ServerError.BadRequest> | ServerError.JSON
  export type Request = NowRequest
  export type Response<T extends ResponseBody = any> = TypedNowResponse<T>
  export interface FetchResponse<T extends ResponseBody> extends LibResponse {
    json(): Promise<T>
  }
  export type FetchRequest = LibRequest

  interface TypedNowResponse<T extends {}> extends NowResponse {
    status: (status: number) => TypedNowResponse<T>
    json: (body: ResponseBody<T>) => TypedNowResponse<T>
    send: never
  }

  export const RequestData = <Q extends T.Mixed, B extends T.Mixed>(query: Q, body: B) => (
    T.type({
      query: query,
      body: body
    }, 'Request')
  )
  export type RequestDetails = T.TypeOf<ReturnType<typeof RequestData>>

  export const UserData = T.type({
    id: T.string
  })
  export type UserData = T.TypeOf<typeof UserData>
}
