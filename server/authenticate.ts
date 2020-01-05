import { Request } from './router'
import { UnauthorizedError, AuthTokenExpired } from './errors'
import Jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import { Types } from '.'

type Payload = {
  iss: string
  sub: string
  iat: number
  exp: number
  azp: string
  scope: string
}

type AuthenticationDetails = {
  user: {
    id: string
  }
}

export async function authenticate(req: Request) : Promise<AuthenticationDetails> {
  const bearerTag = 'Bearer '
  if (req.headers.authorization?.startsWith(bearerTag)) {
    const { authorization } = req.headers
    const token = authorization.slice(bearerTag.length)
    return new Promise((resolve, reject) => {
      Jwt.verify(token, getSecretOrPublicKey, {
        audience: 'logger-api',
        issuer: 'https://webdesserts.auth0.com/',
        algorithms: ['RS256']
      }, (error, payload) => {
        if (error && error.message === 'jwt expired') reject(AuthTokenExpired.create(req, error))
        else if (error) reject(UnauthorizedError.create(req, error))
        else resolve(translatePayload(payload))
      }) 
    })
  } else {
    throw UnauthorizedError.create(req)
  }
}

function getSecretOrPublicKey (header, callback) {
  const jwksUri = 'https://webdesserts.auth0.com/.well-known/jwks.json'

  jwksClient({ jwksUri }).getSigningKey(header.kid, (error, secret: any) => {
    if (error) callback(error)
    else callback(null, secret.publicKey || secret.rsaPublicKey)
  })
}

function translatePayload(payload: Payload) : AuthenticationDetails {
  const { sub } = payload
  return { user: { id: sub } }
}

type AuthoredData = { author: string }
export function isAuthor<M extends AuthoredData>(data: M, user: Types.UserData) : boolean {
  return Boolean(data && data.author === user.id)
}

export function filterUnauthored<M extends AuthoredData>(data: M | null, user: Types.UserData) : M | null {
  return (data && isAuthor(data, user)) ? data : null
}