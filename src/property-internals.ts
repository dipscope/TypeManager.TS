import { GenericMetadataResolver } from './generic-metadata-resolver';
import { GenericStructure } from './generic-structure';
import { TypeMetadataResolver } from './type-metadata-resolver';

/**
 * Property internals.
 * 
 * @type {PropertyInternals<TType>}
 */
export type PropertyInternals<TType> =
{
    /**
     * Type metadata resolver.
     * 
     * @type {TypeMetadataResolver<TType>}
     */
    typeMetadataResolver: TypeMetadataResolver<TType>;
    
    /**
     * Generic structures.
     * 
     * @type {Array<GenericStructure<any>>}
     */
    genericStructures?: Array<GenericStructure<any>>;

    /**
     * Generic metadata resolvers.
     * 
     * @type {Array<GenericMetadataResolver<any>>}
     */
    genericMetadataResolvers?: Array<GenericMetadataResolver<any>>;
}
