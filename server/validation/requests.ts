import * as T from 'io-ts'

export const Request = <Q extends T.Mixed, B extends T.Mixed>(query: Q, body: B) => (
  T.type({
    query: query,
    body: body
  }, 'Request')
)
export type Request = T.TypeOf<ReturnType<typeof Request>>

export const UserData = T.type({
  id: T.string
})
export type UserData = T.TypeOf<typeof UserData>