import { isFunction, isNil, isUndefined, merge } from 'lodash';
import { Alias } from './alias';
import { CustomData } from './custom-data';
import { DefaultValue } from './default-value';
import { getReflectMetadata } from './functions/get-reflect-metadata';
import { GenericArgument } from './generic-argument';
import { GenericMetadata } from './generic-metadata';
import { GenericMetadataResolver } from './generic-metadata-resolver';
import { GenericStructure } from './generic-structure';
import { Metadata } from './metadata';
import { NamingConvention } from './naming-convention';
import { PropertyInternals } from './property-internals';
import { PropertyName } from './property-name';
import { PropertyOptions } from './property-options';
import { ReferenceHandler } from './reference-handler';
import { Serializer } from './serializer';
import { TypeArgument } from './type-argument';
import { TypeFn } from './type-fn';
import { TypeMetadata } from './type-metadata';
import { TypeMetadataResolver } from './type-metadata-resolver';

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
     * Property internals.
     * 
     * @type {PropertyInternals<TType>}
     */
    public readonly propertyInternals: PropertyInternals<TType>;

    /**
     * Type function defined using reflect metadata.
     * 
     * Used as a fallback when type argument is not defined.
     * 
     * @type {TypeFn<TType>}
     */
    public readonly reflectTypeFn?: TypeFn<TType>;

    /**
     * Constructor.
     * 
     * @param {TypeMetadata<TDeclaringType>} declaringTypeMetadata Type metadata to which property metadata belongs to.
     * @param {PropertyName} propertyName Property name.
     * @param {PropertyOptions<TType>} propertyOptions Property options.
     */
    public constructor(
        declaringTypeMetadata: TypeMetadata<TDeclaringType>, 
        propertyName: PropertyName, 
        propertyOptions: PropertyOptions<TType>
    )
    {
        super(declaringTypeMetadata.typeMetadataExtractor, declaringTypeMetadata.typeFnMap);
        
        this.declaringTypeMetadata = declaringTypeMetadata;
        this.propertyName = propertyName;
        this.reflectTypeFn = getReflectMetadata('design:type', declaringTypeMetadata.typeFn.prototype, propertyName);
        this.propertyOptions = this.constructPropertyOptions(propertyOptions);
        this.propertyInternals = this.constructPropertyInternals();

        this.configure(propertyOptions);

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
            const serializedDefaultValue = this.propertyOptions.defaultValue 
                ?? this.propertyOptions.serializedDefaultValue 
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
            const deserializedDefaultValue = this.propertyOptions.defaultValue 
                ?? this.propertyOptions.deserializedDefaultValue 
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
        return this.propertyOptions.genericArguments;
    }

    /**
     * Gets generic structures.
     * 
     * @returns {Array<GenericStructure<any>>|undefined} Generic structures or undefined.
     */
    public get genericStructures(): Array<GenericStructure<any>> | undefined
    {
        return this.propertyInternals.genericStructures;
    }

    /**
     * Gets generic metadata resolvers.
     * 
     * @returns {Array<GenericMetadataResolver<any>>|undefined} Generic metadata resolvers or undefined.
     */
    public get genericMetadataResolvers(): Array<GenericMetadataResolver<any>> | undefined
    {
        return this.propertyInternals.genericMetadataResolvers;
    }

    /**
     * Gets generic metadatas.
     * 
     * @returns {Array<GenericMetadata<any>>|undefined} Generic metadatas.
     */
    public get genericMetadatas(): Array<GenericMetadata<any>> | undefined
    {
        const genericStructures = this.genericStructures;
        const genericMetadataResolvers = this.genericMetadataResolvers;

        if (isNil(genericStructures) || isNil(genericMetadataResolvers))
        {
            return undefined;
        }

        return this.defineGenericMetadatas(genericStructures, genericMetadataResolvers);
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
     * @returns {TypeArgument} Type argument.
     */
    public get typeArgument(): TypeArgument<TType>
    {
        return this.propertyOptions.typeArgument;
    }

    /**
     * Gets type metadata resolver.
     * 
     * @returns {TypeMetadataResolver<TType>} Type metadata resolver.
     */
    public get typeMetadataResolver(): TypeMetadataResolver<TType>
    {
        return this.propertyInternals.typeMetadataResolver;
    }

    /**
     * Gets type metadata.
     * 
     * @returns {TypeMetadata<TType>} Type metadata.
     */
    public get typeMetadata(): TypeMetadata<TType>
    {
        return this.typeMetadataResolver(this.typeArgument);
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
     * Constructs initial property options by extending passed options 
     * with default values if they are not overriden. All references are kept.
     * 
     * @param {PropertyOptions<TType>} propertyOptions Type options.
     * 
     * @returns {PropertyOptions<TType>} Constructed property options.
     */
    private constructPropertyOptions(propertyOptions: PropertyOptions<TType>): PropertyOptions<TType>
    {
        propertyOptions.typeArgument = propertyOptions.typeArgument ?? this.reflectTypeFn;

        return propertyOptions;
    }

    /**
     * Constructs property internals.
     * 
     * @returns {PropertyInternals<TType>} Property internals.
     */
    private constructPropertyInternals(): PropertyInternals<TType>
    {
        const typeMetadataResolver = this.defineTypeMetadataResolver(this.propertyOptions.typeArgument);
        const propertyInternals = { typeMetadataResolver: typeMetadataResolver };

        return propertyInternals;
    }

    /**
     * Configures alias.
     * 
     * @param {Alias} alias Alias.
     * 
     * @returns {PropertyMetadata<TDeclaringType, TType>} Current instance of property metadata.
     */
    public hasAlias(alias: Alias | undefined): PropertyMetadata<TDeclaringType, TType>
    {
        this.propertyOptions.alias = alias;

        return this;
    }

    /**
     * Configures custom data.
     * 
     * @param {CustomData|undefined} customData Custom data.
     * 
     * @returns {PropertyMetadata<TDeclaringType, TType>} Current instance of property metadata.
     */
    public hasCustomData(customData: CustomData | undefined): PropertyMetadata<TDeclaringType, TType>
    {
        this.propertyOptions.customData = merge(this.propertyOptions.customData ?? {}, customData ?? {});

        return this;
    }

    /**
     * Configures default value.
     * 
     * @param {DefaultValue} defaultValue Default value.
     * 
     * @returns {PropertyMetadata<TDeclaringType, TType>} Current instance of property metadata.
     */
    public hasDefaultValue(defaultValue: DefaultValue): PropertyMetadata<TDeclaringType, TType>
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
    public hasSerializedDefaultValue(serializedDefaultValue: DefaultValue): PropertyMetadata<TDeclaringType, TType>
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
    public hasDeserializedDefaultValue(deserializedDefaultValue: DefaultValue): PropertyMetadata<TDeclaringType, TType>
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
    public isDeserializable(deserializable: boolean = true): PropertyMetadata<TDeclaringType, TType>
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
    public isSerializable(serializable: boolean = true): PropertyMetadata<TDeclaringType, TType>
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
    public hasGenericArguments(genericArguments: Array<GenericArgument<any>> | undefined): PropertyMetadata<TDeclaringType, TType>
    {
        this.propertyOptions.genericArguments = genericArguments;

        if (isNil(genericArguments))
        {
            this.propertyInternals.genericStructures = undefined;
            this.propertyInternals.genericMetadataResolvers = undefined;

            return this;
        }

        const genericStructures = this.defineGenericStructures(genericArguments);

        this.propertyInternals.genericStructures = genericStructures;
        this.propertyInternals.genericMetadataResolvers = this.defineGenericMetadataResolvers(genericStructures);

        return this;
    }

    /**
     * Configures naming convention.
     * 
     * @param {NamingConvention|undefined} namingConvention Naming convention.
     * 
     * @returns {PropertyMetadata<TDeclaringType, TType>} Current instance of property metadata.
     */
    public hasNamingConvention(namingConvention: NamingConvention | undefined): PropertyMetadata<TDeclaringType, TType>
    {
        this.propertyOptions.namingConvention = namingConvention;

        return this;
    }

    /**
     * Configures reference handler.
     * 
     * @param {ReferenceHandler|undefined} referenceHandler Reference handler.
     * 
     * @returns {PropertyMetadata<TDeclaringType, TType>} Current instance of property metadata.
     */
    public hasReferenceHandler(referenceHandler: ReferenceHandler | undefined): PropertyMetadata<TDeclaringType, TType>
    {
        this.propertyOptions.referenceHandler = referenceHandler;

        return this;
    }

    /**
     * Configures serializer.
     * 
     * @param {Serializer<TType>|undefined} serializer Serializer.
     * 
     * @returns {PropertyMetadata<TDeclaringType, TType>} Current instance of property metadata.
     */
    public hasSerializer(serializer: Serializer<TType> | undefined): PropertyMetadata<TDeclaringType, TType>
    {
        this.propertyOptions.serializer = serializer;

        return this;
    }

    /**
     * Configures type argument.
     * 
     * @param {TypeArgument<TType>|undefined} typeArgument Type argument.
     * 
     * @returns {PropertyMetadata<TDeclaringType, TType>} Current instance of property metadata.
     */
    public hasTypeArgument(typeArgument: TypeArgument<TType> | undefined): PropertyMetadata<TDeclaringType, TType>
    {
        this.propertyOptions.typeArgument = typeArgument ?? this.reflectTypeFn;
        this.propertyInternals.typeMetadataResolver = this.defineTypeMetadataResolver(this.propertyOptions.typeArgument);

        return this;
    }

    /**
     * Configures preserve null.
     * 
     * @param {boolean} preserveNull Preserve null.
     * 
     * @returns {PropertyMetadata<TDeclaringType, TType>} Current instance of property metadata.
     */
    public shouldPreserveNull(preserveNull: boolean = true): PropertyMetadata<TDeclaringType, TType>
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
    public shouldUseDefaultValue(useDefaultValue: boolean = true): PropertyMetadata<TDeclaringType, TType>
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
    public shouldUseImplicitConversion(useImplicitConversion: boolean = true): PropertyMetadata<TDeclaringType, TType>
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
            this.hasAlias(propertyOptions.alias);
        }

        if (!isUndefined(propertyOptions.customData))
        {
            this.hasCustomData(propertyOptions.customData);
        }

        if (!isUndefined(propertyOptions.defaultValue))
        {
            this.hasDefaultValue(propertyOptions.defaultValue);
        }

        if (!isUndefined(propertyOptions.serializedDefaultValue))
        {
            this.hasSerializedDefaultValue(propertyOptions.serializedDefaultValue);
        }

        if (!isUndefined(propertyOptions.deserializedDefaultValue))
        {
            this.hasDeserializedDefaultValue(propertyOptions.deserializedDefaultValue);
        }

        if (!isUndefined(propertyOptions.deserializable))
        {
            this.isDeserializable(propertyOptions.deserializable);
        }

        if (!isUndefined(propertyOptions.genericArguments)) 
        {
            this.hasGenericArguments(propertyOptions.genericArguments);
        }

        if (!isUndefined(propertyOptions.namingConvention))
        {
            this.hasNamingConvention(propertyOptions.namingConvention);
        }

        if (!isUndefined(propertyOptions.referenceHandler)) 
        {
            this.hasReferenceHandler(propertyOptions.referenceHandler);
        }

        if (!isUndefined(propertyOptions.serializable)) 
        {
            this.isSerializable(propertyOptions.serializable);
        }

        if (!isUndefined(propertyOptions.serializer)) 
        {
            this.hasSerializer(propertyOptions.serializer);
        }

        if (!isUndefined(propertyOptions.typeArgument)) 
        {
            this.hasTypeArgument(propertyOptions.typeArgument);
        }

        if (!isUndefined(propertyOptions.preserveNull))
        {
            this.shouldPreserveNull(propertyOptions.preserveNull);
        }

        if (!isUndefined(propertyOptions.useDefaultValue))
        {
            this.shouldUseDefaultValue(propertyOptions.useDefaultValue);
        }

        if (!isUndefined(propertyOptions.useImplicitConversion)) 
        {
            this.shouldUseImplicitConversion(propertyOptions.useImplicitConversion);
        }

        return this;
    }
}
