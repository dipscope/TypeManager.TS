import { Fn } from './utils';
import { TypeResolver } from './type.resolver';
import { TypeSerializer } from './type.serializer';
import { PropertyOptions } from './property.options';

/**
 * Main class used to describe certain property.
 * 
 * @type {PropertyMetadata}
 */
export class PropertyMetadata
{
    /**
     * Property name as declared in type.
     * 
     * @type {string}
     */
    public name: string;

    /**
     * Type resolver to get a property type.
     * 
     * @type {TypeResolver}
     */
    public typeResolver: TypeResolver;

    /**
     * Custom property type serializer.
     * 
     * Used to override default one.
     * 
     * @type {TypeSerializer}
     */
    public typeSerializer?: TypeSerializer;

    /**
     * Property alias.
     * 
     * Used if property name in object differs from declared for type.
     * 
     * @type {string}
     */
    public alias?: string;

    /**
     * Serializable to object?
     * 
     * @type {boolean}
     */
    public serializable?: boolean;

    /**
     * Deserializable from object?
     * 
     * @type {boolean}
     */
    public deserializable?: boolean;

    /**
     * Default value for undefined ones.
     * 
     * Assigned only when use default value option is true.
     * 
     * @type {any}
     */
    public defaultValue?: any;

    /**
     * Use default value assignment for undefined values?
     * 
     * @type {boolean}
     */
    public useDefaultValue?: boolean;

    /**
     * Use implicit conversion when provided value can be converted
     * to the target one?
     * 
     * @type {boolean}
     */
    public useImplicitConversion?: boolean;

    /**
     * Constructor.
     * 
     * @param {string} name Property name.
     */
    public constructor(name: string)
    {
        this.name         = name;
        this.typeResolver = () => null;

        return;
    }

    /**
     * Checks if serialization configured.
     * 
     * @returns {boolean} True when serialization configured. False otherwise.
     */
    public get serializationConfigured(): boolean
    {
        return !Fn.isNil(this.serializable) || !Fn.isNil(this.deserializable);
    }

    /**
     * Configures property metadata based on provided options.
     * 
     * @param {PropertyOptions} propertyOptions Property options.
     * 
     * @returns {PropertyMetadata} Instance of property metadata.
     */
    public configure(propertyOptions: PropertyOptions): PropertyMetadata
    {
        if (!Fn.isUndefined(propertyOptions.typeResolver)) 
        {
            this.typeResolver = propertyOptions.typeResolver;
        }

        if (!Fn.isUndefined(propertyOptions.typeSerializer)) 
        {
            this.typeSerializer = propertyOptions.typeSerializer;
        }

        if (!Fn.isUndefined(propertyOptions.alias)) 
        {
            this.alias = propertyOptions.alias;
        }

        if (!Fn.isUndefined(propertyOptions.serializable)) 
        {
            this.serializable = propertyOptions.serializable;
        }

        if (!Fn.isUndefined(propertyOptions.deserializable))
        {
            this.deserializable = propertyOptions.deserializable;
        }

        if (!Fn.isUndefined(propertyOptions.defaultValue)) 
        {
            this.defaultValue = propertyOptions.defaultValue;
        }

        if (!Fn.isUndefined(propertyOptions.useDefaultValue)) 
        {
            this.useDefaultValue = propertyOptions.useDefaultValue;
        }

        if (!Fn.isUndefined(propertyOptions.useImplicitConversion)) 
        {
            this.useImplicitConversion = propertyOptions.useImplicitConversion;
        }

        return this;
    }
}
