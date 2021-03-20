import { TypeFn } from './type-fn';

/**
 * Type resolver.
 * 
 * @type {TypeResolver<TType>}
 */
export type TypeResolver<TType> = () => TypeFn<TType>;
