import { TypeFn } from './type-fn';
import { TypeMetadata } from './type-metadata';

/**
 * Type metadata extractor used to extract a certain type metadata by provided type function.
 * 
 * @type {TypeMetadataExtractor<TType>}
 */
export type TypeMetadataExtractor<TType> = (typeFn: TypeFn<TType>) => TypeMetadata<TType>;
