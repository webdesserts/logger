// A Redux Action with Flux-style payloads
export type Action<T = string, P = {}> = { type: T, payload: P }

// Extracts all Action Creators listed in a given object
export type ActionCreators<A extends Action = Action> = { [key: string] : (...args: any[]) => A }

// Extracts the return type of all Action Creators listed a given object
export type ExtractActions<C extends ActionCreators<Action>> = C extends ActionCreators<infer A> ? A : never;

// Extracts the Action Type from an Action Creator
export type ExtractType<A> = A extends Action<infer T> ? T : never;

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