/**
 * Type abstraction.
 * 
 * @type {TypeAbstraction<TType>}
 */
export type TypeAbstraction<TType> = abstract new (...args: Array<any>) => TType;
