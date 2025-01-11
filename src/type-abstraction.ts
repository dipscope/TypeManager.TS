/**
 * Type abstraction.
 * 
 * @type {TypeAbstraction<TObject>}
 */
export type TypeAbstraction<TObject> = abstract new (...args: Array<any>) => TObject;
