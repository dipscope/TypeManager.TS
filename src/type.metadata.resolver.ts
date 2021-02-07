import { TypeCtor } from './type.ctor';
import { TypeMetadata } from './type.metadata';

/**
 * Type metadata resolver.
 * 
 * @type {TypeMetadataResolver<TType>}
 */
export type TypeMetadataResolver<TType> = (typeCtor: TypeCtor<TType>) => TypeMetadata<TType>;
