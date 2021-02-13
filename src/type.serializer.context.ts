import { TypeMetadata } from './type.metadata';
import { PropertyMetadata } from './property.metadata';
import { TypeOptionsBase } from './type.options.base';

/**
 * Type serializer context.
 * 
 * @type {TypeSerializerContext<TType>}
 */
export interface TypeSerializerContext<TType> extends Partial<TypeOptionsBase<TType>>
{
    /**
     * Context path.
     * 
     * @type {string}
     */
    path: string;

    /**
     * Context property metadata if serialization is performed on property level.
     * 
     * @type {PropertyMetadata<any, TType>}
     */
    propertyMetadata?: PropertyMetadata<any, TType>;

    /**
     * Context type metadata.
     * 
     * @type {TypeMetadata<TType>}
     */
    typeMetadata?: TypeMetadata<TType>;
}
