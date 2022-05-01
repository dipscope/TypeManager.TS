import { Alias } from './alias';
import { CustomData } from './custom-data';
import { Fn } from './fn';
import { GenericArgument } from './generic-argument';
import { GenericMetadata } from './generic-metadata';
import { Metadata } from './metadata';
import { NamingConvention } from './naming-convention';
import { PropertyName } from './property-name';
import { PropertyOptions } from './property-options';
import { ReferenceHandler } from './reference-handler';
import { Serializer } from './serializer';
import { TypeArgument } from './type-argument';
import { TypeFn } from './type-fn';
import { TypeMetadata } from './type-metadata';

/**
 * Main class used to describe a certain property.
 * 
 * @type {PropertyMetadata<TDeclaringType, TType>}
 */
export class PropertyMetadata<TDeclaringType, TType> extends Metadata
{
    /**
     * Type metadata to which property metadata belongs to.
     * 
     * @type {TypeMetadata<TDeclaringType>}
     */
    public readonly declaringTypeMetadata: TypeMetadata<TDeclaringType>;

    /**
     * Type function defined using reflect metadata.
     * 
     * Used as a fallback when type argument is not defined.
     * 
     * @type {TypeFn<TType>}
     */
    public readonly reflectTypeFn: TypeFn<TType>;

    /**
     * Property name as declared in type.
     * 
     * @type {PropertyName}
     */
    public readonly propertyName: PropertyName;

    /**
     * Property options.
     * 
     * @type {PropertyOptions<TType>}
     */
    public readonly propertyOptions: PropertyOptions<TType>;

    /**
     * Constructor.
     * 
     * @param {TypeMetadata<TDeclaringType>} declaringTypeMetadata Type metadata to which property metadata belongs to.
     * @param {PropertyName} propertyName Property name.
     * @param {PropertyOptions<TType>} propertyOptions Property options.
     */
    public constructor(declaringTypeMetadata: TypeMetadata<TDeclaringType>, propertyName: PropertyName, propertyOptions: PropertyOptions<TType>)
    {
        super(declaringTypeMetadata.typeMetadataResolver);

        this.declaringTypeMetadata = declaringTypeMetadata;
        this.propertyName = propertyName;
        this.reflectTypeFn = Fn.extractReflectMetadata('design:type', declaringTypeMetadata.typeFn.prototype, propertyName);
        this.propertyOptions = propertyOptions;

        return;
    }

    /**
     * Gets alias.
     * 
     * @returns {Alias|undefined} Alias or undefined.
     */
    public get alias(): Alias | undefined
    {
        return this.propertyOptions.alias;
    }

    /**
     * Gets custom data.
     * 
     * @returns {CustomData} Custom data.
     */
    public get customData(): CustomData
    {
        const customData = {};
        const typeCustomData = this.typeMetadata.customData;
        const propertyCustomData = this.propertyOptions.customData;

        if (!Fn.isNil(typeCustomData))
        {
            Fn.assign(customData, typeCustomData);
        }

        if (!Fn.isNil(propertyCustomData))
        {
            Fn.assign(customData, propertyCustomData);
        }

        return customData;
    }

    /**
     * Gets default value.
     * 
     * @returns {any|undefined} Resolved default value or undefined.
     */
    public get defaultValue(): any | undefined
    {
        const defaultValue = this.propertyOptions.defaultValue ?? this.typeMetadata.defaultValue;

        if (this.useDefaultValue)
        {
            return Fn.isFunction(defaultValue) ? defaultValue() : defaultValue;
        }

        return undefined;
    }

    /**
     * Gets deserializable value.
     * 
     * @returns {boolean|undefined} Deserializable indicator or undefined.
     */
    public get deserializable(): boolean | undefined
    {
        return this.propertyOptions.deserializable;
    }

    /**
     * Gets generic arguments.
     * 
     * @returns {Array<GenericArgument<any>>|undefined} Generic arguments or undefined.
     */
    public get genericArguments(): Array<GenericArgument<any>> | undefined
    {
        return this.propertyOptions.genericArguments ?? this.typeMetadata.genericArguments;
    }

    /**
     * Gets generic metadatas.
     * 
     * @returns {Array<GenericMetadata<any>>|undefined} Generic metadatas.
     */
    public get genericMetadatas(): Array<GenericMetadata<any>> | undefined
    {
        const genericArguments = this.genericArguments;

        if (Fn.isNil(genericArguments))
        {
            return undefined;
        }

        return this.defineGenericMetadatas(genericArguments);
    }

    /**
     * Gets naming convention.
     * 
     * @returns {NamingConvention|undefined} Naming convention or undefined.
     */
    public get namingConvention(): NamingConvention | undefined
    {
        return this.propertyOptions.namingConvention ?? this.typeMetadata.namingConvention;
    }

    /**
     * Gets reference handler.
     * 
     * @returns {ReferenceHandler} Reference handler.
     */
    public get referenceHandler(): ReferenceHandler 
    {
        return this.propertyOptions.referenceHandler ?? this.typeMetadata.referenceHandler;
    }

    /**
     * Gets serializable value.
     * 
     * @returns {boolean|undefined} Serializable indicator or undefined.
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
        return !Fn.isNil(this.serializable) || !Fn.isNil(this.deserializable);
    }

    /**
     * Gets serializer.
     * 
     * @returns {Serializer<TType>} Serializer.
     */
    public get serializer(): Serializer<TType> 
    {
        return this.propertyOptions.serializer ?? this.typeMetadata.serializer;
    }

    /**
     * Gets type argument.
     * 
     * @returns {TypeArgument|undefined} Type argument or undefined.
     */
    public get typeArgument(): TypeArgument<TType> | undefined
    {
        return this.propertyOptions.typeArgument;
    }

    /**
     * Gets type metadata.
     * 
     * @returns {TypeMetadata<TType>} Type metadata.
     */
    public get typeMetadata(): TypeMetadata<TType>
    {
        const typeArgument = this.typeArgument ?? this.reflectTypeFn;

        if (Fn.isNil(typeArgument))
        {
            throw new Error(`${this.declaringTypeMetadata.typeName}.${this.propertyName}: Cannot resolve property type metadata! This is usually caused by invalid configuration!`);
        }

        return this.defineTypeMetadata(typeArgument);
    }

    /**
     * Gets indicator if default value should be used.
     * 
     * @returns {boolean} Use default value indicator.
     */
    public get useDefaultValue(): boolean
    {
        return this.propertyOptions.useDefaultValue ?? this.typeMetadata.useDefaultValue;
    }

    /**
     * Gets indicator if implicit conversion should be used.
     * 
     * @returns {boolean} Use implicit conversion indicator.
     */
    public get useImplicitConversion(): boolean
    {
        return this.propertyOptions.useImplicitConversion ?? this.typeMetadata.useImplicitConversion;
    }

    /**
     * Configures custom data.
     * 
     * @param {CustomData} customData Custom data.
     * 
     * @returns {PropertyMetadata<TDeclaringType, TType>} Instance of property metadata.
     */
    private configureCustomData(customData: CustomData): PropertyMetadata<TDeclaringType, TType>
    {
        this.propertyOptions.customData = Fn.assign(this.propertyOptions.customData ?? {}, customData);

        return this;
    }

    /**
     * Configures property metadata based on provided options.
     * 
     * @param {PropertyOptions<TType>} propertyOptions Property options.
     * 
     * @returns {PropertyMetadata<TDeclaringType, TType>} Instance of property metadata.
     */
    public configure(propertyOptions: PropertyOptions<TType>): PropertyMetadata<TDeclaringType, TType>
    {
        if (!Fn.isUndefined(propertyOptions.alias))
        {
            this.propertyOptions.alias = propertyOptions.alias;
        }

        if (!Fn.isUndefined(propertyOptions.defaultValue))
        {
            this.propertyOptions.defaultValue = propertyOptions.defaultValue;
        }

        if (!Fn.isUndefined(propertyOptions.deserializable))
        {
            this.propertyOptions.deserializable = propertyOptions.deserializable;
        }

        if (!Fn.isUndefined(propertyOptions.genericArguments)) 
        {
            this.propertyOptions.genericArguments = propertyOptions.genericArguments;
        }

        if (!Fn.isUndefined(propertyOptions.namingConvention))
        {
            this.propertyOptions.namingConvention = propertyOptions.namingConvention;
        }

        if (!Fn.isUndefined(propertyOptions.referenceHandler)) 
        {
            this.propertyOptions.referenceHandler = propertyOptions.referenceHandler;
        }

        if (!Fn.isUndefined(propertyOptions.serializable)) 
        {
            this.propertyOptions.serializable = propertyOptions.serializable;
        }

        if (!Fn.isUndefined(propertyOptions.serializer)) 
        {
            this.propertyOptions.serializer = propertyOptions.serializer;
        }

        if (!Fn.isUndefined(propertyOptions.typeArgument)) 
        {
            this.propertyOptions.typeArgument = propertyOptions.typeArgument;
        }

        if (!Fn.isUndefined(propertyOptions.useDefaultValue))
        {
            this.propertyOptions.useDefaultValue = propertyOptions.useDefaultValue;
        }

        if (!Fn.isUndefined(propertyOptions.useImplicitConversion)) 
        {
            this.propertyOptions.useImplicitConversion = propertyOptions.useImplicitConversion;
        }

        if (!Fn.isUndefined(propertyOptions.customData))
        {
            this.configureCustomData(propertyOptions.customData);
        }

        return this;
    }
}
