import { TypeSerializer } from './type.serializer';
import { TypeResolver } from './type.resolver';

/**
 * Property options.
 * 
 * @type {PropertyOptions}
 */
export interface PropertyOptions
{
    /**
     * Type resolver to get a property type.
     * 
     * @type {TypeResolver}
     */
    typeResolver?: TypeResolver;

    /**
     * Use reflect metadata when type resolver is not defined.
     * 
     * @type {boolean}
     */
    reflectMetadata?: boolean;

    /**
     * Custom property type serializer.
     * 
     * Used to override default one.
     * 
     * @type {TypeSerializer}
     */
    typeSerializer?: TypeSerializer;

    /**
     * Property alias.
     * 
     * Used if property name in object differs from declared for type.
     * 
     * @type {string}
     */
    alias?: string;

    /**
     * Serializable to object?
     * 
     * @type {boolean}
     */
    serializable?: boolean;

    /**
     * Deserializable from object?
     * 
     * @type {boolean}
     */
    deserializable?: boolean;

    /**
     * Emit default values for undefined values?
     * 
     * @type {boolean}
     */
    emitDefaultValue?: boolean;
}
