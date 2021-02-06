import { Fn } from './utils';
import { TypeResolver } from './type.resolver';
import { TypeSerializer } from './type.serializer';
import { TypeInjector } from './type.injector';
import { TypeFactory } from './type.factory';
import { TypeMetadata } from './type.metadata';
import { PropertyOptions } from './property.options';
import { CustomData } from './custom.data';

/**
 * Main class used to describe certain property.
 * 
 * @type {PropertyMetadata}
 */
export class PropertyMetadata
{
    /**
     * Type metadata to which property metadata belongs to.
     * 
     * @type {TypeMetadata}
     */
    public readonly declaringTypeMetadata: TypeMetadata;

    /**
     * Property name as declared in type.
     * 
     * @type {string}
     */
    public readonly name: string;

    /**
     * Type resolver defined using reflect metadata.
     * 
     * Used as a fallback when type resolver is not defined.
     * 
     * @type {TypeResolver}
     */
    public readonly reflectTypeResolver: TypeResolver;

    /**
     * Property options.
     * 
     * @type {PropertyOptions}
     */
    public readonly propertyOptions: PropertyOptions = {};

    /**
     * Constructor.
     * 
     * @param {TypeMetadata} declaringTypeMetadata Type metadata to which property metadata belongs to.
     * @param {string} name Property name.
     */
    public constructor(declaringTypeMetadata: TypeMetadata, name: string)
    {
        const propertyTypeCtor = Fn.extractReflectMetadata('design:type', declaringTypeMetadata.typeCtor.prototype, name);

        this.declaringTypeMetadata    = declaringTypeMetadata;
        this.name                     = name;
        this.reflectTypeResolver      = () => propertyTypeCtor;
        this.propertyOptions.multiple = propertyTypeCtor === Array;

        return;
    }

    /**
     * Gets current alias.
     * 
     * @returns {string|undefined} Alias or undefined.
     */
    public get alias(): string | undefined
    {
        return this.propertyOptions.alias;
    }

    /**
     * Gets current custom data.
     * 
     * @returns {CustomData} Custom data.
     */
    public get customData(): CustomData
    {
        return this.propertyOptions.customData ?? this.typeMetadata?.customData ?? {};
    }

    /**
     * Gets current default value.
     * 
     * @returns {any|undefined} Resolved default value or undefined.
     */
    public get defaultValue(): any | undefined
    {
        const defaultValue = this.multiple ? [] : (this.propertyOptions.defaultValue ?? this.typeMetadata?.defaultValue);

        if (this.useDefaultValue)
        {
            return Fn.isFunction(defaultValue) ? defaultValue() : defaultValue;
        }

        return undefined;
    }

    /**
     * Gets current deserializable value.
     * 
     * @returns {boolean} True when property is deserializable. False otherwise.
     */
    public get deserializable(): boolean | undefined
    {
        return this.propertyOptions.deserializable;
    }

    /**
     * Gets current multiple value.
     * 
     * @returns {boolean} Multiple value or undefined.
     */
    public get multiple(): boolean | undefined
    {
        return this.propertyOptions.multiple;
    }

    /**
     * Gets indicator if default value should be used.
     * 
     * @returns {boolean} True when property should use default value. False otherwise.
     */
    public get useDefaultValue(): boolean | undefined
    {
        return this.propertyOptions.useDefaultValue ?? this.typeMetadata?.useDefaultValue;
    }

    /**
     * Gets indicator if implicit conversion should be used.
     * 
     * @returns {boolean} True when property should use implicit conversion. False otherwise.
     */
    public get useImplicitConversion(): boolean | undefined
    {
        return this.propertyOptions.useImplicitConversion ?? this.typeMetadata?.useImplicitConversion;
    }

    /**
     * Gets current serializable value.
     * 
     * @returns {boolean} True when property is serializable. False otherwise.
     */
    public get serializable(): boolean | undefined
    {
        return this.propertyOptions.serializable;
    }

    /**
     * Checks if serialization configured.
     * 
     * @returns {boolean} True when serialization configured. False otherwise.
     */
    public get serializationConfigured(): boolean
    {
        return !Fn.isNil(this.propertyOptions.serializable) || !Fn.isNil(this.propertyOptions.deserializable);
    }

    /**
     * Gets current type alias.
     * 
     * @returns {string|undefined} Type alias or undefined.
     */
    public get typeAlias(): string | undefined
    {
        return this.propertyOptions.typeAlias;
    }

    /**
     * Gets current type factory.
     * 
     * @returns {TypeFactory|undefined} Type factory or undefined.
     */
    public get typeFactory(): TypeFactory | undefined
    {
        return this.propertyOptions.typeFactory ?? this.typeMetadata?.typeFactory;
    }

    /**
     * Gets current type injector.
     * 
     * @returns {TypeInjector|undefined} Type injector or undefined.
     */
    public get typeInjector(): TypeInjector | undefined
    {
        return this.propertyOptions.typeInjector ?? this.typeMetadata?.typeInjector;
    }

    /**
     * Gets property type metadata if it can be defined.
     * 
     * @returns {TypeMetadata|undefined} Type metadata or undefined.
     */
    public get typeMetadata(): TypeMetadata | undefined
    {
        const typeCtor = this.typeResolver();

        if (!Fn.isNil(typeCtor))
        {
            return this.declaringTypeMetadata.resolveTypeMetadata(typeCtor);
        }

        return undefined;
    }

    /**
     * Gets current type resolver.
     * 
     * @type {TypeResolver} Type resolver or undefined.
     */
    public get typeResolver(): TypeResolver 
    {
        return this.propertyOptions.typeResolver ?? this.reflectTypeResolver;
    }

    /**
     * Gets current type serializer.
     * 
     * @returns {TypeSerializer|undefined} Type serializer or undefined.
     */
    public get typeSerializer(): TypeSerializer | undefined
    {
        return this.propertyOptions.typeSerializer ?? this.typeMetadata?.typeSerializer;
    }

    /**
     * Clones current metadata instance.
     * 
     * @returns {PropertyMetadata} Clone of current metadata instance.
     */
    public clone(): PropertyMetadata
    {
        const propertyMetadata = new PropertyMetadata(this.declaringTypeMetadata, this.name);
        const propertyOptions  = Fn.assign({}, this.propertyOptions);

        return propertyMetadata.configure(propertyOptions);
    }

    /**
     * Configures property options custom data.
     * 
     * @param {CustomData} customData Custom data.
     * 
     * @returns {PropertyMetadata} Configured property metadata.
     */
    public configurePropertyOptionsCustomData(customData: CustomData): PropertyMetadata
    {
        if (Fn.isNil(this.propertyOptions.customData))
        {
            this.propertyOptions.customData = {};
        }

        Fn.assign(this.propertyOptions.customData, customData);

        return this;
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
        if (!Fn.isUndefined(propertyOptions.alias))
        {
            this.propertyOptions.alias = propertyOptions.alias;
        }

        if (!Fn.isUndefined(propertyOptions.customData))
        {
            this.configurePropertyOptionsCustomData(propertyOptions.customData);
        }

        if (!Fn.isUndefined(propertyOptions.defaultValue)) 
        {
            this.propertyOptions.defaultValue = propertyOptions.defaultValue;
        }

        if (!Fn.isUndefined(propertyOptions.deserializable))
        {
            this.propertyOptions.deserializable = propertyOptions.deserializable;
        }

        if (!Fn.isUndefined(propertyOptions.multiple))
        {
            this.propertyOptions.multiple = propertyOptions.multiple;
        }

        if (!Fn.isUndefined(propertyOptions.useDefaultValue)) 
        {
            this.propertyOptions.useDefaultValue = propertyOptions.useDefaultValue;
        }

        if (!Fn.isUndefined(propertyOptions.useImplicitConversion)) 
        {
            this.propertyOptions.useImplicitConversion = propertyOptions.useImplicitConversion;
        }

        if (!Fn.isUndefined(propertyOptions.typeAlias)) 
        {
            this.propertyOptions.typeAlias = propertyOptions.typeAlias;
        }

        if (!Fn.isUndefined(propertyOptions.serializable)) 
        {
            this.propertyOptions.serializable = propertyOptions.serializable;
        }

        if (!Fn.isUndefined(propertyOptions.typeFactory))
        {
            this.propertyOptions.typeFactory = propertyOptions.typeFactory;
        }

        if (!Fn.isUndefined(propertyOptions.typeInjector))
        {
            this.propertyOptions.typeInjector = propertyOptions.typeInjector;
        }

        if (!Fn.isUndefined(propertyOptions.typeResolver))
        {
            this.propertyOptions.typeResolver = propertyOptions.typeResolver;
        }

        if (!Fn.isUndefined(propertyOptions.typeSerializer)) 
        {
            this.propertyOptions.typeSerializer = propertyOptions.typeSerializer;
        }

        return this;
    }
}
