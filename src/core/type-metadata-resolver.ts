import { TypeCtor } from './type-ctor';
import { TypeMetadata } from './type-metadata';

/**
 * Type metadata resolver.
 * 
 * @type {TypeMetadataResolver}
 */
export type TypeMetadataResolver = <TType>(typeCtor: TypeCtor<TType>) => TypeMetadata<TType>;
