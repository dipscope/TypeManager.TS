/**
 * Type constructor.
 * 
 * @type {TypeCtor<TType>}
 */
export type TypeCtor<TType> = new (...args: any[]) => TType;
