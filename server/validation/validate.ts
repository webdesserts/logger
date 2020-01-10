import { ServerError } from '../errors'
import * as T from 'io-ts'
import * as array from 'fp-ts/lib/Array'
import * as option from 'fp-ts/lib/Option'
import { fold } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'
import { eqString } from 'fp-ts/lib/Eq'
import { API } from './api'

export function validate<R extends API.Request, A>(req: R, type: T.Type<A>) : A {
  const data = { query: req.query, body: req.body }

  const onSuccess = (result: A) => result
  const onError = (errors: T.Errors) => {
    const validations = array.uniq(eqString)(array.compact(errors.map(formatValidationError)))
    throw ServerError.BadRequest.create(req, validations)
  }

  return pipe(type.decode(data), fold(onError, onSuccess))
}

const jsToString = (value: T.mixed) => value === undefined ? 'undefined' : JSON.stringify(value);

// const arrayifyIntegers = (value: string) => {
//   let int = parseInt(value, 10)
//   return isNaN(int) ? value : `[${int}]`
// }

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