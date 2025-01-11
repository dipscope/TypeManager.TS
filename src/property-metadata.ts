import { Alias } from './alias';
import { DEFAULT_VALUE_RESOLVER } from './constants/default-value-resolver';
import { EMPTY_ARRAY } from './constants/empty-array';
import { EMPTY_MAP } from './constants/empty-map';
import { NULL_VALUE_RESOLVER } from './constants/null-value-resolver';
import { CustomKey } from './custom-key';
import { CustomOption } from './custom-option';
import { CustomValue } from './custom-value';
import { DefaultValue } from './default-value';
import { getReflectMetadata } from './functions/get-reflect-metadata';
import { GenericArgument } from './generic-argument';
import { GenericMetadata } from './generic-metadata';
import { Metadata } from './metadata';
import { NamingConvention } from './naming-convention';
import { Nullable } from './nullable';
import { Optional } from './optional';
import { PropertyExtensionMetadata } from './property-extension-metadata';
import { PropertyExtensionMetadataCtor } from './property-extension-metadata-ctor';
import { PROPERTY_EXTENSION_METADATA_CTOR_SET_KEY } from './property-extension-metadata-ctor-set-key';
import { PropertyExtensionOptions } from './property-extension-options';
import { PropertyName } from './property-name';
import { PropertyOptions } from './property-options';
import { PropertyState } from './property-state';
import { ResolvedPropertyState } from './property-states/resolved-property-state';
import { UnresolvedPropertyState } from './property-states/unresolved-property-state';
import { ReferenceHandler } from './reference-handler';
import { Serializer } from './serializer';
import { TypeArgument } from './type-argument';
import { TypeFn } from './type-fn';
import { TypeManager } from './type-manager';
import { TypeMetadata } from './type-metadata';
import { TypeState } from './type-state';

/**
 * Main class used to describe a certain property.
 * 
 * @type {PropertyMetadata<TDeclaringObject, TObject>}
 */
export class PropertyMetadata<TDeclaringObject, TObject> extends Metadata
{
    /**
     * Type metadata to which property metadata belongs to.
     * 
     * @type {TypeMetadata<TDeclaringObject>}
     */
    public readonly declaringTypeMetadata: TypeMetadata<TDeclaringObject>;

    /**
     * Property name as declared in type.
     * 
     * @type {PropertyName}
     */
    public readonly propertyName: PropertyName;

    /**
     * Normalized property name used for sorting.
     * 
     * @type {PropertyName}
     */
    public readonly normalizedPropertyName: PropertyName;

    /**
     * Property options.
     * 
     * @type {PropertyOptions<TObject>}
     */
    private readonly propertyOptions: PropertyOptions<TObject>;

    /**
     * Type function defined using reflect metadata.
     * 
     * @type {Optional<TypeFn<TObject>>}
     */
    private readonly reflectTypeFn: Optional<TypeFn<TObject>>;

    /**
     * Current property state.
     * 
     * @type {PropertyState<TDeclaringObject, TObject>}
     */
    private currentPropertyState: PropertyState<TDeclaringObject, TObject>;

    /**
     * Constructor.
     * 
     * @param {TypeManager} typeManager Type manager.
     * @param {ReadonlyMap<Alias, TypeFn<any>>} typeFnMap Type function map for types with aliases.
     * @param {TypeMetadata<TDeclaringObject>} declaringTypeMetadata Type metadata to which property metadata belongs to.
     * @param {PropertyName} propertyName Property name.
     * @param {PropertyOptions<TObject>} propertyOptions Property options.
     */
    public constructor(
        typeManager: TypeManager, 
        typeFnMap: ReadonlyMap<Alias, TypeFn<any>>,
        declaringTypeMetadata: TypeMetadata<TDeclaringObject>, 
        propertyName: PropertyName,
        propertyOptions: PropertyOptions<TObject>
    )
    {
        super(typeManager, typeFnMap);

        this.declaringTypeMetadata = declaringTypeMetadata;
        this.propertyName = propertyName;
        this.normalizedPropertyName = propertyName.toLocaleLowerCase();
        this.reflectTypeFn = getReflectMetadata('design:type', declaringTypeMetadata.typeFn.prototype, propertyName);
        this.propertyOptions = this.constructPropertyOptions(propertyOptions);
        this.currentPropertyState = new UnresolvedPropertyState(this);

        this.configure(propertyOptions);

        return;
    }

    /**
     * Gets property state.
     * 
     * @returns {PropertyState<TDeclaringObject, TObject>} Property state.
     */
    public get propertyState(): PropertyState<TDeclaringObject, TObject>
    {
        return this.currentPropertyState;
    }

    /**
     * Gets alias.
     * 
     * @returns {Optional<Alias>} Alias or undefined.
     */
    public get alias(): Optional<Alias>
    {
        return this.currentPropertyState.alias;
    }

    /**
     * Gets custom value map.
     * 
     * @returns {ReadonlyMap<CustomKey<any>, CustomValue>} Custom value map.
     */
    public get customValueMap(): ReadonlyMap<CustomKey<any>, CustomValue>
    {
        return this.currentPropertyState.customValueMap;
    }

    /**
     * Gets serialized null value.
     * 
     * @returns {Nullable<any>} Resolved serialized null value or undefined.
     */
    public get serializedNullValue(): Nullable<any>
    {
        return this.currentPropertyState.serializedNullValueResolver();
    }

    /**
     * Gets serialized default value.
     * 
     * @returns {Optional<any>} Resolved serialized default value or undefined.
     */
    public get serializedDefaultValue(): Optional<any>
    {
        return this.currentPropertyState.serializedDefaultValueResolver();
    }

    /**
     * Gets deserialized null value.
     * 
     * @returns {Nullable<any>} Resolved deserialized null value or undefined.
     */
    public get deserializedNullValue(): Nullable<any>
    {
        return this.currentPropertyState.deserializedNullValueResolver();
    }
    
    /**
     * Gets deserialized default value.
     * 
     * @returns {Optional<any>} Resolved deserialized default value or undefined.
     */
    public get deserializedDefaultValue(): Optional<any>
    {
        return this.currentPropertyState.deserializedDefaultValueResolver();
    }

    /**
     * Gets serialized property name.
     * 
     * @returns {string} Serialized property name.
     */
    public get serializedPropertyName(): string
    {
        return this.currentPropertyState.serializedPropertyName;
    }

    /**
     * Gets deserialized property name.
     * 
     * @returns {string} Deserialized property name.
     */
    public get deserializedPropertyName(): string
    {
        return this.currentPropertyState.deserializedPropertyName;
    }

    /**
     * Gets deserializable value.
     * 
     * @returns {boolean} Deserializable indicator.
     */
    public get deserializable(): boolean
    {
        return this.currentPropertyState.deserializable;
    }

    /**
     * Gets generic arguments.
     * 
     * @returns {ReadonlyArray<GenericArgument<any>>} Generic arguments.
     */
    public get genericArguments(): ReadonlyArray<GenericArgument<any>>
    {
        return this.currentPropertyState.genericArguments;
    }

    /**
     * Gets generic metadatas.
     * 
     * @returns {ReadonlyArray<GenericMetadata<any>>} Generic metadatas.
     */
    public get genericMetadatas(): ReadonlyArray<GenericMetadata<any>>
    {
        return this.currentPropertyState.genericMetadatas;
    }

    /**
     * Gets naming convention.
     * 
     * @returns {Optional<NamingConvention>} Naming convention or undefined.
     */
    public get namingConvention(): Optional<NamingConvention>
    {
        return this.currentPropertyState.namingConvention;
    }

    /**
     * Gets reference handler.
     * 
     * @returns {ReferenceHandler} Reference handler.
     */
    public get referenceHandler(): ReferenceHandler 
    {
        return this.currentPropertyState.referenceHandler;
    }

    /**
     * Gets serializable value.
     * 
     * @returns {boolean} Serializable indicator.
     */
    public get serializable(): boolean
    {
        return this.currentPropertyState.serializable;
    }

    /**
     * Gets serializer.
     * 
     * @returns {Serializer<TObject>} Serializer.
     */
    public get serializer(): Serializer<TObject> 
    {
        return this.currentPropertyState.serializer;
    }

    /**
     * Gets type argument.
     * 
     * @returns {TypeArgument} Type argument.
     */
    public get typeArgument(): TypeArgument<TObject>
    {
        return this.currentPropertyState.typeArgument;
    }

    /**
     * Gets type metadata.
     * 
     * @returns {TypeMetadata<TObject>} Type metadata.
     */
    public get typeMetadata(): TypeMetadata<TObject>
    {
        return this.currentPropertyState.typeMetadata;
    }

    /**
     * Gets indicator if null value should be preserved.
     * 
     * @returns {boolean} True when null value should be preserved. False otherwise.
     */
    public get preserveNull(): boolean
    {
        return this.currentPropertyState.preserveNull;
    }

    /**
     * Gets indicator if default value should be used.
     * 
     * @returns {boolean} Use default value indicator.
     */
    public get useDefaultValue(): boolean
    {
        return this.currentPropertyState.useDefaultValue;
    }

    /**
     * Gets indicator if implicit conversion should be used.
     * 
     * @returns {boolean} Use implicit conversion indicator.
     */
    public get useImplicitConversion(): boolean
    {
        return this.currentPropertyState.useImplicitConversion;
    }

    /**
     * Constructs initial property options by extending passed options 
     * with default values if they are not overriden. All references are kept.
     * 
     * @param {PropertyOptions<TObject>} propertyOptions Property options.
     * 
     * @returns {PropertyOptions<TObject>} Constructed type options.
     */
    private constructPropertyOptions(propertyOptions: PropertyOptions<TObject>): PropertyOptions<TObject>
    {
        if (propertyOptions.customValueMap === undefined)
        {
            propertyOptions.customValueMap = new Map<CustomKey<any>, CustomValue>();
        }

        return propertyOptions;
    }

    /**
     * Configures property extension metadata.
     * 
     * @param {PropertyExtensionMetadataCtor<TPropertyExtensionMetadata, TPropertyExtensionOptions, TDeclaringObject, TObject>} propertyExtensionMetadataCtor Property extension metadata constructor.
     * @param {TPropertyExtensionOptions} propertyExtensionOptions Property extension options.
     * 
     * @returns {TPropertyExtensionMetadata} Property extension metadata
     */
    public configurePropertyExtensionMetadata<TPropertyExtensionMetadata extends PropertyExtensionMetadata<TDeclaringObject, TObject, TPropertyExtensionOptions>, TPropertyExtensionOptions extends PropertyExtensionOptions>(
        propertyExtensionMetadataCtor: PropertyExtensionMetadataCtor<TPropertyExtensionMetadata, TPropertyExtensionOptions, TDeclaringObject, TObject>, 
        propertyExtensionOptions?: TPropertyExtensionOptions
    ): TPropertyExtensionMetadata
    {
        const propertyExtensionMetadataCtorSet = this.extractPropertyExtensionMetadataCtorSet();

        if (!propertyExtensionMetadataCtorSet.has(propertyExtensionMetadataCtor))
        {
            propertyExtensionMetadataCtorSet.add(propertyExtensionMetadataCtor);
        }

        const initialPropertyExtensionOptions = propertyExtensionOptions ?? {} as TPropertyExtensionOptions;
        const propertyExtensionMetadata = new propertyExtensionMetadataCtor(this, initialPropertyExtensionOptions);

        return propertyExtensionMetadata;
    }

    /**
     * Extracts property extension metadata.
     * 
     * @param {PropertyExtensionMetadataCtor<TPropertyExtensionMetadata, TPropertyExtensionOptions, TDeclaringObject, TObject>} propertyExtensionMetadataCtor Property extension metadata constructor.
     * 
     * @returns {Optional<TPropertyExtensionMetadata>} Property extension metadata or undefined.
     */
    public extractPropertyExtensionMetadata<TPropertyExtensionMetadata extends PropertyExtensionMetadata<TDeclaringObject, TObject, TPropertyExtensionOptions>, TPropertyExtensionOptions extends PropertyExtensionOptions>(
        propertyExtensionMetadataCtor: PropertyExtensionMetadataCtor<TPropertyExtensionMetadata, TPropertyExtensionOptions, TDeclaringObject, TObject>
    ): Optional<TPropertyExtensionMetadata>
    {
        const propertyExtensionMetadataCtorSet = this.extractPropertyExtensionMetadataCtorSet();
        
        if (!propertyExtensionMetadataCtorSet.has(propertyExtensionMetadataCtor))
        {
            return undefined;
        }

        const initialPropertyExtensionOptions = {} as TPropertyExtensionOptions;
        const propertyExtensionMetadata = new propertyExtensionMetadataCtor(this, initialPropertyExtensionOptions);

        return propertyExtensionMetadata;
    }

    /**
     * Extracts property extension metadata ctor set from custom value map.
     * 
     * @returns {Set<PropertyExtensionMetadataCtor<any, any, any, any>>} Property extension metadata ctor set.
     */
    private extractPropertyExtensionMetadataCtorSet(): Set<PropertyExtensionMetadataCtor<any, any, any, any>>
    {
        let customValueMap = this.propertyOptions.customValueMap;

        if (customValueMap === undefined)
        {
            customValueMap = new Map<CustomKey<any>, CustomValue>();

            this.propertyOptions.customValueMap = customValueMap;
        }

        let propertyExtensionMetadataCtorSet = customValueMap.get(PROPERTY_EXTENSION_METADATA_CTOR_SET_KEY) as Optional<Set<PropertyExtensionMetadataCtor<any, any, any, any>>>;

        if (propertyExtensionMetadataCtorSet === undefined)
        {
            propertyExtensionMetadataCtorSet = new Set<PropertyExtensionMetadataCtor<any, any, any, any>>();

            customValueMap.set(PROPERTY_EXTENSION_METADATA_CTOR_SET_KEY, propertyExtensionMetadataCtorSet);
        }

        return propertyExtensionMetadataCtorSet;
    }

    /**
     * Resolves property state.
     * 
     * Calling this method has side effects by recomputing property state. If you need current
     * type state then use provided getter for that.
     * 
     * @returns {ResolvedPropertyState<TDeclaringObject, TObject>} Resolved property state.
     */
    public resolvePropertyState(): ResolvedPropertyState<TDeclaringObject, TObject>
    {
        const propertyOptions = this.propertyOptions;
        const propertyName = this.propertyName;
        const alias = propertyOptions.alias;
        const deserializedPropertyName = propertyName;

        const typeArgument = propertyOptions.typeArgument === undefined 
            ? this.reflectTypeFn 
            : propertyOptions.typeArgument;

        const typeMetadata = this.resolveTypeMetadata(typeArgument);
        const typeState = typeMetadata.typeState;
        const customValueMap = this.resolveCustomValueMap(typeState);

        const preserveNull = propertyOptions.preserveNull === undefined 
            ? typeState.preserveNull 
            : propertyOptions.preserveNull;

        const useDefaultValue = propertyOptions.useDefaultValue === undefined 
            ? typeState.useDefaultValue 
            : propertyOptions.useDefaultValue;

        const useImplicitConversion = propertyOptions.useImplicitConversion === undefined 
            ? typeState.useImplicitConversion 
            : propertyOptions.useImplicitConversion;

        const serializedDefaultValue = propertyOptions.defaultValue === undefined 
            ? (propertyOptions.serializedDefaultValue === undefined ? typeState.serializedDefaultValue : propertyOptions.serializedDefaultValue)
            : propertyOptions.defaultValue;
        
        const serializedDefaultValueResolver = useDefaultValue 
            ? (typeof serializedDefaultValue === 'function' ? serializedDefaultValue : () => serializedDefaultValue)
            : DEFAULT_VALUE_RESOLVER;

        const serializedNullValueResolver = preserveNull 
            ? NULL_VALUE_RESOLVER 
            : serializedDefaultValueResolver;
        
        const deserializedDefaultValue = propertyOptions.defaultValue === undefined 
            ? (propertyOptions.deserializedDefaultValue === undefined ? typeState.deserializedDefaultValue : propertyOptions.deserializedDefaultValue)
            : propertyOptions.defaultValue;
        
        const deserializedDefaultValueResolver = useDefaultValue
            ? (typeof deserializedDefaultValue === 'function' ? deserializedDefaultValue : () => deserializedDefaultValue)
            : DEFAULT_VALUE_RESOLVER;

        const deserializedNullValueResolver = preserveNull 
            ? NULL_VALUE_RESOLVER
            : deserializedDefaultValueResolver;
        
        const namingConvention = propertyOptions.namingConvention === undefined
            ? this.declaringTypeMetadata.typeState.namingConvention
            : propertyOptions.namingConvention;

        const serializedPropertyName = alias === undefined
            ? (namingConvention === undefined ? propertyName : namingConvention.convert(propertyName))
            : alias;
        
        const useDefaultSerialization = propertyOptions.serializable === undefined 
            && propertyOptions.deserializable === undefined;

        const serializable = useDefaultSerialization
            || propertyOptions.serializable === true;

        const deserializable = useDefaultSerialization
            || propertyOptions.deserializable === true;

        const genericArguments = propertyOptions.genericArguments === undefined
            ? EMPTY_ARRAY
            : propertyOptions.genericArguments;

        const genericMetadatas = this.resolveGenericMetadatas(genericArguments);

        const referenceHandler = propertyOptions.referenceHandler === undefined
            ? typeState.referenceHandler
            : propertyOptions.referenceHandler;

        const serializer = propertyOptions.serializer === undefined
            ? typeState.serializer
            : propertyOptions.serializer;
        
        const resolvedPropertyState = new ResolvedPropertyState<TDeclaringObject, TObject>(
            this,
            alias,
            customValueMap,
            serializedNullValueResolver,
            serializedDefaultValueResolver,
            deserializedNullValueResolver,
            deserializedDefaultValueResolver,
            serializedPropertyName,
            deserializedPropertyName,
            serializable,
            deserializable,
            genericArguments,
            genericMetadatas,
            namingConvention,
            referenceHandler,
            serializer,
            typeArgument,
            typeMetadata,
            preserveNull,
            useDefaultValue,
            useImplicitConversion
        );
        
        this.currentPropertyState = resolvedPropertyState;

        return resolvedPropertyState;
    }

    /**
     * Unresolves property state.
     * 
     * Calling this method has side effects by resetting property state. 
     * 
     * @returns {UnresolvedPropertyState<TDeclaringObject, TObject>} Unresolved property state.
     */
    public unresolvePropertyState(): UnresolvedPropertyState<TDeclaringObject, TObject>
    {
        const unresolvedPropertyState = new UnresolvedPropertyState<TDeclaringObject, TObject>(this);

        this.currentPropertyState = unresolvedPropertyState;

        return unresolvedPropertyState;
    }

    /**
     * Resolves custom value map the same way as it is done for the main options.
     * 
     * @returns {ReadonlyMap<CustomKey<any>, CustomValue>} Resolved custom value map.
     */
    private resolveCustomValueMap(typeState: TypeState<TObject>): ReadonlyMap<CustomKey<any>, CustomValue>
    {
        const propertyOptions = this.propertyOptions;
        const customValueMap = new Map<CustomKey<any>, CustomValue>();

        if (propertyOptions.customValueMap === undefined)
        {
            return customValueMap;
        }

        const typeCustomValueMap = typeState.customValueMap === undefined
            ? EMPTY_MAP
            : typeState.customValueMap;
        
        for (const [customKey, customValue] of propertyOptions.customValueMap)
        {
            if (customValue === undefined)
            {
                customValueMap.set(customKey, typeCustomValueMap.get(customKey));

                continue;
            }

            customValueMap.set(customKey, customValue);
        }

        return customValueMap;
    }

    /**
     * Configures alias.
     * 
     * @param {Optional<Alias>} alias Alias or undefined.
     * 
     * @returns {this} Current instance of property metadata.
     */
    public hasAlias(alias: Optional<Alias>): this
    {
        this.propertyOptions.alias = alias;
        this.currentPropertyState = new UnresolvedPropertyState<TDeclaringObject, TObject>(this);

        return this;
    }

    /**
     * Configures custom value map.
     * 
     * @param {Optional<Map<CustomKey<any>, CustomValue>>} customValueMap Custom value map or undefined.
     * 
     * @returns {this} Current instance of property metadata.
     */
    public hasCustomValueMap(customValueMap: Optional<Map<CustomKey<any>, CustomValue>>): this
    {
        let currentCustomValueMap = this.propertyOptions.customValueMap;

        if (currentCustomValueMap === undefined)
        {
            currentCustomValueMap = new Map<CustomKey<any>, CustomValue>();

            this.propertyOptions.customValueMap = currentCustomValueMap;
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

        this.currentPropertyState = new UnresolvedPropertyState<TDeclaringObject, TObject>(this);

        return this;
    }

    /**
     * Configures custom value.
     * 
     * @param {CustomKey<TCustomValue>} customKey Custom key.
     * @param {TCustomValue} customValue Custom value.
     * 
     * @returns {this} Current instance of property metadata.
     */
    public hasCustomValue<TCustomValue>(customKey: CustomKey<TCustomValue>, customValue: TCustomValue): this
    {
        let customValueMap = this.propertyOptions.customValueMap;

        if (customValueMap === undefined)
        {
            customValueMap = new Map<CustomKey<any>, CustomValue>();

            this.propertyOptions.customValueMap = customValueMap;
        }

        customValueMap.set(customKey, customValue);

        this.currentPropertyState = new UnresolvedPropertyState<TDeclaringObject, TObject>(this);

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
        let customValue =  this.propertyState.customValueMap.get(customKey) as TCustomValue;

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
     * @returns {this} Current instance of property metadata.
     */
    public hasCustomOptions(customOptions: ReadonlyArray<CustomOption>): this
    {
        let customValueMap = this.propertyOptions.customValueMap;

        if (customValueMap === undefined)
        {
            customValueMap = new Map<CustomKey<any>, CustomValue>();

            this.propertyOptions.customValueMap = customValueMap;
        }

        for (let i = 0; i < customOptions.length; i++)
        {
            customValueMap.set(customOptions[i][0], customOptions[i][1]);
        }

        this.currentPropertyState = new UnresolvedPropertyState<TDeclaringObject, TObject>(this);

        return this;
    }

    /**
     * Configures default value.
     * 
     * @param {DefaultValue} defaultValue Default value.
     * 
     * @returns {this} Current instance of property metadata.
     */
    public hasDefaultValue(defaultValue: DefaultValue): this
    {
        this.propertyOptions.defaultValue = defaultValue;
        this.currentPropertyState = new UnresolvedPropertyState<TDeclaringObject, TObject>(this);

        return this;
    }

    /**
     * Configures serialized default value.
     * 
     * @param {DefaultValue} serializedDefaultValue Serialized default value.
     * 
     * @returns {this} Current instance of property metadata.
     */
    public hasSerializedDefaultValue(serializedDefaultValue: DefaultValue): this
    {
        this.propertyOptions.serializedDefaultValue = serializedDefaultValue;
        this.currentPropertyState = new UnresolvedPropertyState<TDeclaringObject, TObject>(this);

        return this;
    }

    /**
     * Configures deserialized default value.
     * 
     * @param {DefaultValue} deserializedDefaultValue Deserialized default value.
     * 
     * @returns {this} Current instance of property metadata.
     */
    public hasDeserializedDefaultValue(deserializedDefaultValue: DefaultValue): this
    {
        this.propertyOptions.deserializedDefaultValue = deserializedDefaultValue;
        this.currentPropertyState = new UnresolvedPropertyState<TDeclaringObject, TObject>(this);

        return this;
    }

    /**
     * Configures deserializable.
     * 
     * @param {boolean} deserializable Deserializable.
     * 
     * @returns {this} Current instance of property metadata.
     */
    public isDeserializable(deserializable: boolean = true): this
    {
        this.propertyOptions.deserializable = deserializable;
        this.currentPropertyState = new UnresolvedPropertyState<TDeclaringObject, TObject>(this);

        return this;
    }

    /**
     * Configures serializable.
     * 
     * @param {boolean} serializable Serializable.
     * 
     * @returns {this} Current instance of property metadata.
     */
    public isSerializable(serializable: boolean = true): this
    {
        this.propertyOptions.serializable = serializable;
        this.currentPropertyState = new UnresolvedPropertyState<TDeclaringObject, TObject>(this);

        return this;
    }

    /**
     * Configures generic arguments.
     * 
     * @param {Optional<Array<GenericArgument<any>>>} genericArguments Generic arguments or undefined.
     * 
     * @returns {this} Current instance of property metadata.
     */
    public hasGenericArguments(genericArguments: Optional<Array<GenericArgument<any>>>): this
    {
        this.propertyOptions.genericArguments = genericArguments;
        this.currentPropertyState = new UnresolvedPropertyState<TDeclaringObject, TObject>(this);

        return this;
    }

    /**
     * Configures naming convention.
     * 
     * @param {Optional<NamingConvention>} namingConvention Naming convention or undefined.
     * 
     * @returns {this} Current instance of property metadata.
     */
    public hasNamingConvention(namingConvention: Optional<NamingConvention>): this
    {
        this.propertyOptions.namingConvention = namingConvention;
        this.currentPropertyState = new UnresolvedPropertyState<TDeclaringObject, TObject>(this);

        return this;
    }

    /**
     * Configures reference handler.
     * 
     * @param {Optional<ReferenceHandler>} referenceHandler Reference handler or undefined.
     * 
     * @returns {this} Current instance of property metadata.
     */
    public hasReferenceHandler(referenceHandler: Optional<ReferenceHandler>): this
    {
        this.propertyOptions.referenceHandler = referenceHandler;
        this.currentPropertyState = new UnresolvedPropertyState<TDeclaringObject, TObject>(this);

        return this;
    }

    /**
     * Configures serializer.
     * 
     * @param {Optional<Serializer<TObject>>} serializer Serializer or undefined.
     * 
     * @returns {this} Current instance of property metadata.
     */
    public hasSerializer(serializer: Optional<Serializer<TObject>>): this
    {
        this.propertyOptions.serializer = serializer;
        this.currentPropertyState = new UnresolvedPropertyState<TDeclaringObject, TObject>(this);

        return this;
    }

    /**
     * Configures type argument.
     * 
     * @param {Optional<TypeArgument<TObject>>} typeArgument Type argument or undefined.
     * 
     * @returns {this} Current instance of property metadata.
     */
    public hasTypeArgument(typeArgument: Optional<TypeArgument<TObject>>): this
    {
        this.propertyOptions.typeArgument = typeArgument ?? this.reflectTypeFn;
        this.currentPropertyState = new UnresolvedPropertyState<TDeclaringObject, TObject>(this);

        return this;
    }

    /**
     * Configures preserve null.
     * 
     * @param {boolean} preserveNull Preserve null.
     * 
     * @returns {this} Current instance of property metadata.
     */
    public shouldPreserveNull(preserveNull: boolean = true): this
    {
        this.propertyOptions.preserveNull = preserveNull;
        this.currentPropertyState = new UnresolvedPropertyState<TDeclaringObject, TObject>(this);

        return this;
    }

    /**
     * Configures use default value.
     * 
     * @param {boolean} useDefaultValue Use default value.
     * 
     * @returns {this} Current instance of property metadata.
     */
    public shouldUseDefaultValue(useDefaultValue: boolean = true): this
    {
        this.propertyOptions.useDefaultValue = useDefaultValue;
        this.currentPropertyState = new UnresolvedPropertyState<TDeclaringObject, TObject>(this);

        return this;
    }

    /**
     * Configures use implicit convertion.
     * 
     * @param {boolean} useImplicitConversion Use implicit convertion.
     * 
     * @returns {this} Current instance of property metadata.
     */
    public shouldUseImplicitConversion(useImplicitConversion: boolean = true): this
    {
        this.propertyOptions.useImplicitConversion = useImplicitConversion;
        this.currentPropertyState = new UnresolvedPropertyState<TDeclaringObject, TObject>(this);

        return this;
    }

    /**
     * Configures property metadata based on provided options.
     * 
     * @param {PropertyOptions<TObject>} propertyOptions Property options.
     * 
     * @returns {this} Current instance of property metadata.
     */
    public configure(propertyOptions: PropertyOptions<TObject>): this
    {
        if (propertyOptions.alias !== undefined)
        {
            this.hasAlias(propertyOptions.alias);
        }

        if (propertyOptions.customValueMap !== undefined)
        {
            this.hasCustomValueMap(propertyOptions.customValueMap);
        }

        if (propertyOptions.defaultValue !== undefined)
        {
            this.hasDefaultValue(propertyOptions.defaultValue);
        }

        if (propertyOptions.serializedDefaultValue !== undefined)
        {
            this.hasSerializedDefaultValue(propertyOptions.serializedDefaultValue);
        }

        if (propertyOptions.deserializedDefaultValue !== undefined)
        {
            this.hasDeserializedDefaultValue(propertyOptions.deserializedDefaultValue);
        }

        if (propertyOptions.deserializable !== undefined)
        {
            this.isDeserializable(propertyOptions.deserializable);
        }

        if (propertyOptions.genericArguments !== undefined) 
        {
            this.hasGenericArguments(propertyOptions.genericArguments);
        }

        if (propertyOptions.namingConvention !== undefined)
        {
            this.hasNamingConvention(propertyOptions.namingConvention);
        }

        if (propertyOptions.referenceHandler !== undefined) 
        {
            this.hasReferenceHandler(propertyOptions.referenceHandler);
        }

        if (propertyOptions.serializable !== undefined) 
        {
            this.isSerializable(propertyOptions.serializable);
        }

        if (propertyOptions.serializer !== undefined) 
        {
            this.hasSerializer(propertyOptions.serializer);
        }

        if (propertyOptions.typeArgument !== undefined) 
        {
            this.hasTypeArgument(propertyOptions.typeArgument);
        }

        if (propertyOptions.preserveNull !== undefined)
        {
            this.shouldPreserveNull(propertyOptions.preserveNull);
        }

        if (propertyOptions.useDefaultValue !== undefined)
        {
            this.shouldUseDefaultValue(propertyOptions.useDefaultValue);
        }

        if (propertyOptions.useImplicitConversion !== undefined) 
        {
            this.shouldUseImplicitConversion(propertyOptions.useImplicitConversion);
        }

        return this;
    }
}
