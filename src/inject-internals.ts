import { TypeMetadataResolver } from './type-metadata-resolver';

/**
 * Inject internals.
 * 
 * @type {InjectInternals<TType>}
 */
export type InjectInternals<TType> =
{
    /**
     * Type metadata resolver.
     * 
     * @type {TypeMetadataResolver<TType>}
     */
    typeMetadataResolver: TypeMetadataResolver<TType>;
}
