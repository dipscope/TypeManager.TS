import { TypeMetadataResolver } from './type-metadata-resolver';

/**
 * Inject internals.
 * 
 * @type {InjectInternals}
 */
export type InjectInternals =
{
    /**
     * Type metadata resolver.
     * 
     * @type {TypeMetadataResolver<any>}
     */
    typeMetadataResolver: TypeMetadataResolver<any>;
}
