import { Alias } from './alias';
import { TypeArgument } from './type-argument';
import { TypeOptionsBase } from './type-options-base';

/**
 * Property options.
 * 
 * @type {PropertyOptions<TType>}
 */
export interface PropertyOptions<TType> extends TypeOptionsBase<TType>
{
    /**
     * Property alias.
     * 
     * Used if property name in object differs from declared for type.
     * 
     * @type {Alias}
     */
    alias?: Alias;

    /**
     * Deserializable from object?
     * 
     * @type {boolean}
     */
    deserializable?: boolean;

    /**
     * Serializable to object?
     * 
     * @type {boolean}
     */
    serializable?: boolean;

    /**
     * Type argument.
     * 
     * @type {TypeArgument<TType>}
     */
    typeArgument?: TypeArgument<TType>;
}
