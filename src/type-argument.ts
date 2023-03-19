import { Alias } from './alias';
import { TypeFn } from './type-fn';
import { TypeResolver } from './type-resolver';

/**
 * Type argument represents a data which can be passed to define a certain type.
 * 
 * @type {TypeArgument<TType>}
 */
export type TypeArgument<TType> = Alias | TypeFn<TType> | TypeResolver<TType> | undefined;
