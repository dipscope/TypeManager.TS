import { TypeArgument } from './type-argument';
import { TypeMetadata } from './type-metadata';

/**
 * Type metadata resolver used to resolve a certain type metadata by provided type argument.
 * 
 * @type {TypeMetadataResolver<TType>}
 */
export type TypeMetadataResolver<TType> = (typeArgument: TypeArgument<TType>) => TypeMetadata<TType>;
