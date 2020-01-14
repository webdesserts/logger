declare type Unwrap<P> = P extends Promise<infer T> ? T : P
declare type AsyncReturnType<T extends (...args: any) => any> = Unwrap<ReturnType<T>>