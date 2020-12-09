import { TypeCtor } from './type.ctor';
import { TypeMetadata } from './type.metadata';

/**
 * Type metadata resolver.
 * 
 * @type {TypeMetadataResolver}
 */
export type TypeMetadataResolver = (typeCtor: TypeCtor) => TypeMetadata;
