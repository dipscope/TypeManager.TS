import { TypeArgument } from './type-argument';

/**
 * Generic structure to which generic argument is transformed for internal usage.
 * 
 * @type {GenericStructure<TType>}
 */
export type GenericStructure<TType> = [TypeArgument<TType>, Array<GenericStructure<any>>];
