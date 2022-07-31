import isFunction from 'lodash/isFunction';
import isNil from 'lodash/isNil';
import isUndefined from 'lodash/isUndefined';
import merge from 'lodash/merge';
import { Alias } from './alias';
import { CustomData } from './custom-data';
import { DefaultValue } from './default-value';
import { getReflectMetadata } from './functions/get-reflect-metadata';
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
        this.reflectTypeFn = getReflectMetadata('design:type', declaringTypeMetadata.typeFn.prototype, propertyName);
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

        if (!isNil(typeCustomData))
        {
            merge(customData, typeCustomData);
        }

        if (!isNil(propertyCustomData))
        {
            merge(customData, propertyCustomData);
        }

        return customData;
    }

    /**
     * Gets serialized null value.
     * 
     * @returns {any|undefined} Resolved serialized null value or undefined.
     */
    public get serializedNullValue(): any | undefined
    {
        if (this.preserveNull)
        {
            return null;
        }

        return this.serializedDefaultValue;
    }

    /**
     * Gets serialized default value.
     * 
     * @returns {any|undefined} Resolved serialized default value or undefined.
     */
    public get serializedDefaultValue(): any | undefined
    {
        if (this.useDefaultValue)
        {
            const serializedDefaultValue = this.propertyOptions.defaultValue ?? this.propertyOptions.serializedDefaultValue 
                ?? this.typeMetadata.serializedDefaultValue;

            return isFunction(serializedDefaultValue) ? serializedDefaultValue() : serializedDefaultValue;
        }

        return undefined;
    }

    /**
     * Gets deserialized null value.
     * 
     * @returns {any|undefined} Resolved deserialized null value or undefined.
     */
    public get deserializedNullValue(): any | undefined
    {
        if (this.preserveNull)
        {
            return null;
        }

        return this.deserializedDefaultValue;
    }
    
    /**
     * Gets deserialized default value.
     * 
     * @returns {any|undefined} Resolved deserialized default value or undefined.
     */
    public get deserializedDefaultValue(): any | undefined
    {
        if (this.useDefaultValue)
        {
            const deserializedDefaultValue = this.propertyOptions.defaultValue ?? this.propertyOptions.deserializedDefaultValue 
                ?? this.typeMetadata.deserializedDefaultValue;

            return isFunction(deserializedDefaultValue) ? deserializedDefaultValue() : deserializedDefaultValue;
        }

        return undefined;
    }
    
    /**
     * Gets serialized property name.
     * 
     * @returns {string} Serialized property name.
     */
    public get serializedPropertyName(): string
    {
        const alias = this.alias;

        if (isNil(alias))
        {
            const namingConvention = this.namingConvention ?? this.declaringTypeMetadata.namingConvention;
            const propertyName = namingConvention ? namingConvention.convert(this.propertyName) : this.propertyName;

            return propertyName;
        }

        return alias;
    }

    /**
     * Gets deserialized property name.
     * 
     * @returns {string} Deserialized property name.
     */
    public get deserializedPropertyName(): string
    {
        return this.propertyName;
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

        if (isNil(genericArguments))
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
        return !isNil(this.serializable) || !isNil(this.deserializable);
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

        if (isNil(typeArgument))
        {
            throw new Error(`${this.declaringTypeMetadata.typeName}.${this.propertyName}: cannot resolve property type metadata. This is usually caused by invalid configuration.`);
        }

        return this.defineTypeMetadata(typeArgument);
    }

    /**
     * Gets indicator if null value should be preserved.
     * 
     * @returns {boolean} True when null value should be preserved. False otherwise.
     */
    public get preserveNull(): boolean
    {
        return this.propertyOptions.preserveNull ?? this.typeMetadata.preserveNull;
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
     * Configures alias.
     * 
     * @param {Alias} alias Alias.
     * 
     * @returns {PropertyMetadata<TDeclaringType, TType>} Current instance of property metadata.
     */
    public configureAlias(alias: Alias): PropertyMetadata<TDeclaringType, TType>
    {
        this.propertyOptions.alias = alias;

        return this;
    }

    /**
     * Configures custom data.
     * 
     * @param {CustomData} customData Custom data.
     * 
     * @returns {PropertyMetadata<TDeclaringType, TType>} Current instance of property metadata.
     */
    public configureCustomData(customData: CustomData): PropertyMetadata<TDeclaringType, TType>
    {
        this.propertyOptions.customData = merge(this.propertyOptions.customData ?? {}, customData);

        return this;
    }

    /**
     * Configures default value.
     * 
     * @param {DefaultValue} defaultValue Default value.
     * 
     * @returns {PropertyMetadata<TDeclaringType, TType>} Current instance of property metadata.
     */
    public configureDefaultValue(defaultValue: DefaultValue): PropertyMetadata<TDeclaringType, TType>
    {
        this.propertyOptions.defaultValue = defaultValue;

        return this;
    }

    /**
     * Configures serialized default value.
     * 
     * @param {DefaultValue} serializedDefaultValue Serialized default value.
     * 
     * @returns {PropertyMetadata<TDeclaringType, TType>} Current instance of property metadata.
     */
    public configureSerializedDefaultValue(serializedDefaultValue: DefaultValue): PropertyMetadata<TDeclaringType, TType>
    {
        this.propertyOptions.serializedDefaultValue = serializedDefaultValue;

        return this;
    }

    /**
     * Configures deserialized default value.
     * 
     * @param {DefaultValue} deserializedDefaultValue Deserialized default value.
     * 
     * @returns {PropertyMetadata<TDeclaringType, TType>} Current instance of property metadata.
     */
    public configureDeserializedDefaultValue(deserializedDefaultValue: DefaultValue): PropertyMetadata<TDeclaringType, TType>
    {
        this.propertyOptions.deserializedDefaultValue = deserializedDefaultValue;

        return this;
    }

    /**
     * Configures deserializable.
     * 
     * @param {boolean} deserializable Deserializable.
     * 
     * @returns {PropertyMetadata<TDeclaringType, TType>} Current instance of property metadata.
     */
    public configureDeserializable(deserializable: boolean): PropertyMetadata<TDeclaringType, TType>
    {
        this.propertyOptions.deserializable = deserializable;

        return this;
    }

    /**
     * Configures serializable.
     * 
     * @param {boolean} serializable Serializable.
     * 
     * @returns {PropertyMetadata<TDeclaringType, TType>} Current instance of property metadata.
     */
    public configureSerializable(serializable: boolean): PropertyMetadata<TDeclaringType, TType>
    {
        this.propertyOptions.serializable = serializable;

        return this;
    }

    /**
     * Configures generic arguments.
     * 
     * @param {Array<GenericArgument<any>>|undefined} genericArguments Generic arguments.
     * 
     * @returns {PropertyMetadata<TDeclaringType, TType>} Current instance of property metadata.
     */
    public configureGenericArguments(genericArguments: Array<GenericArgument<any>> | undefined): PropertyMetadata<TDeclaringType, TType>
    {
        this.propertyOptions.genericArguments = genericArguments;

        return this;
    }

    /**
     * Configures naming convention.
     * 
     * @param {NamingConvention} namingConvention Naming convention.
     * 
     * @returns {PropertyMetadata<TDeclaringType, TType>} Current instance of property metadata.
     */
    public configureNamingConvention(namingConvention: NamingConvention): PropertyMetadata<TDeclaringType, TType>
    {
        this.propertyOptions.namingConvention = namingConvention;

        return this;
    }

    /**
     * Configures reference handler.
     * 
     * @param {ReferenceHandler} referenceHandler Reference handler.
     * 
     * @returns {PropertyMetadata<TDeclaringType, TType>} Current instance of property metadata.
     */
    public configureReferenceHandler(referenceHandler: ReferenceHandler): PropertyMetadata<TDeclaringType, TType>
    {
        this.propertyOptions.referenceHandler = referenceHandler;

        return this;
    }

    /**
     * Configures serializer.
     * 
     * @param {Serializer<TType>} serializer Serializer.
     * 
     * @returns {PropertyMetadata<TDeclaringType, TType>} Current instance of property metadata.
     */
    public configureSerializer(serializer: Serializer<TType>): PropertyMetadata<TDeclaringType, TType>
    {
        this.propertyOptions.serializer = serializer;

        return this;
    }

    /**
     * Configures type argument.
     * 
     * @param {TypeArgument<TType>} typeArgument Type argument.
     * 
     * @returns {PropertyMetadata<TDeclaringType, TType>} Current instance of property metadata.
     */
    public configureTypeArgument(typeArgument: TypeArgument<TType>): PropertyMetadata<TDeclaringType, TType>
    {
        this.propertyOptions.typeArgument = typeArgument;

        return this;
    }

    /**
     * Configures preserve null.
     * 
     * @param {boolean} preserveNull Preserve null.
     * 
     * @returns {PropertyMetadata<TDeclaringType, TType>} Current instance of property metadata.
     */
    public configurePreserveNull(preserveNull: boolean): PropertyMetadata<TDeclaringType, TType>
    {
        this.propertyOptions.preserveNull = preserveNull;

        return this;
    }

    /**
     * Configures use default value.
     * 
     * @param {boolean} useDefaultValue Use default value.
     * 
     * @returns {PropertyMetadata<TDeclaringType, TType>} Current instance of property metadata.
     */
    public configureUseDefaultValue(useDefaultValue: boolean): PropertyMetadata<TDeclaringType, TType>
    {
        this.propertyOptions.useDefaultValue = useDefaultValue;

        return this;
    }

    /**
     * Configures use implicit convertion.
     * 
     * @param {boolean} useImplicitConversion Use implicit convertion.
     * 
     * @returns {PropertyMetadata<TDeclaringType, TType>} Current instance of property metadata.
     */
    public configureUseImplicitConversion(useImplicitConversion: boolean): PropertyMetadata<TDeclaringType, TType>
    {
        this.propertyOptions.useImplicitConversion = useImplicitConversion;

        return this;
    }

    /**
     * Configures property metadata based on provided options.
     * 
     * @param {PropertyOptions<TType>} propertyOptions Property options.
     * 
     * @returns {PropertyMetadata<TDeclaringType, TType>} Current instance of property metadata.
     */
    public configure(propertyOptions: PropertyOptions<TType>): PropertyMetadata<TDeclaringType, TType>
    {
        if (!isUndefined(propertyOptions.alias))
        {
            this.configureAlias(propertyOptions.alias);
        }

        if (!isUndefined(propertyOptions.customData))
        {
            this.configureCustomData(propertyOptions.customData);
        }

        if (!isUndefined(propertyOptions.defaultValue))
        {
            this.configureDefaultValue(propertyOptions.defaultValue);
        }

        if (!isUndefined(propertyOptions.serializedDefaultValue))
        {
            this.configureSerializedDefaultValue(propertyOptions.serializedDefaultValue);
        }

        if (!isUndefined(propertyOptions.deserializedDefaultValue))
        {
            this.configureDeserializedDefaultValue(propertyOptions.deserializedDefaultValue);
        }

        if (!isUndefined(propertyOptions.deserializable))
        {
            this.configureDeserializable(propertyOptions.deserializable);
        }

        if (!isUndefined(propertyOptions.genericArguments)) 
        {
            this.configureGenericArguments(propertyOptions.genericArguments);
        }

        if (!isUndefined(propertyOptions.namingConvention))
        {
            this.configureNamingConvention(propertyOptions.namingConvention);
        }

        if (!isUndefined(propertyOptions.referenceHandler)) 
        {
            this.configureReferenceHandler(propertyOptions.referenceHandler);
        }

        if (!isUndefined(propertyOptions.serializable)) 
        {
            this.configureSerializable(propertyOptions.serializable);
        }

        if (!isUndefined(propertyOptions.serializer)) 
        {
            this.configureSerializer(propertyOptions.serializer);
        }

        if (!isUndefined(propertyOptions.typeArgument)) 
        {
            this.configureTypeArgument(propertyOptions.typeArgument);
        }

        if (!isUndefined(propertyOptions.preserveNull))
        {
            this.configurePreserveNull(propertyOptions.preserveNull);
        }

        if (!isUndefined(propertyOptions.useDefaultValue))
        {
            this.configureUseDefaultValue(propertyOptions.useDefaultValue);
        }

        if (!isUndefined(propertyOptions.useImplicitConversion)) 
        {
            this.configureUseImplicitConversion(propertyOptions.useImplicitConversion);
        }

        return this;
    }
}
