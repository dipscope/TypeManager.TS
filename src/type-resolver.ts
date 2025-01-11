import { TypeFn } from './type-fn';

/**
 * Type resolver.
 * 
 * @type {TypeResolver<TObject>}
 */
export type TypeResolver<TObject> = () => TypeFn<TObject>;
