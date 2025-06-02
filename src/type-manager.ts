import { Alias } from './alias';
import { Any } from './any';
import { EMPTY_ARRAY } from './constants/empty-array';
import { CustomKey } from './custom-key';
import { CustomValue } from './custom-value';
import { TypeFactory } from './factories/type-factory';
import { jsonParse } from './functions/json-parse';
import { jsonStringify } from './functions/json-stringify';
import { GenericArgument } from './generic-argument';
import { InjectIndex } from './inject-index';
import { InjectOptions } from './inject-options';
import { SingletonInjector } from './injectors/singleton-injector';
import { Logger } from './logger';
import { LoggerLevel } from './logger-level';
import { PropertyName } from './property-name';
import { PropertyOptions } from './property-options';
import { ReferenceCallback } from './reference-callback';
import { CircularReferenceHandler } from './reference-handlers/circular-reference-handler';
import { ReferenceKey } from './reference-key';
import { ReferenceValue } from './reference-value';
import { SerializerContext } from './serializer-context';
import { AnySerializer } from './serializers/any-serializer';
import { ArrayBufferSerializer } from './serializers/array-buffer-serializer';
import { ArraySerializer } from './serializers/array-serializer';
import { BooleanSerializer } from './serializers/boolean-serializer';
import { DataViewSerializer } from './serializers/data-view-serializer';
import { DateSerializer } from './serializers/date-serializer';
import { Float32ArraySerializer } from './serializers/float-32-array-serializer';
import { Float64ArraySerializer } from './serializers/float-64-array-serializer';
import { Int16ArraySerializer } from './serializers/int-16-array-serializer';
import { Int32ArraySerializer } from './serializers/int-32-array-serializer';
import { Int8ArraySerializer } from './serializers/int-8-array-serializer';
import { MapSerializer } from './serializers/map-serializer';
import { NumberSerializer } from './serializers/number-serializer';
import { SetSerializer } from './serializers/set-serializer';
import { StringSerializer } from './serializers/string-serializer';
import { TypeSerializer } from './serializers/type-serializer';
import { Uint16ArraySerializer } from './serializers/uint-16-array-serializer';
import { Uint32ArraySerializer } from './serializers/uint-32-array-serializer';
import { Uint8ArraySerializer } from './serializers/uint-8-array-serializer';
import { Uint8ClampedArraySerializer } from './serializers/uint-8-clamped-array-serializer';
import { UnknownSerializer } from './serializers/unknown-serializer';
import { TypeConfiguration } from './type-configuration';
import { TypeFn } from './type-fn';
import { TypeLike } from './type-like';
import { TypeManagerOptions } from './type-manager-options';
import { TypeMetadata } from './type-metadata';
import { TYPE_METADATA_SYMBOL } from './type-metadata-symbol';
import { TypeOptions } from './type-options';
import { TypeOptionsBase } from './type-options-base';
import { TypeScope } from './type-scope';
import { Unknown } from './unknown';

/**
 * Type manager class.
 * 
 * @type {TypeManager}
 */
export class TypeManager
{
    /**
     * Static shared options of any type which applied to any instance of type manager
     * by default.
     * 
     * @type {TypeOptionsBase<any>}
     */
    private static readonly defaultTypeOptionsBase: TypeOptionsBase<any> = {
        customValueMap: new Map<CustomKey<any>, CustomValue>(),
        discriminator: '$type',
        factory: new TypeFactory(),
        injector: new SingletonInjector(),
        logger: new Logger(LoggerLevel.Error),
        preserveDiscriminator: false,
        referenceHandler: new CircularReferenceHandler(),
        serializer: new TypeSerializer(),
        preserveNull: true,
        useDefaultValue: false,
        useImplicitConversion: false
    };
    
    /**
     * Static type options per type which applied to any instance of type manager
     * by default.
     * 
     * @type {ReadonlyMap<TypeFn<any>, TypeOptions<any>>}
     */
    private static readonly defaultTypeOptionsMap: ReadonlyMap<TypeFn<any>, TypeOptions<any>> = new Map<TypeFn<any>, TypeOptions<any>>([
        [Any, { serializer: new AnySerializer(), serializedDefaultValue: undefined, deserializedDefaultValue: undefined }],
        [ArrayBuffer, { serializer: new ArrayBufferSerializer(), serializedDefaultValue: undefined, deserializedDefaultValue: undefined }],
        [Array, { serializer: new ArraySerializer(), serializedDefaultValue: () => [], deserializedDefaultValue: () => [] }],
        [Boolean, { serializer: new BooleanSerializer(), serializedDefaultValue: false, deserializedDefaultValue: false }],
        [DataView, { serializer: new DataViewSerializer(), serializedDefaultValue: undefined, deserializedDefaultValue: undefined }],
        [Date, { serializer: new DateSerializer(), serializedDefaultValue: undefined, deserializedDefaultValue: undefined }],
        [Float32Array, { serializer: new Float32ArraySerializer(), serializedDefaultValue: undefined, deserializedDefaultValue: undefined }],
        [Float64Array, { serializer: new Float64ArraySerializer(), serializedDefaultValue: undefined, deserializedDefaultValue: undefined }],
        [Int8Array, { serializer: new Int8ArraySerializer(), serializedDefaultValue: undefined, deserializedDefaultValue: undefined }],
        [Int16Array, { serializer: new Int16ArraySerializer(), serializedDefaultValue: undefined, deserializedDefaultValue: undefined }],
        [Int32Array, { serializer: new Int32ArraySerializer(), serializedDefaultValue: undefined, deserializedDefaultValue: undefined }],
        [Map, { serializer: new MapSerializer(), serializedDefaultValue: undefined, deserializedDefaultValue: undefined }],
        [Number, { serializer: new NumberSerializer(), serializedDefaultValue: 0, deserializedDefaultValue: 0 }],
        [Set, { serializer: new SetSerializer(), serializedDefaultValue: undefined, deserializedDefaultValue: undefined }],
        [String, { serializer: new StringSerializer(), serializedDefaultValue: undefined, deserializedDefaultValue: undefined }],
        [Uint8Array, { serializer: new Uint8ArraySerializer(), serializedDefaultValue: undefined, deserializedDefaultValue: undefined }],
        [Uint8ClampedArray, { serializer: new Uint8ClampedArraySerializer(), serializedDefaultValue: undefined, deserializedDefaultValue: undefined }],
        [Uint16Array, { serializer: new Uint16ArraySerializer(), serializedDefaultValue: undefined, deserializedDefaultValue: undefined }],
        [Uint32Array, { serializer: new Uint32ArraySerializer(), serializedDefaultValue: undefined, deserializedDefaultValue: undefined }],
        [Unknown, { serializer: new UnknownSerializer(), serializedDefaultValue: undefined, deserializedDefaultValue: undefined }]
    ]);

    /**
     * Static type manager instance which is used for decorator based configurations and
     * static declarative based configurations.
     *
     * @type {TypeManager}
     */
    public static readonly staticTypeManager: TypeManager = new TypeManager();

    /**
     * Type scope to work with registration in static context.
     * 
     * @type {TypeScope}
     */
    public static readonly typeScope: TypeScope = new TypeScope();

    /**
     * Symbol of current instance which is used to store type metadata within types.
     * 
     * @type {symbol}
     */
    public readonly symbol: symbol;

    /**
     * Type manager options.
     * 
     * @type {TypeManagerOptions}
     */
    private readonly typeManagerOptions: TypeManagerOptions;

    /**
     * Type function map for types with aliases.
     * 
     * @type {Map<Alias, TypeFn<any>>}
     */
    private readonly typeFnMap: Map<Alias, TypeFn<any>>;
    
    /**
     * Type metadata set for the current instance of type manager.
     * 
     * @type {Set<TypeMetadata<any>>}
     */
    private readonly typeMetadataSet: Set<TypeMetadata<any>>;
    
    /**
     * Constructor.
     * 
     * Creating an instance of type manager allows to have multiple configs. By default only static 
     * instance of type manager is created on the background and all decorator based and declarative based
     * configurations are applied to it. Note that all options which are passed to a constructor are
     * mutated and all references are kept. This allow to have different managers with intersected data.
     * If such behaviour is not required then use configure methods after creating instance of type manager.
     * 
     * @param {TypeManagerOptions} typeManagerOptions Type manager options.
     */
    public constructor(typeManagerOptions: TypeManagerOptions = {})
    {
        this.symbol = Symbol(TYPE_METADATA_SYMBOL.description);
        this.typeManagerOptions = this.constructTypeManagerOptions(typeManagerOptions);
        this.typeFnMap = new Map<Alias, TypeFn<any>>();
        this.typeMetadataSet = new Set<TypeMetadata<any>>();

        this.configure(typeManagerOptions);

        return;
    }

    /**
     * Gets symbol in static context.
     * 
     * @returns {symbol} Type manager symbol.
     */
    public static get symbol(): symbol
    {
        return this.staticTypeManager.symbol;
    }

    /**
     * Gets logger in static context.
     * 
     * @returns {Logger} Logger.
     */
    public static get logger(): Logger
    {
        return this.staticTypeManager.logger;
    }
    
    /**
     * Gets logger.
     * 
     * @returns {Logger} Logger.
     */
    public get logger(): Logger
    {
        return this.typeOptionsBase.logger;
    }

    /**
     * Gets type options base in static context.
     * 
     * @returns {Readonly<TypeOptionsBase<any>>} Type options base.
     */
    public static get typeOptionsBase(): Readonly<TypeOptionsBase<any>>
    {
        return this.staticTypeManager.typeOptionsBase;
    }

    /**
     * Gets type options base.
     * 
     * @returns {Readonly<TypeOptionsBase<any>>} Type options base.
     */
    public get typeOptionsBase(): Readonly<TypeOptionsBase<any>>
    {
        let typeOptionsBase = this.typeManagerOptions.typeOptionsBase;

        if (typeOptionsBase === undefined)
        {
            typeOptionsBase = {};

            this.typeManagerOptions.typeOptionsBase = this.constructTypeOptionsBase(typeOptionsBase);
        }

        return typeOptionsBase as TypeOptionsBase<any>;
    }

    /**
     * Gets type options map in static context.
     * 
     * @returns {ReadonlyMap<TypeFn<any>, TypeOptions<any>>} Type options map.
     */
    public static get typeOptionsMap(): ReadonlyMap<TypeFn<any>, TypeOptions<any>>
    {
        return this.staticTypeManager.typeOptionsMap;
    }

    /**
     * Gets type options map.
     * 
     * @returns {ReadonlyMap<TypeFn<any>, TypeOptions<any>>} Type options map.
     */
    public get typeOptionsMap(): ReadonlyMap<TypeFn<any>, TypeOptions<any>>
    {
        let typeOptionsMap = this.typeManagerOptions.typeOptionsMap;

        if (typeOptionsMap === undefined)
        {
            typeOptionsMap = new Map<TypeFn<any>, TypeOptions<any>>();

            this.typeManagerOptions.typeOptionsMap = this.constructTypeOptionsMap(typeOptionsMap);
        }

        return typeOptionsMap;
    }

    /**
     * Gets type configuration map in static context.
     * 
     * @returns {ReadonlyMap<TypeFn<any>, TypeConfiguration<any>>} Type configuration map.
     */
    public static get typeConfigurationMap(): ReadonlyMap<TypeFn<any>, TypeConfiguration<any>>
    {
        return this.staticTypeManager.typeConfigurationMap;
    }

    /**
     * Gets type configuration map.
     * 
     * @returns {ReadonlyMap<TypeFn<any>, TypeConfiguration<any>>} Type configuration map.
     */
    public get typeConfigurationMap(): ReadonlyMap<TypeFn<any>, TypeConfiguration<any>>
    {
        let typeConfigurationMap = this.typeManagerOptions.typeConfigurationMap;

        if (typeConfigurationMap === undefined)
        {
            typeConfigurationMap = new Map<TypeFn<any>, TypeConfiguration<any>>();

            this.typeManagerOptions.typeConfigurationMap = typeConfigurationMap;
        }

        return typeConfigurationMap;
    }

    /**
     * Constructs initial type manager options by extending passed options 
     * with default values if they are not overriden. All references are kept.
     * 
     * @param {TypeManagerOptions} typeManagerOptions Type manager options.
     * 
     * @returns {TypeManagerOptions} Constructed type manager options.
     */
    private constructTypeManagerOptions(typeManagerOptions: TypeManagerOptions): TypeManagerOptions
    {
        let typeOptionsBase = typeManagerOptions.typeOptionsBase;

        if (typeOptionsBase === undefined)
        {
            typeOptionsBase = {};

            typeManagerOptions.typeOptionsBase = this.constructTypeOptionsBase(typeOptionsBase);
        }

        let typeOptionsMap = typeManagerOptions.typeOptionsMap;

        if (typeOptionsMap === undefined)
        {
            typeOptionsMap = new Map<TypeFn<any>, TypeOptions<any>>();

            typeManagerOptions.typeOptionsMap = this.constructTypeOptionsMap(typeOptionsMap);
        }

        return typeManagerOptions;
    }

    /**
     * Constructs type options base.
     * 
     * @param {Partial<TypeOptionsBase<any>>} typeOptionsBase Type options base.
     * 
     * @returns {Partial<TypeOptionsBase<any>>} Constructed type options base.
     */
    private constructTypeOptionsBase(typeOptionsBase: Partial<TypeOptionsBase<any>>): Partial<TypeOptionsBase<any>>
    {
        const customValueMap = new Map<CustomKey<any>, CustomValue>();
        const initialTypeOptionsBase = Object.assign({}, TypeManager.defaultTypeOptionsBase, { customValueMap: customValueMap }, typeOptionsBase);
        
        Object.assign(typeOptionsBase, initialTypeOptionsBase);

        return typeOptionsBase;
    }

    /**
     * Constructs type options map.
     * 
     * @param {Map<TypeFn<any>, TypeOptions<any>>} typeOptionsMap Type options map.
     * 
     * @returns {Map<TypeFn<any>, TypeOptions<any>>} Constructed type options map.
     */
    private constructTypeOptionsMap(typeOptionsMap: Map<TypeFn<any>, TypeOptions<any>>): Map<TypeFn<any>, TypeOptions<any>>
    {
        const initialTypeOptionsMap = new Map<TypeFn<any>, TypeOptions<any>>();

        for (const [typeFn, typeOptions] of TypeManager.defaultTypeOptionsMap)
        {
            let mapTypeOptions = initialTypeOptionsMap.get(typeFn);

            if (mapTypeOptions === undefined)
            {
                mapTypeOptions = {};
            }

            initialTypeOptionsMap.set(typeFn, Object.assign(mapTypeOptions, typeOptions));
        }

        for (const [typeFn, typeOptions] of typeOptionsMap)
        {
            let mapTypeOptions = initialTypeOptionsMap.get(typeFn);

            if (mapTypeOptions === undefined)
            {
                mapTypeOptions = {};
            }

            initialTypeOptionsMap.set(typeFn, Object.assign(typeOptions, Object.assign(mapTypeOptions, typeOptions)));
        }

        typeOptionsMap.clear();

        for (const [typeFn, typeOptions] of initialTypeOptionsMap)
        {
            typeOptionsMap.set(typeFn, typeOptions);
        }

        return typeOptionsMap;
    }

    /**
     * Configures type metadata for provided type function in a static context.
     * 
     * @param {TypeFn<TObject>} typeFn Type function.
     * @param {TypeOptions<TObject>} typeOptions Type options.
     * 
     * @returns {TypeMetadata<TObject>} Type metadata for provided type function.
     */
    public static configureTypeMetadata<TObject>(typeFn: TypeFn<TObject>, typeOptions?: TypeOptions<TObject>): TypeMetadata<TObject>
    {
        return this.staticTypeManager.configureTypeMetadata(typeFn, typeOptions);
    }

    /**
     * Configures type metadata for provided type function.
     * 
     * @param {TypeFn<TObject>} typeFn Type function.
     * @param {TypeOptions<TObject>} typeOptions Type options.
     * 
     * @returns {TypeMetadata<TObject>} Type metadata for provided type function.
     */
    public configureTypeMetadata<TObject>(typeFn: TypeFn<TObject>, typeOptions?: TypeOptions<TObject>): TypeMetadata<TObject>
    {
        const symbol = this.symbol;
        const prototype = typeFn.prototype;
        const typeMetadataDefined = prototype.hasOwnProperty(symbol);
        const typeMetadata = typeMetadataDefined ? prototype[symbol] as TypeMetadata<TObject> : this.declareTypeMetadata(typeFn, typeOptions);

        if (!typeMetadataDefined)
        {
            Object.defineProperty(prototype, symbol, {
                enumerable: false,
                configurable: true,
                writable: false,
                value: typeMetadata
            });
        }

        if (typeMetadataDefined && typeOptions !== undefined)
        {
            typeMetadata.configure(typeOptions);
        }

        return typeMetadata;
    }

    /**
     * Declares type metadata for provided type function based on general configuration.
     * 
     * @param {TypeFn<TObject>} typeFn Type function.
     * @param {TypeOptions<TObject>} typeOptions Type options.
     * 
     * @returns {TypeMetadata<TObject>} Type metadata.
     */
    private declareTypeMetadata<TObject>(typeFn: TypeFn<TObject>, typeOptions?: TypeOptions<TObject>): TypeMetadata<TObject>
    {
        let typeOptionsMap = this.typeManagerOptions.typeOptionsMap;

        if (typeOptionsMap === undefined)
        {
            typeOptionsMap = new Map<TypeFn<any>, TypeOptions<any>>();

            this.typeManagerOptions.typeOptionsMap = this.constructTypeOptionsMap(typeOptionsMap);
        }

        let mapTypeOptions = typeOptionsMap.get(typeFn);

        if (mapTypeOptions === undefined)
        {
            mapTypeOptions = typeOptions ?? {};

            typeOptionsMap.set(typeFn, mapTypeOptions);
        }

        const typeFnMap = this.typeFnMap;
        const typeMetadataSet = this.typeMetadataSet;
        const symbol = this.symbol;
        const parentPrototype = Object.getPrototypeOf(typeFn.prototype) ?? {};
        const parentTypeMetadata = parentPrototype[symbol];
        const typeMetadata = new TypeMetadata(this, typeFnMap, typeMetadataSet, typeFn, mapTypeOptions, parentTypeMetadata);

        typeMetadataSet.add(typeMetadata);

        return typeMetadata;
    }

    /**
     * Extracts type metadata from provided type function in static context.
     * 
     * @param {TypeFn<TObject>} typeFn Type function.
     * 
     * @returns {TypeMetadata<TObject>} Type metadata for provided type function.
     */
    public static extractTypeMetadata<TObject>(typeFn: TypeFn<TObject>): TypeMetadata<TObject>
    {
        return this.staticTypeManager.extractTypeMetadata(typeFn);
    }

    /**
     * Extracts type metadata from provided type function.
     * 
     * @param {TypeFn<TObject>} typeFn Type function.
     * 
     * @returns {TypeMetadata<TObject>} Type metadata for provided type function.
     */
    public extractTypeMetadata<TObject>(typeFn: TypeFn<TObject>): TypeMetadata<TObject>
    {
        const symbol = this.symbol;
        const prototype = typeFn.prototype;
        const typeMetadataDefined = prototype.hasOwnProperty(symbol);
        const typeMetadata = typeMetadataDefined ? prototype[symbol] as TypeMetadata<TObject> : this.configureTypeMetadata(typeFn);

        return typeMetadata;
    }

    /**
     * Applies shared type options in static context.
     * 
     * @param {Partial<TypeOptionsBase<TObject>>} typeOptionsBase Type options base.
     * 
     * @returns {TypeManager} Static instance of type manager.
     */
    public static applyTypeOptionsBase<TObject>(typeOptionsBase: Partial<TypeOptionsBase<TObject>>): TypeManager
    {
        return this.staticTypeManager.applyTypeOptionsBase(typeOptionsBase);
    }
    
    /**
     * Applies shared type options.
     * 
     * @param {Partial<TypeOptionsBase<TObject>>} typeOptionsBase Type options base.
     * 
     * @returns {this} Instance of type manager.
     */
    public applyTypeOptionsBase<TObject>(typeOptionsBase: Partial<TypeOptionsBase<TObject>>): this
    {
        const customValueMap = this.typeOptionsBase.customValueMap;

        Object.assign(this.typeOptionsBase, typeOptionsBase, { customValueMap: customValueMap });

        if (typeOptionsBase.customValueMap !== undefined)
        {
            for (const [customKey, customValue] of typeOptionsBase.customValueMap)
            {
                customValueMap.set(customKey, customValue);
            }
        }

        for (const typeMetadata of this.typeMetadataSet)
        {
            typeMetadata.unresolveTypeState();
        }

        return this;
    }

    /**
     * Applies type options map in static context.
     * 
     * @param {Map<TypeFn<TObject>, TypeOptions<TObject>>} typeOptionsMap Type options map.
     * 
     * @returns {TypeManager} Static instance of type manager.
     */
    public static applyTypeOptionsMap<TObject>(typeOptionsMap: Map<TypeFn<TObject>, TypeOptions<TObject>>): TypeManager
    {
        return this.staticTypeManager.applyTypeOptionsMap(typeOptionsMap);
    }

    /**
     * Applies type options map.
     * 
     * @param {Map<TypeFn<TObject>, TypeOptions<TObject>>} typeOptionsMap Type options map.
     * 
     * @returns {this} Instance of type manager.
     */
    public applyTypeOptionsMap<TObject>(typeOptionsMap: Map<TypeFn<TObject>, TypeOptions<TObject>>): this
    {
        for (const [typeFn, typeOptions] of typeOptionsMap)
        {
            this.applyTypeOptions(typeFn, typeOptions);
        }

        return this;
    }

    /**
     * Applies type options in static context.
     * 
     * @param {TypeFn<TObject>} typeFn Type function.
     * @param {TypeOptions<TObject>} typeOptions Type options.
     * 
     * @returns {TypeManager} Static instance of type manager.
     */
    public static applyTypeOptions<TObject>(typeFn: TypeFn<TObject>, typeOptions: TypeOptions<TObject>): TypeManager
    {
        return this.staticTypeManager.applyTypeOptions(typeFn, typeOptions);
    }

    /**
     * Applies type options.
     * 
     * @param {TypeFn<TObject>} typeFn Type function.
     * @param {TypeOptions<TObject>} typeOptions Type options.
     * 
     * @returns {this} Instance of type manager.
     */
    public applyTypeOptions<TObject>(typeFn: TypeFn<TObject>, typeOptions: TypeOptions<TObject>): this
    {
        const typeMetadata = this.extractTypeMetadata(typeFn);

        typeMetadata.configure(typeOptions);

        return this;
    }

    /**
     * Applies type configuration map in static context.
     * 
     * @param {Map<TypeFn<TObject>, TypeConfiguration<TObject>>} typeConfigurationMap Type configuration map.
     * 
     * @returns {TypeManager} Static instance of type manager.
     */
    public static applyTypeConfigurationMap<TObject>(typeConfigurationMap: Map<TypeFn<TObject>, TypeConfiguration<TObject>>): TypeManager
    {
        return this.staticTypeManager.applyTypeConfigurationMap(typeConfigurationMap);
    }

    /**
     * Applies type configuration map.
     * 
     * @param {Map<TypeFn<TObject>, TypeConfiguration<TObject>>} typeConfigurationMap Type configuration map.
     * 
     * @returns {this} Instance of type manager.
     */
    public applyTypeConfigurationMap<TObject>(typeConfigurationMap: Map<TypeFn<TObject>, TypeConfiguration<TObject>>): this
    {
        for (const [typeFn, typeConfiguration] of typeConfigurationMap)
        {
            this.applyTypeConfiguration(typeFn, typeConfiguration);
        }
        
        return this;
    }

    /**
     * Applies type configuration in static context.
     * 
     * @param {TypeFn<TObject>} typeFn Type function.
     * @param {TypeConfiguration<TObject>} typeConfiguration Type configuration.
     * 
     * @returns {TypeManager} Static instance of type manager.
     */
    public static applyTypeConfiguration<TObject>(typeFn: TypeFn<TObject>, typeConfiguration: TypeConfiguration<TObject>): TypeManager
    {
        return this.staticTypeManager.applyTypeConfiguration(typeFn, typeConfiguration);
    }
    
    /**
     * Applies type configuration.
     * 
     * @param {TypeFn<TObject>} typeFn Type function.
     * @param {TypeConfiguration<TObject>} typeConfiguration Type configuration.
     * 
     * @returns {this} Instance of type manager.
     */
    public applyTypeConfiguration<TObject>(typeFn: TypeFn<TObject>, typeConfiguration: TypeConfiguration<TObject>): this
    {
        const typeMetadata = this.extractTypeMetadata(typeFn);

        typeConfiguration.configure(typeMetadata);

        return this;
    }

    /**
     * Configures type manager in static context.
     * 
     * @param {TypeManagerOptions} typeManagerOptions Type manager options.
     * 
     * @returns {TypeManager} Static instance of type manager.
     */
    public static configure(typeManagerOptions: TypeManagerOptions): TypeManager
    {
        return this.staticTypeManager.configure(typeManagerOptions);
    }

    /**
     * Configures type manager.
     * 
     * @param {TypeManagerOptions} typeManagerOptions Type manager options.
     * 
     * @returns {this} Instance of type manager.
     */
    public configure(typeManagerOptions: TypeManagerOptions): this
    {
        if (typeManagerOptions.typeOptionsBase !== undefined) 
        {
            this.applyTypeOptionsBase(typeManagerOptions.typeOptionsBase);
        }

        if (typeManagerOptions.typeOptionsMap !== undefined) 
        {
            this.applyTypeOptionsMap(typeManagerOptions.typeOptionsMap);
        }

        if (typeManagerOptions.typeConfigurationMap !== undefined) 
        {
            this.applyTypeConfigurationMap(typeManagerOptions.typeConfigurationMap);
        }

        return this;
    }

    /**
     * Defines serializer context for x in static context.
     * 
     * @param {TypeFn<TObject>} typeFn Type function.
     * @param {any} x Some value.
     * @param {Array<GenericArgument<any>>} genericArguments Generic arguments.
     * 
     * @returns {SerializerContext<TObject>} Serializer context.
     */
    public static defineSerializerContext<TObject>(typeFn: TypeFn<TObject>, x: any, genericArguments?: Array<GenericArgument<any>>): SerializerContext<TObject>
    {
        return this.staticTypeManager.defineSerializerContext(typeFn, x, genericArguments);
    }

    /**
     * Defines serializer context for x.
     * 
     * @param {TypeFn<TObject>} typeFn Type function.
     * @param {any} x Some value.
     * @param {Array<GenericArgument<any>>} genericArguments Generic arguments.
     * 
     * @returns {SerializerContext<TObject>} Serializer context.
     */
    public defineSerializerContext<TObject>(typeFn: TypeFn<TObject>, x: any, genericArguments?: Array<GenericArgument<any>>): SerializerContext<TObject>
    {
        const typeMetadata = this.extractTypeMetadata(typeFn);
        const genericMetadatas = genericArguments === undefined ? EMPTY_ARRAY : typeMetadata.resolveGenericMetadatas(genericArguments);
        
        return new SerializerContext(
            x,
            new Map<ReferenceKey, ReferenceValue>(), 
            new Map<ReferenceKey, Array<ReferenceCallback>>(),
            undefined,
            '$',
            typeMetadata.typeState,
            genericMetadatas,
            undefined,
            undefined
        );
    }

    /**
     * Create a new clone of the static type manager. This method returns a shallow 
     * copy, preserving its current configuration and registered types.
     * 
     * @returns {TypeManager} A new instance that duplicates the static type manager.
     */
    public static clone(): TypeManager
    {
        return this.staticTypeManager.clone();
    }

    /**
     * Create a new clone of this type manager instance. The clone will contain 
     * copies of this instance base options and mappings, but will be completely 
     * independent: subsequent changes on the clone or the original will not affect 
     * each other.
     * 
     * @returns {TypeManager} A fresh type manager instance with the same configuration and registered types.
     */
    public clone(): TypeManager
    {
        const typeOptionsBase = this.cloneTypeOptionsBase();
        const typeOptionsMap = this.cloneTypeOptionsMap();
        const typeManagerOptions = { typeOptionsBase: typeOptionsBase, typeOptionsMap: typeOptionsMap };
        const typeManager = new TypeManager(typeManagerOptions);

        return typeManager;
    }

    /**
     * Creates a clone of type options base.
     * 
     * @returns {TypeOptionsBase<any>} Type options base clone.
     */
    private cloneTypeOptionsBase(): TypeOptionsBase<any>
    {
        const typeOptionsBase = this.typeOptionsBase;
        const customValueMap = typeOptionsBase.customValueMap;
        const customValueMapClone = new Map<CustomKey<any>, CustomValue>();
        const typeOptionsBaseClone = Object.assign({}, typeOptionsBase, { customValueMap: customValueMapClone });

        for (const [customKey, customValue] of customValueMap)
        {
            customValueMapClone.set(customKey, customValue);
        }

        return typeOptionsBaseClone;
    }

    /**
     * Creates a clone of type options map.
     * 
     * @returns {Map<TypeFn<any>, TypeOptions<any>>} Type options map clone.
     */
    private cloneTypeOptionsMap(): Map<TypeFn<any>, TypeOptions<any>>
    {
        const typeOptionsMap = this.typeOptionsMap;
        const typeOptionsMapClone = new Map<TypeFn<any>, TypeOptions<any>>();

        for (const [typeFn, typeOptions] of typeOptionsMap)
        {
            const typeOptionsClone = Object.assign({}, typeOptions);
            const typeCustomValueMap = typeOptions.customValueMap;

            if (typeCustomValueMap !== undefined)
            {
                const typeCustomValueMapClone = new Map<CustomKey<any>, CustomValue>();

                for (const [customKey, customValue] of typeCustomValueMap)
                {
                    typeCustomValueMapClone.set(customKey, customValue);
                }

                typeOptionsClone.customValueMap = typeCustomValueMapClone;
            }

            const propertyOptionsMap = typeOptions.propertyOptionsMap;

            if (propertyOptionsMap !== undefined)
            {
                const propertyOptionsMapClone = new Map<PropertyName, PropertyOptions<any>>();

                for (const [propertyName, propertyOptions] of propertyOptionsMap)
                {
                    const propertyOptionsClone = Object.assign({}, propertyOptions);
                    const propertyCustomValueMap = propertyOptions.customValueMap;

                    if (propertyCustomValueMap !== undefined)
                    {
                        const propertyCustomValueMapClone = new Map<CustomKey<any>, CustomValue>();

                        for (const [customKey, customValue] of propertyCustomValueMap)
                        {
                            propertyCustomValueMapClone.set(customKey, customValue);
                        }

                        propertyOptionsClone.customValueMap = propertyCustomValueMapClone;
                    }

                    propertyOptionsMapClone.set(propertyName, propertyOptionsClone);
                }

                typeOptionsClone.propertyOptionsMap = propertyOptionsMapClone;
            }

            const injectOptionsMap = typeOptions.injectOptionsMap;

            if (injectOptionsMap !== undefined)
            {
                const injectOptionsMapClone = new Map<InjectIndex, InjectOptions<any>>();

                for (const [injectIndex, injectOptions] of injectOptionsMap)
                {
                    const injectOptionsClone = Object.assign({}, injectOptions);

                    injectOptionsMapClone.set(injectIndex, injectOptionsClone);
                }

                typeOptionsClone.injectOptionsMap = injectOptionsMapClone;
            }

            typeOptionsMapClone.set(typeFn, typeOptionsClone);
        }

        return typeOptionsMapClone;
    }

    /**
     * Clears all type registrations from the static type manager. After calling this 
     * method, the static type manager will no longer hold any registered type metadata.
     * 
     * @returns {TypeManager} Static instance of type manager.
     */
    public static clear(): TypeManager
    {
        return this.staticTypeManager.clear();
    }

    /**
     * Clears all type registrations from the type manager. After calling this 
     * method, the type manager will no longer hold any registered type metadata.
     * 
     * @returns {this} Instance of type manager.
     */
    public clear(): this
    {
        const symbol = this.symbol;
        const typeFnMap = this.typeFnMap;
        const typeMetadataSet = this.typeMetadataSet;

        for (const typeMetadata of typeMetadataSet)
        {
            const prototype = typeMetadata.typeFn.prototype ?? {};

            delete prototype[symbol];
        }
        
        typeMetadataSet.clear();
        typeFnMap.clear();

        return this;
    }

    /**
     * Serializes provided value based on the type in static context.
     * 
     * @param {TypeFn<TObject>} typeFn Type function.
     * @param {TypeLike<TObject>} x Input value.
     * 
     * @returns {TypeLike<any>} Object created from provided input value or undefined. 
     */
    public static serialize<TObject>(typeFn: TypeFn<TObject>, x: undefined): any;
    public static serialize<TObject>(typeFn: TypeFn<TObject>, x: null): null;
    public static serialize<TObject>(typeFn: TypeFn<TObject>, x: Array<TObject>): Array<any>;
    public static serialize<TObject>(typeFn: TypeFn<TObject>, x: TObject): any;
    public static serialize<TObject>(typeFn: TypeFn<TObject>, x: TypeLike<TObject | Array<TObject>>): TypeLike<any>
    {
        return this.staticTypeManager.serialize(typeFn, x);
    }

    /**
     * Serializes provided value based on the type function.
     * 
     * @param {TypeFn<TObject>} typeFn Type function.
     * @param {TypeLike<TObject>} x Input value.
     * 
     * @returns {TypeLike<any>} Object created from provided input value or undefined. 
     */
    public serialize<TObject>(typeFn: TypeFn<TObject>, x: undefined): any;
    public serialize<TObject>(typeFn: TypeFn<TObject>, x: null): null;
    public serialize<TObject>(typeFn: TypeFn<TObject>, x: Array<TObject>): Array<any>;
    public serialize<TObject>(typeFn: TypeFn<TObject>, x: TObject): any;
    public serialize<TObject>(typeFn: TypeFn<TObject>, x: TypeLike<TObject | Array<TObject>>): TypeLike<any>
    {
        const arrayFn = Array as TypeFn<any>;

        if (Array.isArray(x) && typeFn !== arrayFn)
        {
            return this.defineSerializerContext(arrayFn, x, [typeFn]).serialize(x);
        }

        return this.defineSerializerContext(typeFn, x).serialize(x as any);
    }

    /**
     * Deserializes provided value based on the type function in static context.
     * 
     * @param {TypeFn<TObject>} typeFn Type function.
     * @param {TypeLike<any>} x Input value.
     *
     * @returns {TypeLike<TObject>} Type created from provided input value or undefined.
     */
    public static deserialize<TObject>(typeFn: TypeFn<TObject>, x: undefined): any;
    public static deserialize<TObject>(typeFn: TypeFn<TObject>, x: null): null;
    public static deserialize<TObject>(typeFn: TypeFn<TObject>, x: Array<any>): Array<TObject>;
    public static deserialize<TObject>(typeFn: TypeFn<TObject>, x: any): TObject;
    public static deserialize<TObject>(typeFn: TypeFn<TObject>, x: TypeLike<any>): TypeLike<TObject | Array<TObject>>
    {
        return this.staticTypeManager.deserialize(typeFn, x);
    }

    /**
     * Deserializes provided value based on the type function.
     * 
     * @param {TypeFn<TObject>} typeFn Type function.
     * @param {TypeLike<any>} x Input value.
     *
     * @returns {TypeLike<TObject>} Type created from provided input value or undefined.
     */
    public deserialize<TObject>(typeFn: TypeFn<TObject>, x: undefined): any;
    public deserialize<TObject>(typeFn: TypeFn<TObject>, x: null): null;
    public deserialize<TObject>(typeFn: TypeFn<TObject>, x: Array<any>): Array<TObject>;
    public deserialize<TObject>(typeFn: TypeFn<TObject>, x: any): TObject;
    public deserialize<TObject>(typeFn: TypeFn<TObject>, x: TypeLike<any>): TypeLike<TObject | Array<TObject>>
    {
        const arrayFn = Array as TypeFn<any>;

        if (Array.isArray(x) && typeFn !== arrayFn)
        {
            return this.defineSerializerContext(arrayFn, x, [typeFn]).deserialize(x);
        }

        return this.defineSerializerContext(typeFn, x).deserialize(x as any);
    }

    /**
     * Converts provided value to a JavaScript Object Notation (JSON) string in static context.
     * 
     * @param {TypeFn<TObject>} typeFn Type function.
     * @param {any} x Input value, usually an object or array, to be converted.
     * @param {Function|Array<number>|Array<string>} replacer A function that transforms the results or an array of strings and numbers that acts as an approved list.
     * @param {string|number} space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
     * 
     * @returns {string} JSON string.
     */
    public static stringify<TObject>(typeFn: TypeFn<TObject>, x: any, replacer?: (this: any, key: string, value: any) => any | Array<number> | Array<string> | null, space?: string | number): string
    {
        return this.staticTypeManager.stringify(typeFn, x, replacer, space);
    }

    /**
     * Converts provided value to a JavaScript Object Notation (JSON) string.
     * 
     * @param {TypeFn<TObject>} typeFn Type function.
     * @param {any} x Input value, usually an object or array, to be converted.
     * @param {Function|Array<number>|Array<string>} replacer A function that transforms the results or an array of strings and numbers that acts as an approved list.
     * @param {string|number} space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
     * 
     * @returns {string} JSON string.
     */
    public stringify<TObject>(typeFn: TypeFn<TObject>, x: any, replacer?: (this: any, key: string, value: any) => any | Array<number> | Array<string> | null, space?: string | number): string
    {
        return jsonStringify(this.serialize(typeFn, x), replacer, space);
    }

    /**
     * Converts a JavaScript Object Notation (JSON) string into a type in static context.
     * 
     * @param {TypeFn<TObject>} typeFn Type function.
     * @param {string} x A valid JSON string.
     * @param {Function} reviver A function that transforms the results. This function is called for each member of the object.
     * 
     * @returns {TypeLike<TObject>} Type created from provided input value or undefined.
     */
    public static parse<TObject>(typeFn: TypeFn<TObject>, x: string, reviver?: (this: any, key: string, value: any) => any): TypeLike<TObject>
    {
        return this.staticTypeManager.parse(typeFn, x, reviver);
    }
    
    /**
     * Converts a JavaScript Object Notation (JSON) string into a type.
     * 
     * @param {TypeFn<TObject>} typeFn Type function.
     * @param {string} x A valid JSON string.
     * @param {Function} reviver A function that transforms the results. This function is called for each member of the object.
     * 
     * @returns {TypeLike<TObject>} Type created from provided input value or undefined.
     */
    public parse<TObject>(typeFn: TypeFn<TObject>, x: string, reviver?: (this: any, key: string, value: any) => any): TypeLike<TObject>
    {
        return this.deserialize(typeFn, jsonParse(x, reviver));
    }
}
