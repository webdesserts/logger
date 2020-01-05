export function create<T extends new (...args: any) => any>(
  this: T,
  ...args: ConstructorParameters<T>
): InstanceType<T> {
  // types currently don't think construct() can construct classes...
  const { construct } = Reflect as any
  return construct(this, args);
}