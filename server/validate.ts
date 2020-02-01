import { ServerError } from './errors'
import * as T from 'io-ts'
import * as array from 'fp-ts/lib/Array'
import * as option from 'fp-ts/lib/Option'
import { fold } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'
import { eqString } from 'fp-ts/lib/Eq'
import { API } from './runtypes'

export class ValidationError extends TypeError {
  constructor(public context: string[]) { super("Validation Failed") }
}

export function validate<A, O, I>(data: I, type: T.Decoder<I, A>) : A {
  const onSuccess = (result: A) => result
  const onError = (errors: T.Errors) => {
    const validations = array.uniq(eqString)(array.compact(errors.map(formatValidationError)))
    throw new ValidationError(validations)
  }

  return pipe(type.decode(data), fold(onError, onSuccess))
}

type ValidatedRequest<T extends API.RequestDetails> = {
  params: T.TypeOf<T['Params']>,
  body: T.TypeOf<T['Body']>,
  search: T.TypeOf<T['Search']>
}

export function validateRequest<R extends API.Request, T extends API.RequestDetails>(req: R, type: T) : ValidatedRequest<T> {
  try {
    return {
      params: validate(req.query, T.exact(type.Params)),
      body: validate(req.body, T.exact(type.Body)),
      search: validate(req.query, T.exact(type.Search)),
    }
  } catch (err) {
    if (err instanceof ValidationError) {
      throw ServerError.BadRequest.create(req, err.context)
    } else throw err
  }
}

const jsToString = (value: T.mixed) => value === undefined ? 'undefined' : JSON.stringify(value);

// Credit: https://github.com/OliverJAsh/io-ts-reporters
const filterInterfaceAndUnionTypes = (entry: T.ContextEntry, i: number, entries: T.Context) => {
  const previous = entries[i-1]
  const isInterfaceOrUnionEntry = previous && (
    previous.type instanceof T.UnionType ||
    previous.type instanceof T.IntersectionType
  )
  return !isInterfaceOrUnionEntry
}

export const formatValidationError = (error: T.ValidationError) => {
  const context = error.context
    .filter(filterInterfaceAndUnionTypes)

  const path = context
    .map(({ key }) => key)
    .filter((key) => key.length > 0)
    .join('.');

  return pipe(array.last(context), option.map(contextEntry => {
      const expectedType = contextEntry.type.name;
      const atPath = path === '' ? '' : ` at ${path}`
      const value = jsToString(error.value)
      return (
          `Expecting ${expectedType}${atPath} but instead got: ${value}.`
      );
  }))
};