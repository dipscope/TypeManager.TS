import { Alias } from './alias';
import { TypeFn } from './type-fn';
import { TypeResolver } from './type-resolver';

/**
 * Type argument represents the data which can be passed to define a certain type.
 * 
 * @type {TypeArgument<TObject>}
 */
export type TypeArgument<TObject> = TypeFn<TObject> | TypeResolver<TObject> | Alias | undefined;
