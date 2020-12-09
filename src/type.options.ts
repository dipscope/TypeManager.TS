import { TypeSerializer } from './type.serializer';

/**
 * Type options.
 * 
 * @type {TypeOptions}
 */
export interface TypeOptions
{
    /**
     * Serializer used to serialize and deserialize a type.
     * 
     * @type {TypeSerializer<any, any>}
     */
    typeSerializer?: TypeSerializer<any, any>;

    /**
     * Type alias. 
     * 
     * Can be used to resolve a type at runtime instead of type resolver function.
     * 
     * @type {string}
     */
    alias?: string;

    /**
     * Default value for undefined values.
     * 
     * @type {any}
     */
    defaultValue?: any;
}
