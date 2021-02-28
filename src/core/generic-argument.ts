import { TypeArgument } from './type-argument';

/**
 * Generic argument represents a data which can be passed to define a generic type.
 * 
 * @type {GenericArgument<TType>}
 */
export type GenericArgument<TType> = TypeArgument<TType> | [TypeArgument<TType>, GenericArgument<any>[]];
