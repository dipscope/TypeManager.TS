import { PropertyOptions } from './property.options';
import { TypeSerializer } from './type.serializer';

/**
 * Type options interface.
 * 
 * @type {TypeOptions}
 */
export interface TypeOptions
{
    /**
     * Property options related to this type.
     * 
     * @type {Map<string, PropertyOptions>}
     */
    propertyOptionsMap?: Map<string, PropertyOptions>;

    /**
     * Serializer used to serialize and deserialize a type.
     * 
     * @type {TypeSerializer}
     */
    typeSerializer?: TypeSerializer;

    /**
     * Type alias. 
     * 
     * Can be used to resolve a type at runtime instead of type resolver function.
     * 
     * @type {string}
     */
    alias?: string;

    /**
     * Default value for undefined ones.
     * 
     * Assigned only when use default value option is true.
     * 
     * @type {any}
     */
    defaultValue?: any;

    /**
     * Use default value assignment for undefined values?
     * 
     * @type {boolean}
     */
    useDefaultValue?: boolean;

    /**
     * Use implicit conversion when provided value can be converted
     * to the target one?
     * 
     * @type {boolean}
     */
    useImplicitConversion?: boolean;
}
