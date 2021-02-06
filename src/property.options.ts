import { TypeResolver } from './type.resolver';
import { TypeOptionsBase } from './type.options.base';

/**
 * Property options.
 * 
 * @type {PropertyOptions}
 */
export interface PropertyOptions extends Partial<TypeOptionsBase>
{
    /**
     * Property alias.
     * 
     * Used if property name in object differs from declared for type.
     * 
     * @type {string}
     */
    alias?: string;

    /**
     * Deserializable from object?
     * 
     * @type {boolean}
     */
    deserializable?: boolean;

    /**
     * Multiple property?
     * 
     * @type {boolean}
     */
    multiple?: boolean;

    /**
     * Serializable to object?
     * 
     * @type {boolean}
     */
    serializable?: boolean;

    /**
     * Type alias used to build a type resolver.
     * 
     * @type {string}
     */
    typeAlias?: string;

    /**
     * Type resolver to get a property type.
     * 
     * @type {TypeResolver}
     */
    typeResolver?: TypeResolver;
}
