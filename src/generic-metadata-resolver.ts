import { TypeMetadataResolver } from './type-metadata-resolver';

/**
 * Generic metadata resolver used to resolve a certain type metadata from generic structure.
 * 
 * @type {GenericMetadataResolver<TType>}
 */
export type GenericMetadataResolver<TType> = [TypeMetadataResolver<TType>, Array<GenericMetadataResolver<any>>];
