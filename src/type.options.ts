import { PropertyOptions } from './property.options';
import { TypeOptionsBase } from './type.options.base';
import { TypeSerializer } from './type.serializer';

/**
 * Type options interface.
 * 
 * @type {TypeOptions}
 */
export interface TypeOptions extends TypeOptionsBase
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
}
