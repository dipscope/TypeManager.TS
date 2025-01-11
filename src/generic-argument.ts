import { TypeArgument } from './type-argument';

/**
 * Generic argument represents a data which can be passed to define a generic type.
 * 
 * @type {GenericArgument<TObject>}
 */
export type GenericArgument<TObject> = TypeArgument<TObject> | [TypeArgument<TObject>, ReadonlyArray<GenericArgument<any>>];
