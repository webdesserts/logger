import { Request, Response } from './router'
import { create } from './createable'
import { STATUS_CODES } from 'http'

export abstract class ServerError extends Error {
  static create = create

  public code: number;
  public message: string;
  public get status () { return STATUS_CODES[this.code] }

  constructor(protected req: Request, protected error?: Error) { super() }

  toJSON() {
    return ({
      error: {
        code: this.code,
        status: this.status,
        message: this.message
      }
    })
  }

  send(res: Response) : Response {
    if (this.error) console.error(this.error)
    return res.status(this.code).json(this)
  }
}

/*
 * 400 Errors
 */

export class BadRequestError extends ServerError {
  code = 400
  message = `The request was rejected due to either a malformed url or request body. See this error's context for more details`
  constructor(req: Request, public context: string[]) {
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

export class UnauthorizedError extends ServerError {
  code = 401
  message = `Authentication failed due to an invalid auth token`
}

export class AuthTokenExpired extends ServerError {
  code = 401
  message = `Authentication failed due to an expired auth token`
}

export class NotFoundError extends ServerError {
  code = 404
  message = `The requested resource cannot be found`
}

export class MethodNotAllowedError extends ServerError {
  code = 405
  message = `The HTTP method "${this.req.method}" is not an allowed for this resource`
}

/*
 * 500 Errors
 */

export class InternalServerError extends ServerError {
  code = 500
  message = `Something went wrong on our end, Sorry`
  constructor(req: Request, error: Error) { super(req, error) }
}

export class NotImplementedError extends ServerError {
  code = 501
  message = `The resource you requested is not yet implemented. Please don't take the existance of this error as a promise though.`
}
