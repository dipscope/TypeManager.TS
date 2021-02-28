import { Alias } from './alias';
import { TypeCtor } from './type-ctor';
import { TypeResolver } from './type-resolver';

/**
 * Type argument represents a data which can be passed to define a certain type.
 * 
 * @type {TypeArgument<TType>}
 */
export type TypeArgument<TType> = Alias | TypeCtor<TType> | TypeResolver<TType>;
