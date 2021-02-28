import { PropertyMetadata } from './property-metadata';
import { TypeMetadata } from './type-metadata';
import { TypeOptionsBase } from './type-options-base';

/**
 * Serializer context options.
 * 
 * @type {SerializerContextOptions<TType>}
 */
export interface SerializerContextOptions<TType> extends TypeOptionsBase<TType>
{
    /**
     * Type metadata attached to a context.
     * 
     * @type {TypeMetadata<TType>}
     */
    typeMetadata?: TypeMetadata<TType>;

    /**
     * Property metadata attached to a context.
     * 
     * @type {PropertyMetadata<any, TType>}
     */
    propertyMetadata?: PropertyMetadata<any, TType>;
}
