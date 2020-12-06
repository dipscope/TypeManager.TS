import { TypeCtor } from './type.ctor';

/**
 * Type resolver.
 * 
 * @type {TypeResolver}
 */
export type TypeResolver = () => TypeCtor | null | undefined;
