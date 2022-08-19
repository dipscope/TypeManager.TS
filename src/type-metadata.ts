import { isFunction, isNil, isUndefined, merge } from 'lodash';
import { Alias } from './alias';
import { CustomData } from './custom-data';
import { DefaultValue } from './default-value';
import { Discriminant } from './discriminant';
import { Discriminator } from './discriminator';
import { Factory } from './factory';
import { getOwnReflectMetadata } from './functions/get-own-reflect-metadata';
import { nameOf } from './functions/name-of';
import { GenericArgument } from './generic-argument';
import { GenericMetadata } from './generic-metadata';
import { InjectIndex } from './inject-index';
import { InjectMetadata } from './inject-metadata';
import { InjectOptions } from './inject-options';
import { Injector } from './injector';
import { Log } from './log';
import { Metadata } from './metadata';
import { NamingConvention } from './naming-convention';
import { PropertyMetadata } from './property-metadata';
import { PropertyName } from './property-name';
import { PropertyOptions } from './property-options';
import { ReferenceHandler } from './reference-handler';
import { Serializer } from './serializer';
import { TypeFn } from './type-fn';
import { TypeMetadataResolver } from './type-metadata-resolver';
import { TypeName } from './type-name';
import { TypeOptions } from './type-options';
import { TypeOptionsBase } from './type-options-base';

/**
 * Main class used to describe a certain type.
 * 
 * @type {TypeMetadata<TType>}
 */
export class TypeMetadata<TType> extends Metadata
{
    /**
     * Type name. 
     * 
     * Defined at runtime based on the constructor function.
     * 
     * @type {TypeName}
     */
    public readonly typeName: TypeName;

    /**
     * Type function.
     * 
     * @type {TypeFn<TType>}
     */
    public readonly typeFn: TypeFn<TType>;

    /**
     * Type function map for types with aliases.
     * 
     * @type {Map<Alias, TypeFn<any>>}
     */
    public readonly typeFnMap: Map<Alias, TypeFn<any>>;

    /**
     * Type options used by default.
     * 
     * @type {TypeOptionsBase<TType>}
     */
    public readonly typeOptionsBase: TypeOptionsBase<TType>;

    /**
     * Type options.
     * 
     * @type {TypeOptions<TType>}
     */
    public readonly typeOptions: TypeOptions<TType>;

    /**
     * Children type metadata map.
     * 
     * @type {Map<TypeFn<TType>, TypeMetadata<any>>}
     */
    public readonly childrenTypeMetadataMap: Map<TypeFn<any>, TypeMetadata<any>> = new Map<TypeFn<any>, TypeMetadata<any>>();

    /**
     * Discriminant map.
     * 
     * @type {Map<TypeFn<any>, Discriminant>}
     */
    public readonly discriminantMap: Map<TypeFn<any>, Discriminant> = new Map<TypeFn<any>, Discriminant>();

    /**
     * Properties defined for a type.
     * 
     * @type {Map<PropertyName, PropertyMetadata<TType, any>>}
     */
    public readonly propertyMetadataMap: Map<PropertyName, PropertyMetadata<TType, any>> = new Map<PropertyName, PropertyMetadata<TType, any>>();

    /**
     * Injections defined for a type.
     * 
     * @type {Map<InjectIndex, InjectMetadata<TType, any>>}
     */
    public readonly injectMetadataMap: Map<InjectIndex, InjectMetadata<TType, any>> = new Map<InjectIndex, InjectMetadata<TType, any>>();

    /**
     * Parent type metadata.
     * 
     * @type {TypeMetadata<any>}
     */
    public readonly parentTypeMetadata?: TypeMetadata<any>;

    /**
     * Constructor.
     * 
     * @param {TypeMetadataResolver<any>} typeMetadataResolver Type metadata resolver.
     * @param {TypeFn<any>} typeFn Type function.
     * @param {Map<Alias, TypeFn<any>>} typeFnMap Type function map.
     * @param {TypeOptionsBase<TType>} typeOptionsBase Type options used by default.
     * @param {TypeOptions<TType>} typeOptions Type options.
     * @param {TypeMetadata<any>} parentTypeMetadata Parent type metadata.
     */
    public constructor(
        typeMetadataResolver: TypeMetadataResolver<any>, 
        typeFn: TypeFn<TType>, 
        typeFnMap: Map<Alias, TypeFn<any>>,
        typeOptionsBase: TypeOptionsBase<TType>, 
        typeOptions: TypeOptions<TType>, 
        parentTypeMetadata?: TypeMetadata<any>
    )
    {
        super(typeMetadataResolver);

        this.typeName = nameOf(typeFn);
        this.typeFn = typeFn;
        this.typeFnMap = typeFnMap;
        this.typeOptionsBase = typeOptionsBase;
        this.typeOptions = typeOptions;
        this.parentTypeMetadata = parentTypeMetadata;

        this.deriveParentTypeMetadataProperties();
        this.configureDiscriminant(this.discriminant);
        this.configurePropertyMetadataMap(this.propertyOptionsMap);
        this.configureInjectMetadataMap(this.injectOptionsMap);

        return;
    }

    /**
     * Gets alias.
     * 
     * @returns {Alias|undefined} Alias or undefined.
     */
    public get alias(): Alias | undefined
    {
        return this.typeOptions.alias;
    }

    /**
     * Gets custom data.
     * 
     * @returns {CustomData} Custom data.
     */
    public get customData(): CustomData
    {
        const customData = {};
        const typeBaseCustomData = this.typeOptionsBase.customData;
        const typeCustomData = this.typeOptions.customData;
        
        if (!isNil(typeBaseCustomData))
        {
            merge(customData, typeBaseCustomData);
        }

        if (!isNil(typeCustomData))
        {
            merge(customData, typeCustomData);
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
            const serializedDefaultValue = this.typeOptions.defaultValue ?? this.typeOptions.serializedDefaultValue;

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
            const deserializedDefaultValue = this.typeOptions.defaultValue ?? this.typeOptions.deserializedDefaultValue;

            return isFunction(deserializedDefaultValue) ? deserializedDefaultValue() : deserializedDefaultValue;
        }

        return undefined;
    }

    /**
     * Gets discriminant.
     * 
     * @returns {Discriminant} Discriminant.
     */
    public get discriminant(): Discriminant
    {
        return this.typeOptions.discriminant ?? this.typeName;
    }

    /**
     * Gets discriminator.
     * 
     * @returns {Discriminator} Discriminator.
     */
    public get discriminator(): Discriminator
    {
        return this.typeOptions.discriminator ?? this.typeOptionsBase.discriminator;
    }

    /**
     * Gets factory.
     * 
     * @returns {Factory} Factory.
     */
    public get factory(): Factory
    {
        return this.typeOptions.factory ?? this.typeOptionsBase.factory;
    }

    /**
     * Gets generic arguments.
     * 
     * @returns {Array<GenericArgument<any>>|undefined} Generic arguments or undefined.
     */
    public get genericArguments(): Array<GenericArgument<any>> | undefined
    {
        return this.typeOptions.genericArguments;
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
     * Gets injectable value.
     * 
     * @returns {boolean|undefined} Injectable indicator or undefined.
     */
    public get injectable(): boolean | undefined
    {
        return this.typeOptions.injectable;
    }

    /**
     * Gets injector.
     * 
     * @returns {Injector} Injector.
     */
    public get injector(): Injector
    {
        return this.typeOptions.injector ?? this.typeOptionsBase.injector;
    }

    /**
     * Gets log.
     * 
     * @returns {Log} Log instance.
     */
    public get log(): Log
    {
        return this.typeOptions.log ?? this.typeOptionsBase.log;
    }

    /**
     * Gets naming convention.
     * 
     * @returns {NamingConvention|undefined} Naming convention or undefined.
     */
    public get namingConvention(): NamingConvention | undefined
    {
        return this.typeOptions.namingConvention ?? this.typeOptionsBase.namingConvention;
    }

    /**
     * Gets indicator if current type metadata is polymorphic.
     * 
     * @returns {boolean} True when type metadata is polymorphic. False otherwise.
     */
    public get polymorphic(): boolean
    {
        return this.discriminantMap.size > 1;
    }

    /**
     * Gets indicator if discriminator should be preserved.
     * 
     * @returns {boolean} True when discriminator should be preserved. False otherwise.
     */
    public get preserveDiscriminator(): boolean 
    {
        return this.typeOptions.preserveDiscriminator ?? this.typeOptionsBase.preserveDiscriminator;
    }

    /**
     * Gets reference handler.
     * 
     * @returns {ReferenceHandler} Reference handler.
     */
    public get referenceHandler(): ReferenceHandler
    {
        return this.typeOptions.referenceHandler ?? this.typeOptionsBase.referenceHandler;
    }

    /**
     * Gets serializer.
     * 
     * @returns {Serializer<TType>} Serializer.
     */
    public get serializer(): Serializer<TType>
    {
        return this.typeOptions.serializer ?? this.typeOptionsBase.serializer;
    }

    /**
     * Gets indicator if null value should be preserved.
     * 
     * @returns {boolean} True when null value should be preserved. False otherwise.
     */
    public get preserveNull(): boolean
    {
        return this.typeOptions.preserveNull ?? this.typeOptionsBase.preserveNull;
    }

    /**
     * Gets indicator if default value should be used.
     * 
     * @returns {boolean} True when type should use default value. False otherwise.
     */
    public get useDefaultValue(): boolean
    {
        return this.typeOptions.useDefaultValue ?? this.typeOptionsBase.useDefaultValue;
    }

    /**
     * Gets indicator if implicit conversion should be used.
     * 
     * @returns {boolean} True when type should use implicit conversion. False otherwise.
     */
    public get useImplicitConversion(): boolean
    {
        return this.typeOptions.useImplicitConversion ?? this.typeOptionsBase.useImplicitConversion;
    }

    /**
     * Gets property options map.
     * 
     * @returns {Map<PropertyName, PropertyOptions<any>>} Property options map.
     */
    public get propertyOptionsMap(): Map<PropertyName, PropertyOptions<any>>
    {
        let propertyOptionsMap = this.typeOptions.propertyOptionsMap;

        if (isNil(propertyOptionsMap))
        {
            propertyOptionsMap = new Map<PropertyName, PropertyOptions<any>>();

            this.typeOptions.propertyOptionsMap = propertyOptionsMap;
        }

        return propertyOptionsMap;
    }

    /**
     * Gets inject options map.
     * 
     * @returns {Map<InjectIndex, InjectOptions<any>>} Inject options map.
     */
    public get injectOptionsMap(): Map<InjectIndex, InjectOptions<any>>
    {
        let injectOptionsMap = this.typeOptions.injectOptionsMap;

        if (isNil(injectOptionsMap))
        {
            injectOptionsMap = new Map<InjectIndex, InjectOptions<any>>();

            this.typeOptions.injectOptionsMap = injectOptionsMap;
        }

        return injectOptionsMap;
    }

    /**
     * Derives parent type metadata properties.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    private deriveParentTypeMetadataProperties(): TypeMetadata<TType>
    {
        if (isNil(this.parentTypeMetadata)) 
        {
            return this;
        }

        for (const [propertyName, propertyMetadata] of this.parentTypeMetadata.propertyMetadataMap)
        {
            this.propertyMetadataMap.set(propertyName, propertyMetadata);
        }

        this.parentTypeMetadata.childrenTypeMetadataMap.set(this.typeFn, this);

        return this;
    }

    /**
     * Reflects inject metadata.
     * 
     * Used to configure inject metadata based on reflect metadata as inject decorators may be omitted.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    public reflectInjectMetadata(): TypeMetadata<TType>
    {
        if (this.typeFn.length === 0)
        {
            return this;
        }

        const injectTypeFns = (getOwnReflectMetadata('design:paramtypes', this.typeFn) ?? new Array<TypeFn<any>>()) as Array<TypeFn<any>>;

        for (let injectIndex = 0; injectIndex < injectTypeFns.length; injectIndex++)
        {
            if (!this.injectMetadataMap.has(injectIndex))
            {
                this.configureInjectMetadata(injectIndex, { typeFn: injectTypeFns[injectIndex] });
            }
        }

        return this;
    }

    /**
     * Configures alias.
     * 
     * @param {Alias} alias Alias.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    public configureAlias(alias: Alias): TypeMetadata<TType>
    {
        this.releaseAlias();

        this.typeOptions.alias = alias;

        this.typeFnMap.set(alias, this.typeFn);

        return this;
    }

    /**
     * Releases alias.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata. 
     */
    private releaseAlias(): TypeMetadata<TType>
    {
        const alias = this.alias;

        if (!isNil(alias) && this.typeFnMap.has(alias))
        {
            this.typeFnMap.delete(alias);
        }

        return this;
    }

    /**
     * Configures custom data.
     * 
     * @param {CustomData} customData Custom data.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    public configureCustomData(customData: CustomData): TypeMetadata<TType>
    {
        this.typeOptions.customData = merge(this.typeOptions.customData ?? {}, customData);

        return this;
    }

    /**
     * Configures default value.
     * 
     * @param {DefaultValue} defaultValue Default value.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    public configureDefaultValue(defaultValue: DefaultValue): TypeMetadata<TType>
    {
        this.typeOptions.defaultValue = defaultValue;

        return this;
    }

    /**
     * Configures serialized default value.
     * 
     * @param {DefaultValue} serializedDefaultValue Serialized default value.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    public configureSerializedDefaultValue(serializedDefaultValue: DefaultValue): TypeMetadata<TType>
    {
        this.typeOptions.serializedDefaultValue = serializedDefaultValue;

        return this;
    }

    /**
     * Configures deserialized default value.
     * 
     * @param {DefaultValue} deserializedDefaultValue Deserialized default value.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    public configureDeserializedDefaultValue(deserializedDefaultValue: DefaultValue): TypeMetadata<TType>
    {
        this.typeOptions.deserializedDefaultValue = deserializedDefaultValue;

        return this;
    }

    /**
     * Configures discriminator.
     * 
     * @param {Discriminator} discriminator Discriminator.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    public configureDiscriminator(discriminator: Discriminator): TypeMetadata<TType>
    {
        this.typeOptions.discriminator = discriminator;

        return this;
    }

    /**
     * Configures discriminant.
     * 
     * @param {Discriminant} discriminant Discriminant.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    public configureDiscriminant(discriminant: Discriminant): TypeMetadata<TType>
    {
        this.typeOptions.discriminant = discriminant;

        this.provideDiscriminant(this.typeFn, discriminant);

        return this;
    }

    /**
     * Provides discriminant.
     * 
     * @param {TypeFn<any>} typeFn Type function.
     * @param {Discriminant} discriminant Discriminant.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    private provideDiscriminant(typeFn: TypeFn<any>, discriminant: Discriminant): TypeMetadata<TType>
    {
        this.discriminantMap.set(typeFn, discriminant);

        if (!isNil(this.parentTypeMetadata))
        {
            this.parentTypeMetadata.provideDiscriminant(typeFn, discriminant);
        }

        return this;
    }

    /**
     * Configures factory.
     * 
     * @param {Factory} factory Factory.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    public configureFactory(factory: Factory): TypeMetadata<TType>
    {
        this.typeOptions.factory = factory;

        return this;
    }

    /**
     * Configures generic arguments.
     * 
     * @param {Array<GenericArgument<any>>|undefined} genericArguments Generic arguments.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    public configureGenericArguments(genericArguments: Array<GenericArgument<any>> | undefined): TypeMetadata<TType>
    {
        this.typeOptions.genericArguments = genericArguments;

        return this;
    }

    /**
     * Configures injectable.
     * 
     * @param {boolean} injectable Injectable.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    public configureInjectable(injectable: boolean): TypeMetadata<TType>
    {
        this.typeOptions.injectable = injectable;

        return this;
    }

    /**
     * Configures injector.
     * 
     * @param {Injector} injector Injector.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    public configureInjector(injector: Injector): TypeMetadata<TType>
    {
        this.typeOptions.injector = injector;

        return this;
    }

    /**
     * Configures log.
     * 
     * @param {Log} log Log.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    public configureLog(log: Log): TypeMetadata<TType>
    {
        this.typeOptions.log = log;

        return this;
    }

    /**
     * Configures naming convention.
     * 
     * @param {NamingConvention} namingConvention Naming convention.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    public configureNamingConvention(namingConvention: NamingConvention): TypeMetadata<TType>
    {
        this.typeOptions.namingConvention = namingConvention;

        return this;
    }

    /**
     * Configures preserve discriminator.
     * 
     * @param {boolean} preserveDiscriminator Preserve discriminator.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    public configurePreserveDiscriminator(preserveDiscriminator: boolean): TypeMetadata<TType>
    {
        this.typeOptions.preserveDiscriminator = preserveDiscriminator;

        return this;
    }

    /**
     * Configures reference handler.
     * 
     * @param {ReferenceHandler} referenceHandler Reference handler.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    public configureReferenceHandler(referenceHandler: ReferenceHandler): TypeMetadata<TType>
    {
        this.typeOptions.referenceHandler = referenceHandler;

        return this;
    }

    /**
     * Configures serializer.
     * 
     * @param {Serializer<TType>} serializer Serializer.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    public configureSerializer(serializer: Serializer<TType>): TypeMetadata<TType>
    {
        this.typeOptions.serializer = serializer;

        return this;
    }

    /**
     * Configures preserve null.
     * 
     * @param {boolean} preserveNull Preserve null.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    public configurePreserveNull(preserveNull: boolean): TypeMetadata<TType>
    {
        this.typeOptions.preserveNull = preserveNull;

        return this;
    }

    /**
     * Configures use default value.
     * 
     * @param {boolean} useDefaultValue Use default value.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    public configureUseDefaultValue(useDefaultValue: boolean): TypeMetadata<TType>
    {
        this.typeOptions.useDefaultValue = useDefaultValue;

        return this;
    }

    /**
     * Configures use implicit convertion.
     * 
     * @param {boolean} useImplicitConversion Use implicit convertion.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    public configureUseImplicitConversion(useImplicitConversion: boolean): TypeMetadata<TType>
    {
        this.typeOptions.useImplicitConversion = useImplicitConversion;

        return this;
    }

    /**
     * Configures certain property metadata.
     * 
     * @param {PropertyName} propertyName Property name. 
     * @param {PropertyOptions<TPropertyType>} propertyOptions Property options.
     * 
     * @returns {PropertyMetadata<TType, TPropertyType>} Configured property metadata.
     */
    public configurePropertyMetadata<TPropertyType>(propertyName: PropertyName, propertyOptions: PropertyOptions<TPropertyType>): PropertyMetadata<TType, TPropertyType>
    {
        let propertyMetadata = this.propertyMetadataMap.get(propertyName);

        if (isNil(propertyMetadata))
        {
            propertyMetadata = new PropertyMetadata(this, propertyName, propertyOptions);

            this.propertyMetadataMap.set(propertyName, propertyMetadata);
            this.propertyOptionsMap.set(propertyName, propertyOptions);

            return propertyMetadata;
        }

        return propertyMetadata.configure(propertyOptions);
    }

    /**
     * Configures certain inject metadata.
     * 
     * @param {InjectIndex} injectIndex Inject index. 
     * @param {InjectOptions<TInjectType>} injectOptions Inject options.
     * 
     * @returns {InjectMetadata<TType, TInjectType>} Configured inject metadata.
     */
    public configureInjectMetadata<TInjectType>(injectIndex: InjectIndex, injectOptions: InjectOptions<TInjectType>): InjectMetadata<TType, TInjectType>
    {
        let injectMetadata = this.injectMetadataMap.get(injectIndex);

        if (isNil(injectMetadata))
        {
            injectMetadata = new InjectMetadata(this, injectIndex, injectOptions);

            this.injectMetadataMap.set(injectIndex, injectMetadata);
            this.injectOptionsMap.set(injectIndex, injectOptions);
            
            return injectMetadata;
        }

        return injectMetadata.configure(injectOptions);
    }

    /**
     * Configures property metadata map.
     * 
     * @param {Map<PropertyName, PropertyOptions<TPropertyType>>} propertyOptionsMap Property options map.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    public configurePropertyMetadataMap<TPropertyType>(propertyOptionsMap: Map<PropertyName, PropertyOptions<TPropertyType>>): TypeMetadata<TType>
    {
        for (const [propertyName, propertyOptions] of propertyOptionsMap)
        {
            this.configurePropertyMetadata(propertyName, propertyOptions);
        }

        return this;
    }

    /**
     * Configures inject metadata map.
     * 
     * @param {Map<InjectIndex, InjectOptions<TInjectType>>} injectOptionsMap Inject options map.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    public configureInjectMetadataMap<TInjectType>(injectOptionsMap: Map<InjectIndex, InjectOptions<TInjectType>>): TypeMetadata<TType>
    {
        for (const [injectIndex, injectOptions] of injectOptionsMap)
        {
            this.configureInjectMetadata(injectIndex, injectOptions);
        }

        return this;
    }

    /**
     * Configures type metadata based on provided options.
     * 
     * @param {TypeOptions<TType>} typeOptions Type options.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    public configure(typeOptions: TypeOptions<TType>): TypeMetadata<TType>
    {
        if (!isUndefined(typeOptions.alias)) 
        {
            this.configureAlias(typeOptions.alias);
        }

        if (!isUndefined(typeOptions.customData))
        {
            this.configureCustomData(typeOptions.customData);
        }

        if (!isUndefined(typeOptions.defaultValue))
        {
            this.configureDefaultValue(typeOptions.defaultValue);
        }

        if (!isUndefined(typeOptions.serializedDefaultValue))
        {
            this.configureSerializedDefaultValue(typeOptions.serializedDefaultValue);
        }

        if (!isUndefined(typeOptions.deserializedDefaultValue)) 
        {
            this.configureDeserializedDefaultValue(typeOptions.deserializedDefaultValue);
        }

        if (!isUndefined(typeOptions.discriminator)) 
        {
            this.configureDiscriminator(typeOptions.discriminator);
        }

        if (!isUndefined(typeOptions.discriminant))
        {
            this.configureDiscriminant(typeOptions.discriminant);
        }

        if (!isUndefined(typeOptions.factory)) 
        {
            this.configureFactory(typeOptions.factory);
        }

        if (!isUndefined(typeOptions.genericArguments)) 
        {
            this.configureGenericArguments(typeOptions.genericArguments);
        }

        if (!isUndefined(typeOptions.injectable))
        {
            this.configureInjectable(typeOptions.injectable);
        }

        if (!isUndefined(typeOptions.injector))
        {
            this.configureInjector(typeOptions.injector);
        }

        if (!isUndefined(typeOptions.log))
        {
            this.configureLog(typeOptions.log);
        }

        if (!isUndefined(typeOptions.namingConvention))
        {
            this.configureNamingConvention(typeOptions.namingConvention);
        }

        if (!isUndefined(typeOptions.preserveDiscriminator))
        {
            this.configurePreserveDiscriminator(typeOptions.preserveDiscriminator);
        }

        if (!isUndefined(typeOptions.referenceHandler))
        {
            this.configureReferenceHandler(typeOptions.referenceHandler);
        }

        if (!isUndefined(typeOptions.serializer))
        {
            this.configureSerializer(typeOptions.serializer);
        }

        if (!isUndefined(typeOptions.preserveNull))
        {
            this.configurePreserveNull(typeOptions.preserveNull);
        }

        if (!isUndefined(typeOptions.useDefaultValue)) 
        {
            this.configureUseDefaultValue(typeOptions.useDefaultValue);
        }

        if (!isUndefined(typeOptions.useImplicitConversion)) 
        {
            this.configureUseImplicitConversion(typeOptions.useImplicitConversion);
        }

        if (!isUndefined(typeOptions.propertyOptionsMap))
        {
            this.configurePropertyMetadataMap(typeOptions.propertyOptionsMap);
        }

        if (!isUndefined(typeOptions.injectOptionsMap))
        {
            this.configureInjectMetadataMap(typeOptions.injectOptionsMap);
        }

        return this;
    }
}
