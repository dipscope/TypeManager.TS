/**
 * Type abstraction.
 * 
 * @type {TypeAbstraction<TType>}
 */
export type TypeAbstraction<TType> = Function & { prototype: TType };
