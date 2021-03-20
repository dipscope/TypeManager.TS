import { TypeAbstraction } from './type-abstraction';
import { TypeCtor } from './type-ctor';

/**
 * Type function.
 * 
 * @type {TypeFn<TType>}
 */
export type TypeFn<TType> = TypeCtor<TType> | TypeAbstraction<TType>;
