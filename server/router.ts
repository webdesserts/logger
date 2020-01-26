import { ServerError } from './errors'
import { create } from './createable';
import { API } from './runtypes';
import { METHODS } from './http';
import * as T from 'io-ts'

type LifecycleHandler = (request: API.Request) => void | Promise<void>
type RequestHandler<T extends API.ResponseDetails = any> = (
  request: API.Request,
  response: API.Response<T.OutputOf<T['Body']>>
) => API.Response<T.OutputOf<T['Body']>> | Promise<API.Response<T.OutputOf<T['Body']>>>

const enum LIFECYCLES {
  BEFORE,
  AFTER,
}

export class Router {
  static create = create

  private methodHandlers = new Map<METHODS, RequestHandler>()
  private lifecycleHandlers = new Map<LIFECYCLES, LifecycleHandler>()

  constructor(private options: RouterOptions = {}) {}

  // lifecyle handlers
  before(handler: LifecycleHandler) {
    this.lifecycleHandlers.set(LIFECYCLES.BEFORE, handler)
  }
  after(handler: LifecycleHandler) {
    this.lifecycleHandlers.set(LIFECYCLES.AFTER, handler)
  }

  // method handlers
  get<R extends API.ResponseDetails>(responseDetails: R, handler: RequestHandler<R>) {
    this.methodHandlers.set(METHODS.GET, handler)
  }
  post<R extends API.ResponseDetails>(responseDetails: R, handler: RequestHandler<R>) {
    this.methodHandlers.set(METHODS.POST, handler)
  }
  put<R extends API.ResponseDetails>(responseDetails: R, handler: RequestHandler<R>) {
    this.methodHandlers.set(METHODS.PUT, handler)
  }
  patch<R extends API.ResponseDetails>(responseDetails: R, handler: RequestHandler<R>) {
    this.methodHandlers.set(METHODS.PATCH, handler)
  }
  delete<R extends API.ResponseDetails>(responseDetails: R, handler: RequestHandler<R>) {
    this.methodHandlers.set(METHODS.DELETE, handler)
  }

  // routing
  handler = async (req: API.Request, res: API.Response) : Promise<API.Response>  => {
    const { method } = req
    if (isValidMethod(method)) {
      const beforeHandler = this.lifecycleHandlers.get(LIFECYCLES.BEFORE) || (() => {})
      const afterHandler = this.lifecycleHandlers.get(LIFECYCLES.AFTER) || (() => {})
      const handler = this.methodHandlers.get(method)
      if (handler) {
        try {
          await beforeHandler(req)
          const response = await handler(req, res)
          await afterHandler(req)
          return response
        } catch(error) {
          if (error instanceof ServerError) {
            return error.send(res)
          } else {
            return ServerError.Internal.create(req, error).send(res)
          }
        }
      }
    }
    return ServerError.MethodNotAllowed.create(req).send(res)
  }
}

export interface RouterOptions {
}

function isValidMethod(method?: string): method is METHODS {
  return (
    Boolean(method) && (
      method === METHODS.GET ||
      method === METHODS.POST ||
      method === METHODS.PUT ||
      method === METHODS.PATCH ||
      method === METHODS.DELETE
    )
  );
}
