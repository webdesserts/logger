import { create } from './createable'
import { STATUS_CODES } from 'http'
import { API } from './validation';

export abstract class ServerError<C extends number = number> extends Error {
  static create = create

  public readonly code: C;
  public readonly message: string;
  public get status () { return STATUS_CODES[this.code] }

  constructor(protected req: API.Request, protected error?: Error) { super() }

  toJSON() {
    return {
      error: {
        code: this.code,
        status: this.status,
        message: this.message
      }
    }
  }

  send<T extends API.ResponseBody>(res: API.Response<T>) : API.Response<T> {
    if (this.error) console.error(this.error)
    return res.status(this.code).json(this.toJSON())
  }
}

export namespace ServerError {
  export type JSON<E extends ServerError = ServerError> = ReturnType<E['toJSON']>

  /*
  * 400 Errors
  */

  export class BadRequest extends ServerError<400> {
    readonly code = 400
    message = `The request was rejected due to either a malformed url or request body. See this error's context for more details`
    constructor(req: API.Request, public context: string[]) {
      super(req)
    }
    toJSON() {
      const { error } = super.toJSON()
      return {
        error: {
          ...error,
          context: this.context
        }
      }
    }
  }

  export class Unauthorized extends ServerError<401> {
    readonly code = 401
    message = `Authentication failed due to an invalid or missing auth token`
  }

  export class AuthTokenExpired extends ServerError<401> {
    readonly code = 401
    message = `Authentication failed due to an expired auth token`
  }

  export class NotFound extends ServerError<404> {
    readonly code = 404
    message = `The requested resource cannot be found`
  }

  export class MethodNotAllowed extends ServerError<405> {
    readonly code = 405
    message = `The HTTP method "${this.req.method}" is not an allowed for this resource`
  }

  /*
  * 500 Errors
  */

  export class Internal extends ServerError<500> {
    readonly code = 500
    message = `Something went wrong on our end, Sorry`
    constructor(req: API.Request, error: Error) { super(req, error) }
  }

  export class NotImplemented extends ServerError<501> {
    readonly code = 501
    message = `The resource you requested is not yet implemented. Please don't take the existance of this error as a promise though.`
  }
}