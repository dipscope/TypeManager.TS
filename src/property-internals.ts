import { CustomContext } from './custom-context';
import { GenericMetadataResolver } from './generic-metadata-resolver';
import { GenericStructure } from './generic-structure';
import { TypeMetadataResolver } from './type-metadata-resolver';

/**
 * Property internals.
 * 
 * @type {PropertyInternals}
 */
export type PropertyInternals =
{
    /**
     * Type metadata resolver.
     * 
     * @type {TypeMetadataResolver<any>}
     */
    typeMetadataResolver: TypeMetadataResolver<any>;
    
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
    
    /**
     * Custom context.
     * 
     * @type {CustomContext}
     */
    customContext?: CustomContext;
}
