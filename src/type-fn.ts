import { TypeAbstraction } from './type-abstraction';
import { TypeCtor } from './type-ctor';

/**
 * Type function.
 * 
 * @type {TypeFn<TObject>}
 */
export type TypeFn<TObject> = TypeCtor<TObject> | TypeAbstraction<TObject>;
