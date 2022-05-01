import { Alias } from './alias';
import { CustomData } from './custom-data';
import { GenericArgument } from './generic-argument';
import { NamingConvention } from './naming-convention';
import { ReferenceHandler } from './reference-handler';
import { Serializer } from './serializer';
import { TypeArgument } from './type-argument';

/**
 * Property options.
 * 
 * @type {PropertyOptions<TType>}
 */
export interface PropertyOptions<TType>
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
     * Custom developer data.
     * 
     * @type {CustomData}
     */
    customData?: CustomData;

    /**
     * Default value for undefined ones.
     * 
     * Can be a lazy function which returns a value. Assigned only when 
     * use default value option is true.
     * 
     * @type {any}
     */
    defaultValue?: any;

    /**
     * Deserializable from object?
     * 
     * @type {boolean}
     */
    deserializable?: boolean;

    /**
     * Generic arguments.
     * 
     * @type {Array<GenericArgument<any>>}
     */
    genericArguments?: Array<GenericArgument<any>>;

    /**
     * Naming convention.
     * 
     * @type {NamingConvention}
     */
    namingConvention?: NamingConvention;

    /**
     * Reference handler.
     * 
     * @type {ReferenceHandler}
     */
    referenceHandler?: ReferenceHandler;

    /**
     * Serializable to object?
     * 
     * @type {boolean}
     */
    serializable?: boolean;

    /**
     * Serializer used to serialize and deserialize a property.
     * 
     * @type {Serializer<TType>}
     */
    serializer?: Serializer<TType>;

    /**
     * Type argument.
     * 
     * @type {TypeArgument<TType>}
     */
    typeArgument?: TypeArgument<TType>;

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
