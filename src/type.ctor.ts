/**
 * Type constructor.
 * 
 * @type {TypeCtor}
 */
export type TypeCtor<TType> = new (...args: any[]) => TType;
