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
     * @type {TypeSerializer<any, any>}
     */
    public typeSerializer?: TypeSerializer<any, any>;

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
     * Emit default values for undefined values?
     * 
     * @type {boolean}
     */
    public emitDefaultValue?: boolean;

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
        if (!Fn.isNil(propertyOptions.typeResolver)) 
        {
            this.typeResolver = propertyOptions.typeResolver;
        }

        if (!Fn.isNil(propertyOptions.typeSerializer)) 
        {
            this.typeSerializer = propertyOptions.typeSerializer;
        }

        if (!Fn.isNil(propertyOptions.alias)) 
        {
            this.alias = propertyOptions.alias;
        }

        if (!Fn.isNil(propertyOptions.serializable)) 
        {
            this.serializable = propertyOptions.serializable;
        }

        if (!Fn.isNil(propertyOptions.deserializable))
        {
            this.deserializable = propertyOptions.deserializable;
        }

        if (!Fn.isNil(propertyOptions.emitDefaultValue)) 
        {
            this.emitDefaultValue = propertyOptions.emitDefaultValue;
        }

        return this;
    }
}
