// drops properties from the definition
export type Drop<P extends keyof T, T> = {
  [K in Exclude<keyof T, P>]: T[K]
}

// these properties should not be defined
export type Empty<P extends keyof T, T> =
  { [K in P]?: undefined } &
  { [K in keyof Drop<P, T>]: T[K] }

// allows certain properties to be null
export type Nullable<P extends keyof T, T> = {
  [K in keyof T]: K extends P ? T[K] | null : T[K]
}

// allows certain properties to be optional
export type Optional<P extends keyof T, T> =
  { [K in P]?: T[K] } &
  { [K in keyof Drop<P, T>]: T[K] }