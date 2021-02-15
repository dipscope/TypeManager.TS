import { TypeCtor } from './type-ctor';

/**
 * Type resolver.
 * 
 * @type {TypeResolver<TType>}
 */
export type TypeResolver<TType> = () => TypeCtor<TType> | undefined;
