import { first, isEmpty, isFunction, isNil, isUndefined } from 'lodash';
import { Alias } from './alias';
import { CustomContext } from './custom-context';
import { CustomKey } from './custom-key';
import { CustomOption } from './custom-option';
import { DefaultValue } from './default-value';
import { Discriminant } from './discriminant';
import { Discriminator } from './discriminator';
import { Factory } from './factory';
import { getOwnReflectMetadata } from './functions/get-own-reflect-metadata';
import { nameOf } from './functions/name-of';
import { InjectIndex } from './inject-index';
import { InjectMetadata } from './inject-metadata';
import { InjectOptions } from './inject-options';
import { InjectSorter } from './inject-sorter';
import { Injector } from './injector';
import { Log } from './log';
import { Metadata } from './metadata';
import { NamingConvention } from './naming-convention';
import { PropertyMetadata } from './property-metadata';
import { PropertyName } from './property-name';
import { PropertyOptions } from './property-options';
import { PropertySorter } from './property-sorter';
import { ReferenceHandler } from './reference-handler';
import { Serializer } from './serializer';
import { TypeExtensionMetadata } from './type-extension-metadata';
import { TypeExtensionMetadataCtor } from './type-extension-metadata-ctor';
import { typeExtensionMetadataCtorSetKey } from './type-extension-metadata-ctor-set-key';
import { TypeExtensionOptions } from './type-extension-options';
import { TypeFn } from './type-fn';
import { TypeInternals } from './type-internals';
import { TypeManager } from './type-manager';
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
     * Type internals.
     * 
     * @type {TypeInternals}
     */
    public readonly typeInternals: TypeInternals;

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
     * Parent type metadatas.
     * 
     * @type {Array<TypeMetadata<any>>}
     */
    public readonly parentTypeMetadatas: Array<TypeMetadata<any>>;

    /**
     * Constructor.
     * 
     * @param {TypeManager} typeManager Type manager.
     * @param {TypeFn<any>} typeFn Type function.
     * @param {TypeOptions<TType>} typeOptions Type options.
     * @param {Array<TypeMetadata<any>>} parentTypeMetadatas Parent type metadatas.
     */
    public constructor(
        typeManager: TypeManager,
        typeFn: TypeFn<TType>,
        typeOptions: TypeOptions<TType>,
        parentTypeMetadatas: Array<TypeMetadata<any>>
    )
    {
        super(typeManager);

        this.typeName = nameOf(typeFn);
        this.typeFn = typeFn;
        this.typeOptionsBase = typeManager.typeOptionsBase;
        this.typeOptions = this.constructTypeOptions(typeOptions);
        this.typeInternals = this.constructTypeInternals();
        this.parentTypeMetadatas = parentTypeMetadatas;

        this.deriveParentTypeMetadataProperties();
        this.hasDiscriminant(this.discriminant);
        this.configure(typeOptions);

        return;
    }

    /**
     * Parent type metadata.
     * 
     * @type {TypeMetadata<any>}
     */
    public get parentTypeMetadata(): TypeMetadata<any> | undefined
    {
        return first(this.parentTypeMetadatas);
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
     * Gets custom options.
     * 
     * @returns {Array<CustomOption>} Custom options.
     */
    public get customOptions(): Array<CustomOption> | undefined
    {
        return this.typeOptions.customOptions;
    }
    
    /**
     * Gets custom context.
     * 
     * @returns {CustomContext} Custom context.
     */
    public get customContext(): CustomContext
    {
        let customContext = this.typeInternals.customContext;

        if (isNil(customContext))
        {
            this.typeOptions.customOptions = new Array<CustomOption>();
            this.typeInternals.customContext = new CustomContext(this.typeOptions.customOptions);

            customContext = this.typeInternals.customContext;
        }

        return customContext;
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
            const serializedDefaultValue = this.typeOptions.defaultValue 
                ?? this.typeOptions.serializedDefaultValue;

            const defaultValue = isFunction(serializedDefaultValue) 
                ? serializedDefaultValue() 
                : serializedDefaultValue;

            return defaultValue;
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
            const deserializedDefaultValue = this.typeOptions.defaultValue 
                ?? this.typeOptions.deserializedDefaultValue;

            const defaultValue = isFunction(deserializedDefaultValue) 
                ? deserializedDefaultValue() 
                : deserializedDefaultValue;

            return defaultValue;
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
     * Gets property sorter.
     * 
     * @returns {PropertySorter|undefined} Property sorter or undefined.
     */
    public get propertySorter(): PropertySorter | undefined
    {
        return this.typeOptions.propertySorter ?? this.typeOptionsBase.propertySorter;
    }

    /**
     * Gets sorted property metadatas.
     * 
     * @returns {IterableIterator<PropertyMetadata<TType, any>>} Iterable of property metadatas.
     */
    public get sortedPropertyMetadatas(): IterableIterator<PropertyMetadata<TType, any>>
    {
        const propertySorter = this.propertySorter;
        const propertyMetadatas = this.propertyMetadataMap.values();

        if (isNil(propertySorter))
        {
            return propertyMetadatas;
        }

        const sortedPropertyMetadatas = Array.from(propertyMetadatas).sort(propertySorter.sort);

        return sortedPropertyMetadatas[Symbol.iterator]();
    }

    /**
     * Gets inject sorter.
     * 
     * @returns {InjectSorter|undefined} Property sorter or undefined.
     */
    public get injectSorter(): InjectSorter | undefined
    {
        return this.typeOptions.injectSorter ?? this.typeOptionsBase.injectSorter;
    }

    /**
     * Gets sorted inject metadatas.
     * 
     * @returns {IterableIterator<InjectMetadata<TType, any>>} Iterable of inject metadatas.
     */
    public get sortedInjectMetadatas(): IterableIterator<InjectMetadata<TType, any>>
    {
        const injectSorter = this.injectSorter;
        const injectMetadatas = this.injectMetadataMap.values();

        if (isNil(injectSorter))
        {
            return injectMetadatas;
        }
        
        const sortedInjectMetadatas = Array.from(injectMetadatas).sort(injectSorter.sort);
        
        return sortedInjectMetadatas[Symbol.iterator]();
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
     * Gets parent type fns value.
     * 
     * @returns {Array<TypeFn<any>>|undefined} Parent type fns or undefined.
     */
    public get parentTypeFns(): Array<TypeFn<any>> | undefined
    {
        return this.typeOptions.parentTypeFns;
    }

    /**
     * Constructs initial type options by extending passed options 
     * with default values if they are not overriden. All references are kept.
     * 
     * @param {TypeOptions<TType>} typeOptions Type options.
     * 
     * @returns {TypeOptions<TType>} Constructed type options.
     */
    private constructTypeOptions(typeOptions: TypeOptions<TType>): TypeOptions<TType>
    {
        return typeOptions;
    }

    /**
     * Constructs type internals.
     * 
     * @returns {TypeInternals} Constructed type internals.
     */
    private constructTypeInternals(): TypeInternals
    {
        const customOptions = this.typeOptions.customOptions;
        const customContext = isNil(customOptions) ? undefined : new CustomContext(customOptions);
        const typeInternals = { customContext: customContext };

        return typeInternals;
    }

    /**
     * Derives parent type metadata properties.
     * 
     * @returns {this} Current instance of type metadata.
     */
    private deriveParentTypeMetadataProperties(): this
    {
        if (isEmpty(this.parentTypeMetadatas)) 
        {
            return this;
        }

        for (const parentTypeMetadata of this.parentTypeMetadatas)
        {
            for (const [propertyName, propertyMetadata] of parentTypeMetadata.propertyMetadataMap)
            {
                if (!this.propertyMetadataMap.has(propertyName))
                {
                    this.propertyMetadataMap.set(propertyName, propertyMetadata);
                }
            }

            parentTypeMetadata.childrenTypeMetadataMap.set(this.typeFn, this);
        }

        return this;
    }

    /**
     * Reflects inject metadata.
     * 
     * Used to configure inject metadata based on reflect metadata as inject decorators may be omitted.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public reflectInjectMetadata(): this
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
     * @param {Alias|undefined} alias Alias.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasAlias(alias: Alias | undefined): this
    {
        this.releaseAlias();

        this.typeOptions.alias = alias;

        if (!isNil(alias)) 
        {
            this.typeFnMap.set(alias, this.typeFn);
        }

        return this;
    }

    /**
     * Releases alias.
     * 
     * @returns {this} Current instance of type metadata. 
     */
    private releaseAlias(): this
    {
        const alias = this.alias;

        if (!isNil(alias) && this.typeFnMap.has(alias))
        {
            this.typeFnMap.delete(alias);
        }

        return this;
    }

    /**
     * Configures custom option.
     * 
     * @param {CustomKey<TCustomValue>} customKey Custom key.
     * @param {TCustomValue} customValue Custom value.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasCustomOption<TCustomValue>(customKey: CustomKey<TCustomValue>, customValue: TCustomValue): this
    {
        this.customContext.set(customKey, customValue);

        return this;
    }
    
    /**
     * Extracts custom option.
     * 
     * @param {CustomKey<TCustomValue>} customKey Custom key.
     * 
     * @returns {TCustomValue} Custom value.
     */
    public extractCustomOption<TCustomValue>(customKey: CustomKey<TCustomValue>): TCustomValue
    {
        return this.customContext.get(customKey);
    }

    /**
     * Configures custom options.
     * 
     * @param {Array<CustomOption>|undefined} customOptions Custom options.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasCustomOptions(customOptions: Array<CustomOption> | undefined): this
    {
        if (!isNil(customOptions))
        {
            this.customContext.configure(customOptions);
        }

        return this;
    }

    /**
     * Configures default value.
     * 
     * @param {DefaultValue} defaultValue Default value.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasDefaultValue(defaultValue: DefaultValue): this
    {
        this.typeOptions.defaultValue = defaultValue;

        return this;
    }

    /**
     * Configures serialized default value.
     * 
     * @param {DefaultValue} serializedDefaultValue Serialized default value.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasSerializedDefaultValue(serializedDefaultValue: DefaultValue): this
    {
        this.typeOptions.serializedDefaultValue = serializedDefaultValue;

        return this;
    }

    /**
     * Configures deserialized default value.
     * 
     * @param {DefaultValue} deserializedDefaultValue Deserialized default value.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasDeserializedDefaultValue(deserializedDefaultValue: DefaultValue): this
    {
        this.typeOptions.deserializedDefaultValue = deserializedDefaultValue;

        return this;
    }

    /**
     * Configures discriminator.
     * 
     * @param {Discriminator|undefined} discriminator Discriminator.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasDiscriminator(discriminator: Discriminator | undefined): this
    {
        this.typeOptions.discriminator = discriminator;

        return this;
    }
    
    /**
     * Configures discriminant.
     * 
     * @param {Discriminant|undefined} discriminant Discriminant.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasDiscriminant(discriminant: Discriminant | undefined): this
    {
        this.typeOptions.discriminant = discriminant;

        if (!isNil(discriminant)) 
        {
            this.provideDiscriminant(this.typeFn, discriminant);
        }

        return this;
    }

    /**
     * Provides discriminant.
     * 
     * @param {TypeFn<any>} typeFn Type function.
     * @param {Discriminant} discriminant Discriminant.
     * 
     * @returns {this} Current instance of type metadata.
     */
    private provideDiscriminant(typeFn: TypeFn<any>, discriminant: Discriminant): this
    {
        this.discriminantMap.set(typeFn, discriminant);

        if (!isEmpty(this.parentTypeMetadatas))
        {
            for (const parentTypeMetadata of this.parentTypeMetadatas)
            {
                parentTypeMetadata.provideDiscriminant(typeFn, discriminant);
            }
        }

        return this;
    }

    /**
     * Configures factory.
     * 
     * @param {Factory|undefined} factory Factory.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasFactory(factory: Factory | undefined): this
    {
        this.typeOptions.factory = factory;

        return this;
    }

    /**
     * Configures injectable.
     * 
     * @param {boolean} injectable Injectable.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public isInjectable(injectable: boolean = true): this
    {
        this.typeOptions.injectable = injectable;

        return this;
    }

    /**
     * Configures injector.
     * 
     * @param {Injector|undefined} injector Injector.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasInjector(injector: Injector | undefined): this
    {
        this.typeOptions.injector = injector;

        return this;
    }

    /**
     * Configures log.
     * 
     * @param {Log|undefined} log Log.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasLog(log: Log | undefined): this
    {
        this.typeOptions.log = log;

        return this;
    }

    /**
     * Configures naming convention.
     * 
     * @param {NamingConvention|undefined} namingConvention Naming convention.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasNamingConvention(namingConvention: NamingConvention | undefined): this
    {
        this.typeOptions.namingConvention = namingConvention;

        return this;
    }

    /**
     * Configures preserve discriminator.
     * 
     * @param {boolean} preserveDiscriminator Preserve discriminator.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public shouldPreserveDiscriminator(preserveDiscriminator: boolean = true): this
    {
        this.typeOptions.preserveDiscriminator = preserveDiscriminator;

        return this;
    }

    /**
     * Configures reference handler.
     * 
     * @param {ReferenceHandler|undefined} referenceHandler Reference handler.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasReferenceHandler(referenceHandler: ReferenceHandler | undefined): this
    {
        this.typeOptions.referenceHandler = referenceHandler;

        return this;
    }

    /**
     * Configures serializer.
     * 
     * @param {Serializer<TType>|undefined} serializer Serializer.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasSerializer(serializer: Serializer<TType> | undefined): this
    {
        this.typeOptions.serializer = serializer;

        return this;
    }

    /**
     * Configures preserve null.
     * 
     * @param {boolean} preserveNull Preserve null.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public shouldPreserveNull(preserveNull: boolean = true): this
    {
        this.typeOptions.preserveNull = preserveNull;

        return this;
    }

    /**
     * Configures use default value.
     * 
     * @param {boolean} useDefaultValue Use default value.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public shouldUseDefaultValue(useDefaultValue: boolean = true): this
    {
        this.typeOptions.useDefaultValue = useDefaultValue;

        return this;
    }

    /**
     * Configures use implicit convertion.
     * 
     * @param {boolean} useImplicitConversion Use implicit convertion.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public shouldUseImplicitConversion(useImplicitConversion: boolean = true): this
    {
        this.typeOptions.useImplicitConversion = useImplicitConversion;

        return this;
    }

    /**
     * Configures property sorter.
     * 
     * @param {PropertySorter|undefined} propertySorter Property sorter.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasPropertySorter(propertySorter: PropertySorter | undefined): this
    {
        this.typeOptions.propertySorter = propertySorter;

        return this;
    }

    /**
     * Configures inject sorter.
     * 
     * @param {InjectSorter|undefined} injectSorter Inject sorter.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasInjectSorter(injectSorter: InjectSorter | undefined): this
    {
        this.typeOptions.injectSorter = injectSorter;

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
    public configurePropertyMetadata<TPropertyType>(propertyName: PropertyName, propertyOptions?: PropertyOptions<TPropertyType>): PropertyMetadata<TType, TPropertyType>
    {
        let propertyMetadata = this.propertyMetadataMap.get(propertyName);

        if (isNil(propertyMetadata))
        {
            propertyMetadata = new PropertyMetadata(this, propertyName, propertyOptions ?? {});

            this.propertyMetadataMap.set(propertyName, propertyMetadata);
            this.propertyOptionsMap.set(propertyName, propertyMetadata.propertyOptions);

            return propertyMetadata;
        }

        if (!isNil(propertyOptions))
        {
            propertyMetadata.configure(propertyOptions);
        }

        return propertyMetadata;
    }

    /**
     * Configures certain inject metadata.
     * 
     * @param {InjectIndex} injectIndex Inject index. 
     * @param {InjectOptions<TInjectType>} injectOptions Inject options.
     * 
     * @returns {InjectMetadata<TType, TInjectType>} Configured inject metadata.
     */
    public configureInjectMetadata<TInjectType>(injectIndex: InjectIndex, injectOptions?: InjectOptions<TInjectType>): InjectMetadata<TType, TInjectType>
    {
        let injectMetadata = this.injectMetadataMap.get(injectIndex);

        if (isNil(injectMetadata))
        {
            injectMetadata = new InjectMetadata(this, injectIndex, injectOptions ?? {});

            this.injectMetadataMap.set(injectIndex, injectMetadata);
            this.injectOptionsMap.set(injectIndex, injectMetadata.injectOptions);
            
            return injectMetadata;
        }
        
        if (!isNil(injectOptions))
        {
            injectMetadata.configure(injectOptions);
        }

        return injectMetadata;
    }

    /**
     * Configures property metadata map.
     * 
     * @param {Map<PropertyName, PropertyOptions<TPropertyType>>} propertyOptionsMap Property options map.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasPropertyMetadataMap<TPropertyType>(propertyOptionsMap: Map<PropertyName, PropertyOptions<TPropertyType>>): this
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
     * @returns {this} Current instance of type metadata.
     */
    public hasInjectMetadataMap<TInjectType>(injectOptionsMap: Map<InjectIndex, InjectOptions<TInjectType>>): this
    {
        for (const [injectIndex, injectOptions] of injectOptionsMap)
        {
            this.configureInjectMetadata(injectIndex, injectOptions);
        }

        return this;
    }

    /**
     * Configures type extension metadata.
     * 
     * @param {TypeExtensionMetadataCtor<TTypeExtensionMetadata, TTypeExtensionOptions, TType>} typeExtensionMetadataCtor Type extension metadata constructor.
     * @param {TTypeExtensionOptions} typeExtensionOptions Type extension options.
     * 
     * @returns {TTypeExtensionMetadata} Type extension metadata
     */
    public configureTypeExtensionMetadata<TTypeExtensionMetadata extends TypeExtensionMetadata<TType, TTypeExtensionOptions>, TTypeExtensionOptions extends TypeExtensionOptions>(
        typeExtensionMetadataCtor: TypeExtensionMetadataCtor<TTypeExtensionMetadata, TTypeExtensionOptions, TType>, 
        typeExtensionOptions?: TTypeExtensionOptions
    ): TTypeExtensionMetadata
    {
        const typeExtensionMetadataCtorSet = this.extractCustomOption(typeExtensionMetadataCtorSetKey);

        if (!typeExtensionMetadataCtorSet.has(typeExtensionMetadataCtor))
        {
            typeExtensionMetadataCtorSet.add(typeExtensionMetadataCtor);
        }

        const initialTypeExtensionOptions = typeExtensionOptions ?? {} as TTypeExtensionOptions;
        const typeExtensionMetadata = new typeExtensionMetadataCtor(this, initialTypeExtensionOptions);

        return typeExtensionMetadata;
    }
    
    /**
     * Extracts type extension metadata.
     * 
     * @param {TypeExtensionMetadataCtor<TTypeExtensionMetadata, TTypeExtensionOptions, TType>} typeExtensionMetadataCtor Type extension metadata constructor.
     * 
     * @returns {TTypeExtensionMetadata|undefined} Type extension metadata or undefined.
     */
    public extractTypeExtensionMetadata<TTypeExtensionMetadata extends TypeExtensionMetadata<TType, TTypeExtensionOptions>, TTypeExtensionOptions extends TypeExtensionOptions>(
        typeExtensionMetadataCtor: TypeExtensionMetadataCtor<TTypeExtensionMetadata, TTypeExtensionOptions, TType>
    ): TTypeExtensionMetadata | undefined
    {
        const typeExtensionMetadataCtorSet = this.extractCustomOption(typeExtensionMetadataCtorSetKey);

        if (!typeExtensionMetadataCtorSet.has(typeExtensionMetadataCtor)) 
        {
            return undefined;
        }
        
        const initialTypeExtensionOptions = {} as TTypeExtensionOptions;
        const typeExtensionMetadata = new typeExtensionMetadataCtor(this, initialTypeExtensionOptions);

        return typeExtensionMetadata;
    }

    /**
     * Configures parent type fns.
     * 
     * @param {Array<TypeFn<any>>} parentTypeFns Parent type fns.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasParentTypeFns(parentTypeFns: Array<TypeFn<any>>): this
    {
        if (isNil(this.typeOptions.parentTypeFns))
        {
            this.typeOptions.parentTypeFns = new Array<TypeFn<any>>();
        }

        for (const parentTypeFn of parentTypeFns) 
        {
            const parentTypeMetadata = this.typeManager.extractTypeMetadata(parentTypeFn);

            if (!this.parentTypeMetadatas.some(ptm => ptm === parentTypeMetadata))
            {
                this.parentTypeMetadatas.push(parentTypeMetadata);
            }

            if (!this.typeOptions.parentTypeFns.some(ptf => ptf === parentTypeFn))
            {
                this.typeOptions.parentTypeFns.push(parentTypeFn);
            }
        }
        
        this.deriveParentTypeMetadataProperties();
        this.hasDiscriminant(this.discriminant);

        return this;
    }

    /**
     * Configures type metadata based on provided options.
     * 
     * @param {TypeOptions<TType>} typeOptions Type options.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public configure(typeOptions: TypeOptions<TType>): this
    {
        if (!isUndefined(typeOptions.parentTypeFns))
        {
            this.hasParentTypeFns(typeOptions.parentTypeFns);
        }

        if (!isUndefined(typeOptions.alias)) 
        {
            this.hasAlias(typeOptions.alias);
        }

        if (!isUndefined(typeOptions.customOptions))
        {
            this.hasCustomOptions(typeOptions.customOptions);
        }

        if (!isUndefined(typeOptions.defaultValue))
        {
            this.hasDefaultValue(typeOptions.defaultValue);
        }

        if (!isUndefined(typeOptions.serializedDefaultValue))
        {
            this.hasSerializedDefaultValue(typeOptions.serializedDefaultValue);
        }

        if (!isUndefined(typeOptions.deserializedDefaultValue)) 
        {
            this.hasDeserializedDefaultValue(typeOptions.deserializedDefaultValue);
        }

        if (!isUndefined(typeOptions.discriminator)) 
        {
            this.hasDiscriminator(typeOptions.discriminator);
        }

        if (!isUndefined(typeOptions.discriminant))
        {
            this.hasDiscriminant(typeOptions.discriminant);
        }

        if (!isUndefined(typeOptions.factory)) 
        {
            this.hasFactory(typeOptions.factory);
        }

        if (!isUndefined(typeOptions.injectable))
        {
            this.isInjectable(typeOptions.injectable);
        }

        if (!isUndefined(typeOptions.injector))
        {
            this.hasInjector(typeOptions.injector);
        }

        if (!isUndefined(typeOptions.log))
        {
            this.hasLog(typeOptions.log);
        }

        if (!isUndefined(typeOptions.namingConvention))
        {
            this.hasNamingConvention(typeOptions.namingConvention);
        }

        if (!isUndefined(typeOptions.preserveDiscriminator))
        {
            this.shouldPreserveDiscriminator(typeOptions.preserveDiscriminator);
        }

        if (!isUndefined(typeOptions.referenceHandler))
        {
            this.hasReferenceHandler(typeOptions.referenceHandler);
        }

        if (!isUndefined(typeOptions.serializer))
        {
            this.hasSerializer(typeOptions.serializer);
        }

        if (!isUndefined(typeOptions.preserveNull))
        {
            this.shouldPreserveNull(typeOptions.preserveNull);
        }

        if (!isUndefined(typeOptions.useDefaultValue)) 
        {
            this.shouldUseDefaultValue(typeOptions.useDefaultValue);
        }

        if (!isUndefined(typeOptions.useImplicitConversion)) 
        {
            this.shouldUseImplicitConversion(typeOptions.useImplicitConversion);
        }

        if (!isUndefined(typeOptions.propertyOptionsMap))
        {
            this.hasPropertyMetadataMap(typeOptions.propertyOptionsMap);
        }

        if (!isUndefined(typeOptions.injectOptionsMap))
        {
            this.hasInjectMetadataMap(typeOptions.injectOptionsMap);
        }

        if (!isUndefined(typeOptions.propertySorter))
        {
            this.hasPropertySorter(typeOptions.propertySorter);
        }

        if (!isUndefined(typeOptions.injectSorter))
        {
            this.hasInjectSorter(typeOptions.injectSorter);
        }

        return this;
    }
}
