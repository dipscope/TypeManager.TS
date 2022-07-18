import { GenericArgument } from './generic-argument';
import { PropertyMetadata } from './property-metadata';
import { ReferenceValueSetter } from './reference-value-setter';
import { TypeMetadata } from './type-metadata';

/**
 * Serializer context options.
 * 
 * @type {SerializerContextOptions<TType>}
 */
export type SerializerContextOptions<TType> =
{
    /**
     * Json path key of current serializer context. It equals to $ for
     * root serializer context. Read about JSONPath for more info.
     * 
     * @type {string|number}
     */
    jsonPathKey: string | number;

    /**
     * Reference value setter if serialization may result in circular dependency
     * which must be resolved.
     * 
     * @type {ReferenceValueSetter}
     */
    referenceValueSetter?: ReferenceValueSetter;

    /**
     * Generic arguments.
     * 
     * @type {Array<GenericArgument<any>>}
     */
    genericArguments?: Array<GenericArgument<any>>;

    /**
     * Property metadata.
     * 
     * @type {PropertyMetadata<any, TType>}
     */
    propertyMetadata?: PropertyMetadata<any, TType>;

    /**
     * Type metadata.
     * 
     * @type {TypeMetadata<TType>}
     */
    typeMetadata: TypeMetadata<TType>;
}
