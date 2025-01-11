/**
 * Type constructor.
 * 
 * @type {TypeCtor<TObject>}
 */
export type TypeCtor<TObject> = new (...args: Array<any>) => TObject;
