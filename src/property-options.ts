import { Alias } from './alias';
import { CustomKey } from './custom-key';
import { CustomValue } from './custom-value';
import { DefaultValue } from './default-value';
import { GenericArgument } from './generic-argument';
import { NamingConvention } from './naming-convention';
import { ReferenceHandler } from './reference-handler';
import { Serializer } from './serializer';
import { TypeArgument } from './type-argument';

/**
 * Property options.
 * 
 * @type {PropertyOptions<TObject>}
 */
export type PropertyOptions<TObject> =
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
     * Custom value map defined by developer.
     * 
     * @type {Map<CustomKey<any>, CustomValue>}
     */
    customValueMap?: Map<CustomKey<any>, CustomValue>;

    /**
     * Default value for undefined ones.
     * 
     * Used to set both serialized and deserialized default values and 
     * only when use default value option is true.
     * 
     * @type {DefaultValue}
     */
    defaultValue?: DefaultValue;

    /**
     * Serialized default value for undefined ones.
     * 
     * Used only when use default value option is true.
     * 
     * @type {DefaultValue}
     */
    serializedDefaultValue?: DefaultValue;

    /**
     * Deserialized default value for undefined ones.
     * 
     * Used only when use default value option is true.
     * 
     * @type {DefaultValue}
     */
    deserializedDefaultValue?: DefaultValue;

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
     * @type {Serializer<TObject>}
     */
    serializer?: Serializer<TObject>;

    /**
     * Type argument.
     * 
     * @type {TypeArgument<TObject>}
     */
    typeArgument?: TypeArgument<TObject>;

    /**
     * If set to true then null values are preserved. Otherwise they will be 
     * treated as undefined.
     * 
     * @type {boolean}
     */
    preserveNull?: boolean,

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
};
