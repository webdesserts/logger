import * as T from 'io-ts'
import { DateTime } from 'luxon'
import { either } from 'fp-ts/lib/Either'

export const DateTimeFromISOString = new T.Type<DateTime, string, unknown>(
  "DateTimeFromISOString",
  (value) : value is DateTime => DateTime.isDateTime(value),
  (value, context) => {
    return either.chain(T.string.validate(value, context), string => {
      const date = DateTime.fromISO(string)
      return date.isValid ? T.success(date) : T.failure(value, context, date.invalidReason || 'Invalid ISO Date')
    })
  },
  (date) : string => date.toISO()
)