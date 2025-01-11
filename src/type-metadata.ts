import { Alias } from './alias';
import { DEFAULT_VALUE_RESOLVER } from './constants/default-value-resolver';
import { EMPTY_ARRAY } from './constants/empty-array';
import { EMPTY_MAP } from './constants/empty-map';
import { NULL_VALUE_RESOLVER } from './constants/null-value-resolver';
import { CustomKey } from './custom-key';
import { CustomOption } from './custom-option';
import { CustomValue } from './custom-value';
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
import { Logger } from './logger';
import { Metadata } from './metadata';
import { NamingConvention } from './naming-convention';
import { Nullable } from './nullable';
import { Optional } from './optional';
import { PropertyMetadata } from './property-metadata';
import { PropertyName } from './property-name';
import { PropertyOptions } from './property-options';
import { PropertySorter } from './property-sorter';
import { ReferenceHandler } from './reference-handler';
import { Serializer } from './serializer';
import { TypeArgument } from './type-argument';
import { TypeExtensionMetadata } from './type-extension-metadata';
import { TypeExtensionMetadataCtor } from './type-extension-metadata-ctor';
import { TYPE_EXTENSION_METADATA_CTOR_SET_KEY } from './type-extension-metadata-ctor-set-key';
import { TypeExtensionOptions } from './type-extension-options';
import { TypeFn } from './type-fn';
import { TypeManager } from './type-manager';
import { TypeName } from './type-name';
import { TypeOptions } from './type-options';
import { TypeOptionsBase } from './type-options-base';
import { TypeState } from './type-state';
import { ResolvedTypeState } from './type-states/resolved-type-state';
import { UnresolvedTypeState } from './type-states/unresolved-type-state';

/**
 * Main class used to describe a certain type.
 * 
 * @type {TypeMetadata<TObject>}
 */
export class TypeMetadata<TObject> extends Metadata
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
     * @type {TypeFn<TObject>}
     */
    public readonly typeFn: TypeFn<TObject>;

    /**
     * Parent type metadata.
     * 
     * @type {Optional<TypeMetadata<any>>}
     */
    public readonly parentTypeMetadata: Optional<TypeMetadata<any>>;

    /**
     * Type options used as a fallback.
     * 
     * @type {TypeOptionsBase<TObject>}
     */
    private readonly typeOptionsBase: TypeOptionsBase<TObject>;

    /**
     * Type options.
     * 
     * @type {TypeOptions<TObject>}
     */
    private readonly typeOptions: TypeOptions<TObject>;

    /**
     * Type metadata set.
     * 
     * @type {ReadonlySet<TypeMetadata<any>>}
     */
    private readonly typeMetadataSet: ReadonlySet<TypeMetadata<any>>;

    /**
     * Current type function map.
     * 
     * @type {Map<Alias, TypeFn<any>>}
     */
    private readonly currentTypeFnMap: Map<Alias, TypeFn<any>>;

    /**
     * Current child type metadata map.
     * 
     * @type {Map<TypeFn<TObject>, TypeMetadata<any>>}
     */
    private readonly currentChildTypeMetadataMap: Map<TypeFn<any>, TypeMetadata<any>>;

    /**
     * Current property metadata map.
     * 
     * @type {Map<PropertyName, PropertyMetadata<TObject, any>>}
     */
    private readonly currentPropertyMetadataMap: Map<PropertyName, PropertyMetadata<TObject, any>>;
    
    /**
     * Current inject metadata map.
     * 
     * @type {Map<InjectIndex, InjectMetadata<TObject, any>>}
     */
    private readonly currentInjectMetadataMap: Map<InjectIndex, InjectMetadata<TObject, any>>;

    /**
     * Current type state.
     * 
     * @type {TypeState<TObject>}
     */
    private currentTypeState: TypeState<TObject>;

    /**
     * Constructor.
     * 
     * @param {TypeManager} typeManager Type manager.
     * @param {Map<Alias, TypeFn<any>>} typeFnMap Type function map for types with aliases.
     * @param {ReadonlySet<TypeMetadata<any>>} typeMetadataSet Type metadata set.
     * @param {TypeFn<any>} typeFn Type function.
     * @param {TypeOptions<TObject>} typeOptions Type options.
     * @param {Optional<TypeMetadata<any>>} parentTypeMetadata Parent type metadata.
     */
    public constructor(
        typeManager: TypeManager, 
        typeFnMap: Map<Alias, TypeFn<any>>,
        typeMetadataSet: ReadonlySet<TypeMetadata<any>>,
        typeFn: TypeFn<TObject>,
        typeOptions: TypeOptions<TObject>,
        parentTypeMetadata: Optional<TypeMetadata<any>>
    )
    {
        super(typeManager, typeFnMap);
        
        this.typeName = nameOf(typeFn);
        this.typeFn = typeFn;
        this.parentTypeMetadata = parentTypeMetadata;
        this.typeOptionsBase = typeManager.typeOptionsBase;
        this.typeOptions = this.constructTypeOptions(typeOptions);
        this.typeMetadataSet = typeMetadataSet;
        this.currentTypeFnMap = typeFnMap;
        this.currentChildTypeMetadataMap = new Map<TypeFn<any>, TypeMetadata<any>>();
        this.currentPropertyMetadataMap = new Map<PropertyName, PropertyMetadata<TObject, any>>();
        this.currentInjectMetadataMap = new Map<InjectIndex, InjectMetadata<TObject, any>>();
        this.currentTypeState = new UnresolvedTypeState<TObject>(this);

        this.extendParentTypeMetadata();
        this.configure(typeOptions);

        return;
    }
    
    /**
     * Gets type state.
     * 
     * @returns {TypeState<TObject>} Type state.
     */
    public get typeState(): TypeState<TObject>
    {
        return this.currentTypeState;
    }

    /**
     * Gets inject metadata map.
     * 
     * @returns {ReadonlyMap<InjectIndex, InjectMetadata<TObject, any>>}
     */
    public get injectMetadataMap(): ReadonlyMap<InjectIndex, InjectMetadata<TObject, any>>
    {
        return this.currentTypeState.injectMetadataMap;
    }

    /**
     * Gets property metadata map.
     * 
     * @returns {ReadonlyMap<PropertyName, PropertyMetadata<TObject, any>>}
     */
    public get propertyMetadataMap(): ReadonlyMap<PropertyName, PropertyMetadata<TObject, any>>
    {
        return this.currentTypeState.propertyMetadataMap;
    }

    /**
     * Gets alias.
     * 
     * @returns {Optional<Alias>} Alias or undefined.
     */
    public get alias(): Optional<Alias>
    {
        return this.currentTypeState.alias;
    }

    /**
     * Gets custom value map.
     * 
     * @returns {ReadonlyMap<CustomKey<any>, CustomValue>} Custom value map.
     */
    public get customValueMap(): ReadonlyMap<CustomKey<any>, CustomValue>
    {
        return this.currentTypeState.customValueMap;
    }

    /**
     * Gets serialized null value.
     * 
     * @returns {Nullable<any>} Resolved serialized null value.
     */
    public get serializedNullValue(): Nullable<any>
    {
        return this.currentTypeState.serializedNullValueResolver();
    }

    /**
     * Gets serialized default value.
     * 
     * @returns {Optional<any>} Resolved serialized default value.
     */
    public get serializedDefaultValue(): Optional<any>
    {
        return this.currentTypeState.serializedDefaultValueResolver();
    }

    /**
     * Gets deserialized null value.
     * 
     * @returns {Nullable<any>} Resolved deserialized null value.
     */
    public get deserializedNullValue(): Nullable<any>
    {
        return this.currentTypeState.deserializedNullValueResolver();
    }
    
    /**
     * Gets deserialized default value.
     * 
     * @returns {Optional<any>} Resolved deserialized default value.
     */
    public get deserializedDefaultValue(): Optional<any>
    {
        return this.currentTypeState.deserializedDefaultValueResolver();
    }
    
    /**
     * Gets discriminant.
     * 
     * @returns {Discriminant} Discriminant.
     */
    public get discriminant(): Discriminant
    {
        return this.currentTypeState.discriminant;
    }

    /**
     * Gets discriminator.
     * 
     * @returns {Discriminator} Discriminator.
     */
    public get discriminator(): Discriminator
    {
        return this.currentTypeState.discriminator;
    }

    /**
     * Gets factory.
     * 
     * @returns {Factory} Factory.
     */
    public get factory(): Factory
    {
        return this.currentTypeState.factory;
    }

    /**
     * Gets injectable value.
     * 
     * @returns {boolean} Injectable indicator.
     */
    public get injectable(): boolean
    {
        return this.currentTypeState.injectable;
    }

    /**
     * Gets injector.
     * 
     * @returns {Injector} Injector.
     */
    public get injector(): Injector
    {
        return this.currentTypeState.injector;
    }

    /**
     * Gets logger.
     * 
     * @returns {Logger} Logger instance.
     */
    public get logger(): Logger
    {
        return this.currentTypeState.logger;
    }

    /**
     * Gets naming convention.
     * 
     * @returns {Optional<NamingConvention>} Naming convention or undefined.
     */
    public get namingConvention(): Optional<NamingConvention>
    {
        return this.currentTypeState.namingConvention;
    }

    /**
     * Gets indicator if current type metadata is polymorphic.
     * 
     * @returns {boolean} True when type metadata is polymorphic. False otherwise.
     */
    public get polymorphic(): boolean
    {
        return this.currentTypeState.polymorphic;
    }

    /**
     * Gets indicator if discriminator should be preserved.
     * 
     * @returns {boolean} True when discriminator should be preserved. False otherwise.
     */
    public get preserveDiscriminator(): boolean 
    {
        return this.currentTypeState.preserveDiscriminator;
    }

    /**
     * Gets reference handler.
     * 
     * @returns {ReferenceHandler} Reference handler.
     */
    public get referenceHandler(): ReferenceHandler
    {
        return this.currentTypeState.referenceHandler;
    }

    /**
     * Gets serializer.
     * 
     * @returns {Serializer<TObject>} Serializer.
     */
    public get serializer(): Serializer<TObject>
    {
        return this.currentTypeState.serializer;
    }

    /**
     * Gets indicator if null value should be preserved.
     * 
     * @returns {boolean} True when null value should be preserved. False otherwise.
     */
    public get preserveNull(): boolean
    {
        return this.currentTypeState.preserveNull;
    }

    /**
     * Gets indicator if default value should be used.
     * 
     * @returns {boolean} True when type should use default value. False otherwise.
     */
    public get useDefaultValue(): boolean
    {
        return this.currentTypeState.useDefaultValue;
    }

    /**
     * Gets indicator if implicit conversion should be used.
     * 
     * @returns {boolean} True when type should use implicit conversion. False otherwise.
     */
    public get useImplicitConversion(): boolean
    {
        return this.currentTypeState.useImplicitConversion;
    }

    /**
     * Gets property sorter.
     * 
     * @returns {Optional<PropertySorter>} Property sorter or undefined.
     */
    public get propertySorter(): Optional<PropertySorter>
    {
        return this.currentTypeState.propertySorter;
    }

    /**
     * Gets sorted property metadatas.
     * 
     * @returns {ReadonlyArray<PropertyMetadata<TObject, any>>} Readonly array of property metadatas.
     */
    public get sortedPropertyMetadatas(): ReadonlyArray<PropertyMetadata<TObject, any>>
    {
        return this.currentTypeState.sortedPropertyMetadatas;
    }

    /**
     * Gets inject sorter.
     * 
     * @returns {Optional<InjectSorter>} Property sorter or undefined.
     */
    public get injectSorter(): Optional<InjectSorter>
    {
        return this.currentTypeState.injectSorter;
    }

    /**
     * Gets sorted inject metadatas.
     * 
     * @returns {ReadonlyArray<InjectMetadata<TObject, any>>} Iterable of inject metadatas.
     */
    public get sortedInjectMetadatas(): ReadonlyArray<InjectMetadata<TObject, any>>
    {
        return this.currentTypeState.sortedInjectMetadatas;
    }

    /**
     * Gets parent type arguments.
     * 
     * @returns {ReadonlyArray<TypeArgument<any>>} Parent arguments.
     */
    public get parentTypeArguments(): ReadonlyArray<TypeArgument<any>>
    {
        return this.currentTypeState.parentTypeArguments;
    }

    /**
     * Gets property options map.
     * 
     * @returns {ReadonlyMap<PropertyName, PropertyOptions<any>>} Property options map.
     */
    public get propertyOptionsMap(): ReadonlyMap<PropertyName, PropertyOptions<any>>
    {
        return this.currentTypeState.propertyOptionsMap;
    }

    /**
     * Gets inject options map.
     * 
     * @returns {ReadonlyMap<InjectIndex, InjectOptions<any>>} Inject options map.
     */
    public get injectOptionsMap(): ReadonlyMap<InjectIndex, InjectOptions<any>>
    {
        return this.currentTypeState.injectOptionsMap;
    }

    /**
     * Constructs initial type options by extending passed options 
     * with default values if they are not overriden. All references are kept.
     * 
     * @param {TypeOptions<TObject>} typeOptions Type options.
     * 
     * @returns {TypeOptions<TObject>} Constructed type options.
     */
    private constructTypeOptions(typeOptions: TypeOptions<TObject>): TypeOptions<TObject>
    {
        if (typeOptions.customValueMap === undefined)
        {
            typeOptions.customValueMap = new Map<CustomKey<any>, CustomValue>();
        }

        if (typeOptions.propertyOptionsMap === undefined)
        {
            typeOptions.propertyOptionsMap = new Map<PropertyName, PropertyOptions<any>>();
        }

        if (typeOptions.injectOptionsMap === undefined)
        {
            typeOptions.injectOptionsMap = new Map<InjectIndex, InjectOptions<any>>();
        }
        
        return typeOptions;
    }

    /**
     * Configures type extension metadata.
     * 
     * @param {TypeExtensionMetadataCtor<TTypeExtensionMetadata, TTypeExtensionOptions, TObject>} typeExtensionMetadataCtor Type extension metadata constructor.
     * @param {TTypeExtensionOptions} typeExtensionOptions Type extension options.
     * 
     * @returns {TTypeExtensionMetadata} Type extension metadata
     */
    public configureTypeExtensionMetadata<TTypeExtensionMetadata extends TypeExtensionMetadata<TObject, TTypeExtensionOptions>, TTypeExtensionOptions extends TypeExtensionOptions>(
        typeExtensionMetadataCtor: TypeExtensionMetadataCtor<TTypeExtensionMetadata, TTypeExtensionOptions, TObject>, 
        typeExtensionOptions?: TTypeExtensionOptions
    ): TTypeExtensionMetadata
    {
        const typeExtensionMetadataCtorSet = this.extractTypeExtensionMetadataCtorSet();

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
     * @param {TypeExtensionMetadataCtor<TTypeExtensionMetadata, TTypeExtensionOptions, TObject>} typeExtensionMetadataCtor Type extension metadata constructor.
     * 
     * @returns {Optional<TTypeExtensionMetadata>} Type extension metadata or undefined.
     */
    public extractTypeExtensionMetadata<TTypeExtensionMetadata extends TypeExtensionMetadata<TObject, TTypeExtensionOptions>, TTypeExtensionOptions extends TypeExtensionOptions>(
        typeExtensionMetadataCtor: TypeExtensionMetadataCtor<TTypeExtensionMetadata, TTypeExtensionOptions, TObject>
    ): Optional<TTypeExtensionMetadata>
    {
        const typeExtensionMetadataCtorSet = this.extractTypeExtensionMetadataCtorSet();

        if (!typeExtensionMetadataCtorSet.has(typeExtensionMetadataCtor)) 
        {
            return undefined;
        }
        
        const initialTypeExtensionOptions = {} as TTypeExtensionOptions;
        const typeExtensionMetadata = new typeExtensionMetadataCtor(this, initialTypeExtensionOptions);

        return typeExtensionMetadata;
    }

    /**
     * Extracts type extension metadata ctor set from custom value map.
     * 
     * @returns {Set<TypeExtensionMetadataCtor<any, any, any>>} Type extension metadata ctor set.
     */
    private extractTypeExtensionMetadataCtorSet(): Set<TypeExtensionMetadataCtor<any, any, any>>
    {
        let customValueMap = this.typeOptions.customValueMap;

        if (customValueMap === undefined)
        {
            customValueMap = new Map<CustomKey<any>, CustomValue>();

            this.typeOptions.customValueMap = customValueMap;
        }

        let typeExtensionMetadataCtorSet = customValueMap.get(TYPE_EXTENSION_METADATA_CTOR_SET_KEY) as Optional<Set<TypeExtensionMetadataCtor<any, any, any>>>;

        if (typeExtensionMetadataCtorSet === undefined)
        {
            typeExtensionMetadataCtorSet = new Set<TypeExtensionMetadataCtor<any, any, any>>();

            customValueMap.set(TYPE_EXTENSION_METADATA_CTOR_SET_KEY, typeExtensionMetadataCtorSet);
        }

        return typeExtensionMetadataCtorSet;
    }

    /**
     * Resolves type state.
     * 
     * Calling this method has side effects by recomputing type state. If you need current
     * type state then use provided getter for that.
     * 
     * @returns {ResolvedTypeState<TObject>} Resolved type state.
     */
    public resolveTypeState(): ResolvedTypeState<TObject>
    {
        const typeOptionsBase = this.typeOptionsBase;
        const typeOptions = this.typeOptions;
        const typeName = this.typeName;
        const alias = typeOptions.alias;
        const customValueMap = this.resolveCustomValueMap();

        const preserveNull = typeOptions.preserveNull === undefined 
            ? typeOptionsBase.preserveNull
            : typeOptions.preserveNull;

        const useDefaultValue = typeOptions.useDefaultValue === undefined 
            ? typeOptionsBase.useDefaultValue 
            : typeOptions.useDefaultValue;

        const useImplicitConversion = typeOptions.useImplicitConversion === undefined 
            ? typeOptionsBase.useImplicitConversion 
            : typeOptions.useImplicitConversion;

        const serializedDefaultValue = typeOptions.defaultValue === undefined 
            ? typeOptions.serializedDefaultValue
            : typeOptions.defaultValue;
        
        const serializedDefaultValueResolver = useDefaultValue 
            ? (typeof serializedDefaultValue === 'function' ? serializedDefaultValue : () => serializedDefaultValue)
            : DEFAULT_VALUE_RESOLVER;

        const serializedNullValueResolver = preserveNull 
            ? NULL_VALUE_RESOLVER 
            : serializedDefaultValueResolver;

        const deserializedDefaultValue = typeOptions.defaultValue === undefined 
            ? typeOptions.deserializedDefaultValue
            : typeOptions.defaultValue;
        
        const deserializedDefaultValueResolver = useDefaultValue
            ? (typeof deserializedDefaultValue === 'function' ? deserializedDefaultValue : () => deserializedDefaultValue)
            : DEFAULT_VALUE_RESOLVER;

        const deserializedNullValueResolver = preserveNull 
            ? NULL_VALUE_RESOLVER
            : deserializedDefaultValueResolver;
        
        const discriminant = typeOptions.discriminant === undefined
            ? typeName
            : typeOptions.discriminant;

        const discriminator = typeOptions.discriminator === undefined
            ? typeOptionsBase.discriminator
            : typeOptions.discriminator;

        const factory = typeOptions.factory === undefined
            ? typeOptionsBase.factory
            : typeOptions.factory;
        
        const injectable = typeOptions.injectable === true;

        const injector = typeOptions.injector === undefined
            ? typeOptionsBase.injector
            : typeOptions.injector;

        const logger = typeOptions.logger === undefined
            ? typeOptionsBase.logger
            : typeOptions.logger;

        const namingConvention = typeOptions.namingConvention === undefined
            ? typeOptionsBase.namingConvention
            : typeOptions.namingConvention;

        const parentTypeArguments = typeOptions.parentTypeArguments === undefined
            ? EMPTY_ARRAY
            : typeOptions.parentTypeArguments;
        
        const ownParentTypeMetadatas = this.resolveOwnParentTypeMetadatas(parentTypeArguments);
        const ownChildTypeMetadatas = this.resolveOwnChildTypeMetadatas();
        const parentTypeMetadataSet = this.resolveParentTypeMetadataSet(this);
        const parentTypeMetadatas = Array.from(parentTypeMetadataSet);
        const childTypeMetadataSet = this.resolveChildTypeMetadataSet(this);
        const childTypeMetadatas = Array.from(childTypeMetadataSet);

        const typeMetadataMap = new Map<TypeFn<any>, TypeMetadata<any>>();
        const polymorphic = childTypeMetadatas.length > 1;

        for (let i = 0; i < childTypeMetadatas.length; i++)
        {
            const childTypeMetadata = childTypeMetadatas[i];

            typeMetadataMap.set(childTypeMetadata.typeFn, childTypeMetadata);
        }

        const preserveDiscriminator = typeOptions.preserveDiscriminator === undefined 
            ? typeOptionsBase.preserveDiscriminator
            : typeOptions.preserveDiscriminator;

        const referenceHandler = typeOptions.referenceHandler === undefined 
            ? typeOptionsBase.referenceHandler
            : typeOptions.referenceHandler;

        const serializer = typeOptions.serializer === undefined 
            ? typeOptionsBase.serializer
            : typeOptions.serializer;

        const propertySorter = typeOptions.propertySorter === undefined 
            ? typeOptionsBase.propertySorter
            : typeOptions.propertySorter;

        const ownPropertyMetadataMap = this.currentPropertyMetadataMap;
        const propertyMetadataMap = this.resolvePropertyMetadataMap(parentTypeMetadatas);

        const sortedPropertyMetadatas = propertySorter === undefined
            ? Array.from(propertyMetadataMap.values())
            : Array.from(propertyMetadataMap.values()).sort(propertySorter.sort);

        const injectMetadataMap = this.currentInjectMetadataMap;

        const injectSorter = typeOptions.injectSorter === undefined 
            ? typeOptionsBase.injectSorter
            : typeOptions.injectSorter;

        const sortedInjectMetadatas = injectSorter === undefined
            ? Array.from(injectMetadataMap.values())
            : Array.from(injectMetadataMap.values()).sort(injectSorter.sort);
        
        const propertyOptionsMap = typeOptions.propertyOptionsMap === undefined 
            ? EMPTY_MAP
            : typeOptions.propertyOptionsMap;

        const injectOptionsMap = typeOptions.injectOptionsMap === undefined 
            ? EMPTY_MAP
            : typeOptions.injectOptionsMap;

        const resolvedTypeState = new ResolvedTypeState(
            this,
            alias,
            customValueMap,
            serializedNullValueResolver,
            serializedDefaultValue,
            serializedDefaultValueResolver,
            deserializedNullValueResolver,
            deserializedDefaultValue,
            deserializedDefaultValueResolver,
            discriminant,
            discriminator,
            factory,
            injectable,
            injector,
            logger,
            namingConvention,
            polymorphic,
            typeMetadataMap,
            preserveDiscriminator,
            referenceHandler,
            serializer,
            preserveNull,
            useDefaultValue,
            useImplicitConversion,
            propertySorter,
            sortedPropertyMetadatas,
            injectSorter,
            sortedInjectMetadatas,
            parentTypeArguments,
            parentTypeMetadatas,
            ownParentTypeMetadatas,
            childTypeMetadatas,
            ownChildTypeMetadatas,
            propertyOptionsMap,
            propertyMetadataMap,
            ownPropertyMetadataMap,
            injectOptionsMap,
            injectMetadataMap
        );

        this.currentTypeState = resolvedTypeState;

        return resolvedTypeState;
    }

    /**
     * Unresolves type state.
     * 
     * Calling this method has side effects by resetting type state. 
     * 
     * @returns {UnresolvedTypeState<TObject>} Unresolved type state.
     */
    public unresolveTypeState(): UnresolvedTypeState<TObject>
    {
        const unresolvedTypeState = new UnresolvedTypeState<TObject>(this);

        this.currentTypeState = unresolvedTypeState;

        return unresolvedTypeState;
    }

    /**
     * Resolves custom value map the same way as it is done for the main options.
     * 
     * @returns {ReadonlyMap<CustomKey<any>, CustomValue>} Resolved custom value map.
     */
    private resolveCustomValueMap(): ReadonlyMap<CustomKey<any>, CustomValue>
    {
        const typeOptionsBase = this.typeOptionsBase;
        const typeOptions = this.typeOptions;
        const customValueMap = new Map<CustomKey<any>, CustomValue>();

        if (typeOptions.customValueMap === undefined)
        {
            return customValueMap;
        }

        const baseCustomValueMap = typeOptionsBase.customValueMap === undefined
            ? EMPTY_MAP
            : typeOptionsBase.customValueMap;
        
        for (const [customKey, customValue] of typeOptions.customValueMap)
        {
            if (customValue === undefined)
            {
                customValueMap.set(customKey, baseCustomValueMap.get(customKey));

                continue;
            }

            customValueMap.set(customKey, customValue);
        }

        return customValueMap;
    }

    /**
     * Resolves own parent type metadatas.
     * 
     * @param {ReadonlyArray<TypeArgument<any>>} parentTypeArguments Resolved parent type arguments.
     * 
     * @returns {ReadonlyArray<TypeMetadata<any>>} Resolved own parent type metadatas.
     */
    private resolveOwnParentTypeMetadatas(parentTypeArguments: ReadonlyArray<TypeArgument<any>>): ReadonlyArray<TypeMetadata<any>>
    {
        const ownParentTypeMetadatas = new Array<TypeMetadata<any>>();
        const parentTypeMetadatas = this.resolveTypeMetadatas(parentTypeArguments);

        for (let i = parentTypeMetadatas.length - 1; i >= 0; i--)
        {
            ownParentTypeMetadatas.push(parentTypeMetadatas[i]);
        }

        if (this.parentTypeMetadata !== undefined)
        {
            ownParentTypeMetadatas.push(this.parentTypeMetadata);
        }

        return ownParentTypeMetadatas;
    }

    /**
     * Resolves own child type metadatas.
     * 
     * @returns {ReadonlyArray<TypeMetadata<any>>} Resolved own child type metadatas.
     */
    private resolveOwnChildTypeMetadatas(): ReadonlyArray<TypeMetadata<any>>
    {
        const ownChildTypeMetadatas = new Array<TypeMetadata<any>>();

        for (const childTypeMetadata of this.currentChildTypeMetadataMap.values())
        {
            ownChildTypeMetadatas.push(childTypeMetadata);
        }

        for (const setTypeMetadata of this.typeMetadataSet)
        {
            const typeOptions = setTypeMetadata.typeOptions;

            const parentTypeArguments = typeOptions.parentTypeArguments === undefined
                ? EMPTY_ARRAY
                : typeOptions.parentTypeArguments;

            const parentTypeMetadatas = this.resolveTypeMetadatas(parentTypeArguments);

            for (let i = 0; i < parentTypeMetadatas.length; i++)
            {
                if (parentTypeMetadatas[i] === this)
                {
                    ownChildTypeMetadatas.push(setTypeMetadata);

                    break;
                }
            }
        }

        return ownChildTypeMetadatas;
    }

    /**
     * Resolves parent type metadata set for provided type metadata reflecting inheritance order where the 
     * first element is the current type metadata and the last element is the most abstract parent. This
     * collection is used to define all properties which are declared for the provided type metadata 
     * respecting nested declarations.
     * 
     * @param {TypeMetadata<any>} typeMetadata Type metadata. 
     * @param {Set<TypeMetadata<any>>} parentTypeMetadataSet Parent type metadata set.
     *  
     * @returns {ReadonlySet<TypeMetadata<any>>} Parent type metadata set.
     */
    private resolveParentTypeMetadataSet(
        typeMetadata: TypeMetadata<any>, 
        parentTypeMetadataSet: Set<TypeMetadata<any>> = new Set<TypeMetadata<any>>()
    ): ReadonlySet<TypeMetadata<any>>
    {
        if (parentTypeMetadataSet.has(typeMetadata))
        {
            return parentTypeMetadataSet;
        }

        parentTypeMetadataSet.add(typeMetadata);

        const typeOptions = typeMetadata.typeOptions;

        const parentTypeArguments = typeOptions.parentTypeArguments === undefined
            ? EMPTY_ARRAY
            : typeOptions.parentTypeArguments;

        const parentTypeMetadatas = this.resolveTypeMetadatas(parentTypeArguments);

        for (let i = parentTypeMetadatas.length - 1; i >= 0; i--)
        {
            this.resolveParentTypeMetadataSet(parentTypeMetadatas[i], parentTypeMetadataSet);
        }

        if (typeMetadata.parentTypeMetadata !== undefined) 
        {
            this.resolveParentTypeMetadataSet(typeMetadata.parentTypeMetadata, parentTypeMetadataSet);
        }
        
        return parentTypeMetadataSet;
    }

    /**
     * Resolved child type metadata set for provided type metadata reflecting inheritance order where the 
     * first element is the current type metadata and the last element is the most specific child. This 
     * collection is used to define polymorphic relationships between types.
     * 
     * @param {TypeMetadata<any>} typeMetadata Type metadata. 
     * @param {Set<TypeMetadata<any>>} childTypeMetadataSet Child type metadata set.
     *  
     * @returns {ReadonlySet<TypeMetadata<any>>} Child type metadata set.
     */
    private resolveChildTypeMetadataSet(
        typeMetadata: TypeMetadata<any>, 
        childTypeMetadataSet: Set<TypeMetadata<any>> = new Set<TypeMetadata<any>>()
    ): ReadonlySet<TypeMetadata<any>>
    {
        if (childTypeMetadataSet.has(typeMetadata))
        {
            return childTypeMetadataSet;
        }

        childTypeMetadataSet.add(typeMetadata);

        for (const childTypeMetadata of typeMetadata.currentChildTypeMetadataMap.values())
        {
            this.resolveChildTypeMetadataSet(childTypeMetadata, childTypeMetadataSet);

            childTypeMetadata.unresolveTypeState();
        }

        for (const setTypeMetadata of this.typeMetadataSet)
        {
            const typeOptions = setTypeMetadata.typeOptions;

            const parentTypeArguments = typeOptions.parentTypeArguments === undefined
                ? EMPTY_ARRAY
                : typeOptions.parentTypeArguments;

            const parentTypeMetadatas = this.resolveTypeMetadatas(parentTypeArguments);

            for (let i = 0; i < parentTypeMetadatas.length; i++)
            {
                if (parentTypeMetadatas[i] === typeMetadata)
                {
                    this.resolveChildTypeMetadataSet(setTypeMetadata, childTypeMetadataSet);
                    
                    setTypeMetadata.unresolveTypeState();

                    break;
                }
            }
        }

        return childTypeMetadataSet;
    }

    /**
     * Resolves property metadata map.
     * 
     * @param {ReadonlyArray<TypeMetadata<any>>} parentTypeMetadatas Resolved parent type metadatas.
     * 
     * @returns {ReadonlyMap<PropertyName, PropertyMetadata<TObject, any>>} Resolved property metadata map.
     */
    private resolvePropertyMetadataMap(parentTypeMetadatas: ReadonlyArray<TypeMetadata<any>>): ReadonlyMap<PropertyName, PropertyMetadata<TObject, any>>
    {
        const propertyMetadataMap = new Map<PropertyName, PropertyMetadata<TObject, any>>();

        for (let i = parentTypeMetadatas.length - 1; i >= 0; i--)
        {
            for (const [propertyName, propertyMetadata] of parentTypeMetadatas[i].currentPropertyMetadataMap)
            {
                propertyMetadataMap.set(propertyName, propertyMetadata);
            }
        }

        for (const propertyMetadata of this.currentPropertyMetadataMap.values())
        {
            propertyMetadata.unresolvePropertyState();
        }

        return propertyMetadataMap;
    }

    /**
     * Extends parent type metadata.
     * 
     * @returns {this} Current instance of type metadata.
     */
    private extendParentTypeMetadata(): this
    {
        const parentTypeMetadata = this.parentTypeMetadata;

        if (parentTypeMetadata !== undefined) 
        {
            parentTypeMetadata.currentChildTypeMetadataMap.set(this.typeFn, this);
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
            if (!this.currentInjectMetadataMap.has(injectIndex))
            {
                this.configureInjectMetadata(injectIndex, { typeArgument: injectTypeFns[injectIndex] });
            }
        }

        return this;
    }

    /**
     * Configures alias.
     * 
     * @param {Optional<Alias>} alias Alias.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasAlias(alias: Optional<Alias>): this
    {
        this.releaseAlias();

        this.typeOptions.alias = alias;

        if (alias !== undefined) 
        {
            this.currentTypeFnMap.set(alias, this.typeFn);
        }

        this.currentTypeState = new UnresolvedTypeState<TObject>(this);

        return this;
    }

    /**
     * Releases alias.
     * 
     * @returns {this} Current instance of type metadata. 
     */
    private releaseAlias(): this
    {
        const alias = this.typeOptions.alias;

        if (alias !== undefined && this.currentTypeFnMap.has(alias))
        {
            this.currentTypeFnMap.delete(alias);
        }

        return this;
    }

    /**
     * Configures custom value map.
     * 
     * @param {Optional<Map<CustomKey<any>, CustomValue>>} customValueMap Custom value map or undefined.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasCustomValueMap(customValueMap: Optional<Map<CustomKey<any>, CustomValue>>): this
    {
        let currentCustomValueMap = this.typeOptions.customValueMap;

        if (currentCustomValueMap === undefined)
        {
            currentCustomValueMap = new Map<CustomKey<any>, CustomValue>();

            this.typeOptions.customValueMap = currentCustomValueMap;
        }

        if (customValueMap !== undefined)
        {
            if (currentCustomValueMap !== customValueMap)
            {
                currentCustomValueMap.clear();
            }

            for (const [customKey, customValue] of customValueMap)
            {
                currentCustomValueMap.set(customKey, customValue);
            }
        }

        this.currentTypeState = new UnresolvedTypeState<TObject>(this);

        return this;
    }

    /**
     * Configures custom value.
     * 
     * @param {CustomKey<TCustomValue>} customKey Custom key.
     * @param {TCustomValue} customValue Custom value.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasCustomValue<TCustomValue>(customKey: CustomKey<TCustomValue>, customValue: TCustomValue): this
    {
        let customValueMap = this.typeOptions.customValueMap;

        if (customValueMap === undefined)
        {
            customValueMap = new Map<CustomKey<any>, CustomValue>();

            this.typeOptions.customValueMap = customValueMap;
        }

        customValueMap.set(customKey, customValue);

        this.currentTypeState = new UnresolvedTypeState<TObject>(this);

        return this;
    }

    /**
     * Extracts value by custom key.
     * 
     * @param {CustomKey<TCustomValue>} customKey Custom key.
     *  
     * @returns {TCustomValue} Custom value.
     */
    public extractCustomValue<TCustomValue>(customKey: CustomKey<TCustomValue>): TCustomValue
    {
        let customValue =  this.typeState.customValueMap.get(customKey) as TCustomValue;

        if (customValue === undefined && customKey.customValueResolver !== undefined)
        {
            customValue = customKey.customValueResolver();
        }

        return customValue;
    }

    /**
     * Configures custom options.
     * 
     * @param {ReadonlyArray<CustomOption>} customOptions Custom options.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasCustomOptions(customOptions: ReadonlyArray<CustomOption>): this
    {
        let customValueMap = this.typeOptions.customValueMap;

        if (customValueMap === undefined)
        {
            customValueMap = new Map<CustomKey<any>, CustomValue>();

            this.typeOptions.customValueMap = customValueMap;
        }

        for (let i = 0; i < customOptions.length; i++)
        {
            customValueMap.set(customOptions[i][0], customOptions[i][1]);
        }

        this.currentTypeState = new UnresolvedTypeState<TObject>(this);

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
        this.currentTypeState = new UnresolvedTypeState<TObject>(this);

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
        this.currentTypeState = new UnresolvedTypeState<TObject>(this);

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
        this.currentTypeState = new UnresolvedTypeState<TObject>(this);

        return this;
    }

    /**
     * Configures discriminator.
     * 
     * @param {Optional<Discriminator>} discriminator Discriminator.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasDiscriminator(discriminator: Optional<Discriminator>): this
    {
        this.typeOptions.discriminator = discriminator;
        this.currentTypeState = new UnresolvedTypeState<TObject>(this);

        return this;
    }
    
    /**
     * Configures discriminant.
     * 
     * @param {Optional<Discriminant>} discriminant Discriminant.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasDiscriminant(discriminant: Optional<Discriminant>): this
    {
        this.typeOptions.discriminant = discriminant;
        this.currentTypeState = new UnresolvedTypeState<TObject>(this);

        return this;
    }

    /**
     * Configures factory.
     * 
     * @param {Optional<Factory>} factory Factory.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasFactory(factory: Optional<Factory>): this
    {
        this.typeOptions.factory = factory;
        this.currentTypeState = new UnresolvedTypeState<TObject>(this);

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
        this.currentTypeState = new UnresolvedTypeState<TObject>(this);

        return this;
    }

    /**
     * Configures injector.
     * 
     * @param {Optional<Injector>} injector Injector.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasInjector(injector: Optional<Injector>): this
    {
        this.typeOptions.injector = injector;
        this.currentTypeState = new UnresolvedTypeState<TObject>(this);

        return this;
    }

    /**
     * Configures logger.
     * 
     * @param {Optional<Logger>} logger Logger.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasLogger(logger: Optional<Logger>): this
    {
        this.typeOptions.logger = logger;
        this.currentTypeState = new UnresolvedTypeState<TObject>(this);

        return this;
    }

    /**
     * Configures naming convention.
     * 
     * @param {Optional<NamingConvention>} namingConvention Naming convention.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasNamingConvention(namingConvention: Optional<NamingConvention>): this
    {
        this.typeOptions.namingConvention = namingConvention;
        this.currentTypeState = new UnresolvedTypeState<TObject>(this);

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
        this.currentTypeState = new UnresolvedTypeState<TObject>(this);

        return this;
    }

    /**
     * Configures reference handler.
     * 
     * @param {Optional<ReferenceHandler>} referenceHandler Reference handler.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasReferenceHandler(referenceHandler: Optional<ReferenceHandler>): this
    {
        this.typeOptions.referenceHandler = referenceHandler;
        this.currentTypeState = new UnresolvedTypeState<TObject>(this);

        return this;
    }

    /**
     * Configures serializer.
     * 
     * @param {Optional<Serializer<TObject>>} serializer Serializer.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasSerializer(serializer: Optional<Serializer<TObject>>): this
    {
        this.typeOptions.serializer = serializer;
        this.currentTypeState = new UnresolvedTypeState<TObject>(this);

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
        this.currentTypeState = new UnresolvedTypeState<TObject>(this);

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
        this.currentTypeState = new UnresolvedTypeState<TObject>(this);

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
        this.currentTypeState = new UnresolvedTypeState<TObject>(this);

        return this;
    }

    /**
     * Configures property sorter.
     * 
     * @param {Optional<PropertySorter>} propertySorter Property sorter.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasPropertySorter(propertySorter: Optional<PropertySorter>): this
    {
        this.typeOptions.propertySorter = propertySorter;
        this.currentTypeState = new UnresolvedTypeState<TObject>(this);

        return this;
    }

    /**
     * Configures inject sorter.
     * 
     * @param {Optional<InjectSorter>} injectSorter Inject sorter.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasInjectSorter(injectSorter: Optional<InjectSorter>): this
    {
        this.typeOptions.injectSorter = injectSorter;
        this.currentTypeState = new UnresolvedTypeState<TObject>(this);

        return this;
    }

    /**
     * Configures parent type arguments.
     * 
     * @param {Array<TypeArgument<any>>} parentTypeArguments Parent type arguments.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public hasParentTypeArguments(parentTypeArguments: Array<TypeArgument<any>>): this
    {
        this.typeOptions.parentTypeArguments = parentTypeArguments;
        this.currentTypeState = new UnresolvedTypeState<TObject>(this);

        return this;
    }

    /**
     * Configures certain property metadata.
     * 
     * @param {PropertyName} propertyName Property name. 
     * @param {PropertyOptions<TPropertyType>} propertyOptions Property options.
     * 
     * @returns {PropertyMetadata<TObject, TPropertyType>} Configured property metadata.
     */
    public configurePropertyMetadata<TPropertyType>(propertyName: PropertyName, propertyOptions?: PropertyOptions<TPropertyType>): PropertyMetadata<TObject, TPropertyType>
    {
        let propertyOptionsMap = this.typeOptions.propertyOptionsMap;

        if (propertyOptionsMap === undefined)
        {
            propertyOptionsMap = new Map<PropertyName, PropertyOptions<any>>();

            this.typeOptions.propertyOptionsMap = propertyOptionsMap;
        }

        let propertyMetadata = this.currentPropertyMetadataMap.get(propertyName);

        if (propertyMetadata === undefined)
        {
            propertyOptions = propertyOptions ?? {} as PropertyOptions<TPropertyType>;
            propertyMetadata = new PropertyMetadata(this.typeManager, this.currentTypeFnMap, this, propertyName, propertyOptions);

            this.currentPropertyMetadataMap.set(propertyName, propertyMetadata);

            propertyOptionsMap.set(propertyName, propertyOptions);

            this.currentTypeState = new UnresolvedTypeState<TObject>(this);

            return propertyMetadata;
        }

        if (propertyOptions !== undefined)
        {
            propertyMetadata.configure(propertyOptions);
        }

        this.currentTypeState = new UnresolvedTypeState<TObject>(this);

        return propertyMetadata;
    }

    /**
     * Configures certain inject metadata.
     * 
     * @param {InjectIndex} injectIndex Inject index. 
     * @param {InjectOptions<TInjectType>} injectOptions Inject options.
     * 
     * @returns {InjectMetadata<TObject, TInjectType>} Configured inject metadata.
     */
    public configureInjectMetadata<TInjectType>(injectIndex: InjectIndex, injectOptions?: InjectOptions<TInjectType>): InjectMetadata<TObject, TInjectType>
    {
        let injectOptionsMap = this.typeOptions.injectOptionsMap;

        if (injectOptionsMap === undefined)
        {
            injectOptionsMap = new Map<InjectIndex, InjectOptions<any>>();

            this.typeOptions.injectOptionsMap = injectOptionsMap;
        }

        let injectMetadata = this.currentInjectMetadataMap.get(injectIndex);

        if (injectMetadata === undefined)
        {
            injectOptions = injectOptions ?? {} as InjectOptions<TInjectType>;
            injectMetadata = new InjectMetadata(this.typeManager, this.currentTypeFnMap, this, injectIndex, injectOptions);

            this.currentInjectMetadataMap.set(injectIndex, injectMetadata);

            injectOptionsMap.set(injectIndex, injectOptions);

            this.currentTypeState = new UnresolvedTypeState<TObject>(this);
            
            return injectMetadata;
        }

        if (injectOptions !== undefined)
        {
            injectMetadata.configure(injectOptions);
        }

        this.currentTypeState = new UnresolvedTypeState<TObject>(this);

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
        const currentPropertyOptionsMap = this.clearPropertyOptionsMap(propertyOptionsMap);

        for (const [propertyName, propertyOptions] of propertyOptionsMap)
        {
            const propertyMetadata = new PropertyMetadata(this.typeManager, this.currentTypeFnMap, this, propertyName, propertyOptions);

            this.currentPropertyMetadataMap.set(propertyName, propertyMetadata);

            currentPropertyOptionsMap.set(propertyName, propertyOptions);
        }

        this.currentTypeState = new UnresolvedTypeState<TObject>(this);

        return this;
    }

    /**
     * Clears property options map.
     * 
     * @param {Map<PropertyName, PropertyOptions<TPropertyType>>} propertyOptionsMap Property options map.
     * 
     * @returns {Map<PropertyName, PropertyOptions<any>>} Cleared property options map.
     */
    private clearPropertyOptionsMap<TPropertyType>(propertyOptionsMap: Map<PropertyName, PropertyOptions<TPropertyType>>): Map<PropertyName, PropertyOptions<any>>
    {
        let currentPropertyOptionsMap = this.typeOptions.propertyOptionsMap;

        if (currentPropertyOptionsMap === undefined)
        {
            currentPropertyOptionsMap = new Map<PropertyName, PropertyOptions<any>>();

            this.typeOptions.propertyOptionsMap = currentPropertyOptionsMap;
        }

        if (currentPropertyOptionsMap !== propertyOptionsMap)
        {
            currentPropertyOptionsMap.clear();

            this.currentPropertyMetadataMap.clear();
        }

        return currentPropertyOptionsMap;
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
        const currentInjectOptionsMap = this.clearInjectOptionsMap(injectOptionsMap);

        for (const [injectIndex, injectOptions] of injectOptionsMap)
        {
            const injectMetadata = new InjectMetadata(this.typeManager, this.currentTypeFnMap, this, injectIndex, injectOptions);

            this.currentInjectMetadataMap.set(injectIndex, injectMetadata);

            currentInjectOptionsMap.set(injectIndex, injectOptions);
        }

        this.currentTypeState = new UnresolvedTypeState<TObject>(this);

        return this;
    }

    /**
     * Clears inject options map.
     * 
     * @param {Map<InjectIndex, InjectOptions<TInjectType>>} injectOptionsMap Inject options map.
     * 
     * @returns {Map<InjectIndex, InjectOptions<any>>} Cleared inject options map.
     */
    private clearInjectOptionsMap<TInjectType>(injectOptionsMap: Map<InjectIndex, InjectOptions<TInjectType>>): Map<InjectIndex, InjectOptions<any>>
    {
        let currentInjectOptionsMap = this.typeOptions.injectOptionsMap;

        if (currentInjectOptionsMap === undefined)
        {
            currentInjectOptionsMap = new Map<InjectIndex, InjectOptions<any>>();

            this.typeOptions.injectOptionsMap = currentInjectOptionsMap;
        }

        if (currentInjectOptionsMap !== injectOptionsMap)
        {
            currentInjectOptionsMap.clear();

            this.currentInjectMetadataMap.clear();
        }

        return currentInjectOptionsMap;
    }

    /**
     * Configures type metadata based on provided options.
     * 
     * @param {TypeOptions<TObject>} typeOptions Type options.
     * 
     * @returns {this} Current instance of type metadata.
     */
    public configure(typeOptions: TypeOptions<TObject>): this
    {
        if (typeOptions.alias !== undefined) 
        {
            this.hasAlias(typeOptions.alias);
        }

        if (typeOptions.customValueMap !== undefined)
        {
            this.hasCustomValueMap(typeOptions.customValueMap);
        }

        if (typeOptions.defaultValue !== undefined)
        {
            this.hasDefaultValue(typeOptions.defaultValue);
        }

        if (typeOptions.serializedDefaultValue !== undefined)
        {
            this.hasSerializedDefaultValue(typeOptions.serializedDefaultValue);
        }

        if (typeOptions.deserializedDefaultValue !== undefined) 
        {
            this.hasDeserializedDefaultValue(typeOptions.deserializedDefaultValue);
        }

        if (typeOptions.discriminator !== undefined) 
        {
            this.hasDiscriminator(typeOptions.discriminator);
        }

        if (typeOptions.discriminant !== undefined)
        {
            this.hasDiscriminant(typeOptions.discriminant);
        }

        if (typeOptions.factory !== undefined) 
        {
            this.hasFactory(typeOptions.factory);
        }

        if (typeOptions.injectable !== undefined)
        {
            this.isInjectable(typeOptions.injectable);
        }

        if (typeOptions.injector !== undefined)
        {
            this.hasInjector(typeOptions.injector);
        }

        if (typeOptions.logger !== undefined)
        {
            this.hasLogger(typeOptions.logger);
        }

        if (typeOptions.namingConvention !== undefined)
        {
            this.hasNamingConvention(typeOptions.namingConvention);
        }

        if (typeOptions.preserveDiscriminator !== undefined)
        {
            this.shouldPreserveDiscriminator(typeOptions.preserveDiscriminator);
        }

        if (typeOptions.referenceHandler !== undefined)
        {
            this.hasReferenceHandler(typeOptions.referenceHandler);
        }

        if (typeOptions.serializer !== undefined)
        {
            this.hasSerializer(typeOptions.serializer);
        }

        if (typeOptions.preserveNull !== undefined)
        {
            this.shouldPreserveNull(typeOptions.preserveNull);
        }

        if (typeOptions.useDefaultValue !== undefined) 
        {
            this.shouldUseDefaultValue(typeOptions.useDefaultValue);
        }

        if (typeOptions.useImplicitConversion !== undefined) 
        {
            this.shouldUseImplicitConversion(typeOptions.useImplicitConversion);
        }

        if (typeOptions.propertyOptionsMap !== undefined)
        {
            this.hasPropertyMetadataMap(typeOptions.propertyOptionsMap);
        }

        if (typeOptions.injectOptionsMap !== undefined)
        {
            this.hasInjectMetadataMap(typeOptions.injectOptionsMap);
        }

        if (typeOptions.propertySorter !== undefined)
        {
            this.hasPropertySorter(typeOptions.propertySorter);
        }

        if (typeOptions.injectSorter !== undefined)
        {
            this.hasInjectSorter(typeOptions.injectSorter);
        }

        if (typeOptions.parentTypeArguments !== undefined)
        {
            this.hasParentTypeArguments(typeOptions.parentTypeArguments);
        }

        return this;
    }
}
