import { TypeMetadata } from './type-metadata';
import { PropertyMetadata } from './property-metadata';
import { TypeOptionsBase } from './type-options-base';
import { Log } from './log';

/**
 * Serializer context.
 * 
 * @type {SerializerContext<TType>}
 */
export interface SerializerContext<TType> extends Partial<TypeOptionsBase<TType>>
{
    /**
     * Log instance.
     * 
     * @type {Log}
     */
    log: Log;

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
