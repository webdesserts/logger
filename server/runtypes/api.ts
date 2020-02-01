import * as T from 'io-ts'
import { ServerError } from '../errors'
import { NowResponse, NowRequest } from '@now/node'
import { METHODS } from '../http'
import { validate } from '../validate'

type LibResponse = Response
type LibRequest = Request

export namespace API {
  export function createFetcher<I extends API.RequestDetails<any>, O extends API.ResponseDetails<any>>(
    Req: I,
    Res: O 
  ) : (data: RequestDetailsData<I>, bearer?: string | null) => Promise<ReturnType<ServerError['toJSON']> | T.TypeOf<O['Body']>> {
    return async (data, bearer) => {
      const { path, method } = Req
      const params = Req.Params.encode(data)
      console.log(path)
      const pathname = '/api' + replaceParams(path, params);
      console.log(method, pathname)
      const headers = new Headers()

      headers.set('Content-Type', 'application/json')
      if (bearer) headers.set('authorization', `Bearer ${bearer}`)
      const body = Req.Body.encode(data)
      const response = await fetch(pathname, {
        method,
        headers,
        body: body && Object.entries(body).length ? JSON.stringify(body) : null
      });

      const result = validate(await response.json(), Res.Body);
      if (API.ResponseError.is(result)) { console.error(result.error) }

      return result
    }
  }

  function replaceParams(path: string, params: { [key: string]: string }) : string  {
    return path.split('/').map((segment) => (
      segment.startsWith(':') ? params[segment.substr(1)] : segment
    )).join('/')
  }

  type RequestDetailsData<R extends API.RequestDetails> = T.TypeOf<R['Body']> & T.TypeOf<R['Params']> & T.TypeOf<R['Search']>

  type MixedOrEmptyObjectType<T extends T.HasProps | undefined> = T extends T.HasProps ? T : T.TypeC<{}>;

  export interface RequestDetails<C extends RequestProps & RequestTypes = any> {
    method: C['method'];
    readonly path: string;
    Params: MixedOrEmptyObjectType<C['params']>;
    Body: MixedOrEmptyObjectType<C['body']>;
    Search: MixedOrEmptyObjectType<C['search']>;
  }

  type RequestProps = { method: METHODS, path: string }
  type RequestTypes = { params?: T.HasProps, body?: T.HasProps, search?: T.HasProps }

  export function RequestDetails<C extends RequestProps & RequestTypes>(config: C): RequestDetails<C> {
    return {
      method: config.method,
      path: config.path,
      Params: config.params || T.type({}),
      Body: config.body || T.type({}),
      Search: config.search || T.type({})
    } as RequestDetails<C>;
  }

  export interface ResponseDetails<T extends ResponseTypes = any> { Body: MixedOrEmptyObjectType<T['body']>; }
  type ResponseTypes = { body?: T.HasProps }

  export function ResponseDetails<T extends ResponseTypes>(types: T) : ResponseDetails<T> {
    return {
      Body: types.body || T.type({})
    } as ResponseDetails<T>
  }

  export const ResponseError: T.Type<ServerError.JSON> = T.type({
    error: T.type({
      code: T.number,
      message: T.string,
      status: T.union([T.string, T.undefined])
    }),
  })
  export type ResponseError = T.TypeOf<typeof ResponseError>
  export const ResponseBody = <T extends T.Mixed> (type: T) => T.union([
    type, ResponseError
  ])
  export type ResponseBody<T extends {} = {}> = T | ResponseError
  export type Request = NowRequest
  export type Response<T extends ResponseBody = any> = TypedNowResponse<T>
  export interface FetchResponse<T extends ResponseBody> extends LibResponse {
    json(): Promise<T>
  }
  export type FetchRequest = LibRequest

  interface TypedNowResponse<T extends {}> extends NowResponse {
    status: (status: number) => TypedNowResponse<T>
    json: (body: T | ResponseBody<T>) => TypedNowResponse<T>
    send: never
  }

  export const UserData = T.type({
    id: T.string
  })
  export type UserData = T.TypeOf<typeof UserData>
}