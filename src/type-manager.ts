import { isArray, isNil, isUndefined, merge } from 'lodash';
import { Alias } from './alias';
import { Any } from './any';
import { TypeFactory } from './factories/type-factory';
import { jsonParse } from './functions/json-parse';
import { jsonStringify } from './functions/json-stringify';
import { GenericArgument } from './generic-argument';
import { SingletonInjector } from './injectors/singleton-injector';
import { Log } from './log';
import { LogLevel } from './log-level';
import { ReferenceCallback } from './reference-callback';
import { DefaultReferenceHandler } from './reference-handlers/default-reference-handler';
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
import { TypeConfiguration } from './type-configuration';
import { TypeFn } from './type-fn';
import { TypeLike } from './type-like';
import { TypeManagerOptions } from './type-manager-options';
import { TypeMetadata } from './type-metadata';
import { typeMetadataSymbol } from './type-metadata-symbol';
import { TypeOptions } from './type-options';
import { TypeOptionsBase } from './type-options-base';

/**
 * Type manager class.
 * 
 * @type {TypeManager}
 */
export class TypeManager
{
    /**
     * Static type manager instance which is used for decorator based configurations and
     * static declarative based configurations.
     *
     * @type {TypeManager}
     */
    public static readonly staticTypeManager: TypeManager = new TypeManager();

    /**
     * Static shared options of any type which applied to any instance of type manager
     * by default.
     * 
     * @type {TypeOptionsBase<any>}
     */
    public static readonly defaultTypeOptionsBase: TypeOptionsBase<any> = {
        discriminator: '$type',
        factory: new TypeFactory(),
        injector: new SingletonInjector(),
        log: new Log(LogLevel.Error),
        preserveDiscriminator: false,
        referenceHandler: new DefaultReferenceHandler(),
        serializer: new TypeSerializer(),
        preserveNull: true,
        useDefaultValue: false,
        useImplicitConversion: false,
        propertySorter: undefined,
        injectSorter: undefined
    };

    /**
     * Static type options per type which applied to any instance of type manager
     * by default.
     * 
     * @type {Map<TypeFn<any>, TypeOptions<any>>}
     */
    public static readonly defaultTypeOptionsMap: Map<TypeFn<any>, TypeOptions<any>> = new Map<TypeFn<any>, TypeOptions<any>>([
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
        [Uint32Array, { serializer: new Uint32ArraySerializer(), serializedDefaultValue: undefined, deserializedDefaultValue: undefined }]
    ]);

    /**
     * Type function map for types with aliases.
     * 
     * @type {Map<Alias, TypeFn<any>>}
     */
    public readonly typeFnMap: Map<Alias, TypeFn<any>> = new Map<Alias, TypeFn<any>>();

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
    public readonly typeManagerOptions: TypeManagerOptions;

    /**
     * Constructor.
     * 
     * Creating an instance of type manager allows to have multiple configs. By default only static 
     * instance of type manager is created on the background and all decorator based and declarative based
     * configurations are applied to it.
     * 
     * @param {TypeManagerOptions} typeManagerOptions Type manager options.
     */
    public constructor(typeManagerOptions: TypeManagerOptions = {})
    {
        this.symbol = Symbol(typeMetadataSymbol.description);
        this.typeManagerOptions = this.constructTypeManagerOptions(typeManagerOptions);

        this.configure(typeManagerOptions);

        return;
    }

    /**
     * Gets type options base in static context.
     * 
     * @returns {TypeOptionsBase<any>} Type options base.
     */
    public static get typeOptionsBase(): TypeOptionsBase<any>
    {
        return this.staticTypeManager.typeOptionsBase;
    }

    /**
     * Gets type options base.
     * 
     * @returns {TypeOptionsBase<any>} Type options base.
     */
    public get typeOptionsBase(): TypeOptionsBase<any>
    {
        let typeOptionsBase = this.typeManagerOptions.typeOptionsBase;

        if (isNil(typeOptionsBase))
        {
            typeOptionsBase = merge({}, TypeManager.defaultTypeOptionsBase);

            this.typeManagerOptions.typeOptionsBase = typeOptionsBase;
        }

        return typeOptionsBase as TypeOptionsBase<any>;
    }

    /**
     * Gets type options map in static context.
     * 
     * @returns {Map<TypeFn<any>, TypeOptions<any>>} Type options map.
     */
    public static get typeOptionsMap(): Map<TypeFn<any>, TypeOptions<any>>
    {
        return this.staticTypeManager.typeOptionsMap;
    }

    /**
     * Gets type options map.
     * 
     * @returns {Map<TypeFn<any>, TypeOptions<any>>} Type options map.
     */
    public get typeOptionsMap(): Map<TypeFn<any>, TypeOptions<any>>
    {
        let typeOptionsMap = this.typeManagerOptions.typeOptionsMap;

        if (isNil(typeOptionsMap))
        {
            typeOptionsMap = new Map<TypeFn<any>, TypeOptions<any>>(TypeManager.defaultTypeOptionsMap.entries());
            
            this.typeManagerOptions.typeOptionsMap = typeOptionsMap;
        }

        return typeOptionsMap;
    }

    /**
     * Gets type configuration map in static context.
     * 
     * @returns {Map<TypeFn<any>, TypeConfiguration<any>>} Type configuration map.
     */
    public static get typeConfigurationMap(): Map<TypeFn<any>, TypeConfiguration<any>>
    {
        return this.staticTypeManager.typeConfigurationMap;
    }

    /**
     * Gets type configuration map.
     * 
     * @returns {Map<TypeFn<any>, TypeConfiguration<any>>} Type configuration map.
     */
    public get typeConfigurationMap(): Map<TypeFn<any>, TypeConfiguration<any>>
    {
        let typeConfigurationMap = this.typeManagerOptions.typeConfigurationMap;

        if (isNil(typeConfigurationMap))
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

        if (isNil(typeOptionsBase))
        {
            typeOptionsBase = {};

            typeManagerOptions.typeOptionsBase = typeOptionsBase;
        }

        this.constructTypeOptionsBase(typeOptionsBase);

        let typeOptionsMap = typeManagerOptions.typeOptionsMap;

        if (isNil(typeOptionsMap))
        {
            typeOptionsMap = new Map<TypeFn<any>, TypeOptions<any>>();

            typeManagerOptions.typeOptionsMap = typeOptionsMap;
        }

        this.constructTypeOptionsMap(typeOptionsMap);

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
        const initialTypeOptionsBase = merge({}, TypeManager.defaultTypeOptionsBase, typeOptionsBase);

        merge(typeOptionsBase, initialTypeOptionsBase);

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

            if (isNil(mapTypeOptions))
            {
                mapTypeOptions = {};
            }

            initialTypeOptionsMap.set(typeFn, merge(mapTypeOptions, typeOptions));
        }

        for (const [typeFn, typeOptions] of typeOptionsMap)
        {
            let mapTypeOptions = initialTypeOptionsMap.get(typeFn);

            if (isNil(mapTypeOptions))
            {
                mapTypeOptions = {};
            }

            initialTypeOptionsMap.set(typeFn, merge(typeOptions, merge(mapTypeOptions, typeOptions)));
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
     * @param {TypeFn<TType>} typeFn Type function.
     * @param {TypeOptions<TType>} typeOptions Type options.
     * 
     * @returns {TypeMetadata<TType>} Type metadata for provided type function.
     */
    public static configureTypeMetadata<TType>(typeFn: TypeFn<TType>, typeOptions?: TypeOptions<TType>): TypeMetadata<TType>
    {
        return this.staticTypeManager.configureTypeMetadata(typeFn, typeOptions);
    }

    /**
     * Configures type metadata for provided type function.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * @param {TypeOptions<TType>} typeOptions Type options.
     * 
     * @returns {TypeMetadata<TType>} Type metadata for provided type function.
     */
    public configureTypeMetadata<TType>(typeFn: TypeFn<TType>, typeOptions?: TypeOptions<TType>): TypeMetadata<TType>
    {
        const symbol = this.symbol;
        const prototype = typeFn.prototype;
        const typeMetadataDefined = prototype.hasOwnProperty(symbol);
        const typeMetadata = typeMetadataDefined ? prototype[symbol] as TypeMetadata<TType> : this.declareTypeMetadata(typeFn);

        if (!typeMetadataDefined)
        {
            Object.defineProperty(prototype, symbol, {
                enumerable: false,
                configurable: false,
                writable: false,
                value: typeMetadata
            });
        }

        if (!isNil(typeOptions))
        {
            typeMetadata.configure(typeOptions);
        }

        return typeMetadata;
    }

    /**
     * Declares type metadata for provided type function based on general configuration.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * 
     * @returns {TypeMetadata<TType>} Type metadata.
     */
    private declareTypeMetadata<TType>(typeFn: TypeFn<TType>): TypeMetadata<TType>
    {
        let typeOptions = this.typeOptionsMap.get(typeFn);

        if (isNil(typeOptions))
        {
            typeOptions = {};

            this.typeOptionsMap.set(typeFn, typeOptions);
        }

        const symbol = this.symbol;
        const typeMetadataExtractor = this.extractTypeMetadata.bind(this);
        const typeFnMap = this.typeFnMap;
        const typeOptionsBase = this.typeOptionsBase;
        const parentPrototype = Object.getPrototypeOf(typeFn.prototype) ?? {};
        const parentTypeMetadata = parentPrototype[symbol];
        const typeMetadata = new TypeMetadata(typeMetadataExtractor, typeFnMap, typeFn, typeOptionsBase, typeOptions, parentTypeMetadata);

        return typeMetadata;
    }

    /**
     * Extracts type metadata from provided type function.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * 
     * @returns {TypeMetadata<TType>} Type metadata for provided type function.
     */
    private extractTypeMetadata<TType>(typeFn: TypeFn<TType>): TypeMetadata<TType>
    {
        const symbol = this.symbol;
        const prototype = typeFn.prototype;
        const typeMetadataDefined = prototype.hasOwnProperty(symbol);
        const typeMetadata = typeMetadataDefined ? prototype[symbol] as TypeMetadata<TType> : this.configureTypeMetadata(typeFn);

        return typeMetadata;
    }

    /**
     * Applies shared type options in static context.
     * 
     * @param {Partial<TypeOptionsBase<TType>>} typeOptionsBase Type options base.
     * 
     * @returns {TypeManager} Static instance of type manager.
     */
    public static applyTypeOptionsBase<TType>(typeOptionsBase: Partial<TypeOptionsBase<TType>>): TypeManager
    {
        return this.staticTypeManager.applyTypeOptionsBase(typeOptionsBase);
    }

    /**
     * Applies shared type options.
     * 
     * @param {Partial<TypeOptionsBase<TType>>} typeOptionsBase Type options base.
     * 
     * @returns {TypeManager} Instance of type manager.
     */
    public applyTypeOptionsBase<TType>(typeOptionsBase: Partial<TypeOptionsBase<TType>>): TypeManager
    {
        merge(this.typeOptionsBase, typeOptionsBase);

        return this;
    }

    /**
     * Applies type options map in static context.
     * 
     * @param {Map<TypeFn<TType>, TypeOptions<TType>>} typeOptionsMap Type options map.
     * 
     * @returns {TypeManager} Static instance of type manager.
     */
    public static applyTypeOptionsMap<TType>(typeOptionsMap: Map<TypeFn<TType>, TypeOptions<TType>>): TypeManager
    {
        return this.staticTypeManager.applyTypeOptionsMap(typeOptionsMap);
    }

    /**
     * Applies type options map.
     * 
     * @param {Map<TypeFn<TType>, TypeOptions<TType>>} typeOptionsMap Type options map.
     * 
     * @returns {TypeManager} Instance of type manager.
     */
    public applyTypeOptionsMap<TType>(typeOptionsMap: Map<TypeFn<TType>, TypeOptions<TType>>): TypeManager
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
     * @param {TypeFn<TType>} typeFn Type function.
     * @param {TypeOptions<TType>} typeOptions Type options.
     * 
     * @returns {TypeManager} Static instance of type manager.
     */
    public static applyTypeOptions<TType>(typeFn: TypeFn<TType>, typeOptions: TypeOptions<TType>): TypeManager
    {
        return this.staticTypeManager.applyTypeOptions(typeFn, typeOptions);
    }

    /**
     * Applies type options.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * @param {TypeOptions<TType>} typeOptions Type options.
     * 
     * @returns {TypeManager} Instance of type manager.
     */
    public applyTypeOptions<TType>(typeFn: TypeFn<TType>, typeOptions: TypeOptions<TType>): TypeManager
    {
        const typeMetadata = this.extractTypeMetadata(typeFn);

        typeMetadata.configure(typeOptions);

        return this;
    }

    /**
     * Applies type configuration map in static context.
     * 
     * @param {Map<TypeFn<TType>, TypeConfiguration<TType>>} typeConfigurationMap Type configuration map.
     * 
     * @returns {TypeManager} Static instance of type manager.
     */
    public static applyTypeConfigurationMap<TType>(typeConfigurationMap: Map<TypeFn<TType>, TypeConfiguration<TType>>): TypeManager
    {
        return this.staticTypeManager.applyTypeConfigurationMap(typeConfigurationMap);
    }

    /**
     * Applies type configuration map.
     * 
     * @param {Map<TypeFn<TType>, TypeConfiguration<TType>>} typeConfigurationMap Type configuration map.
     * 
     * @returns {TypeManager} Instance of type manager.
     */
    public applyTypeConfigurationMap<TType>(typeConfigurationMap: Map<TypeFn<TType>, TypeConfiguration<TType>>): TypeManager
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
     * @param {TypeFn<TType>} typeFn Type function.
     * @param {TypeConfiguration<TType>} typeConfiguration Type configuration.
     * 
     * @returns {TypeManager} Static instance of type manager.
     */
    public static applyTypeConfiguration<TType>(typeFn: TypeFn<TType>, typeConfiguration: TypeConfiguration<TType>): TypeManager
    {
        return this.staticTypeManager.applyTypeConfiguration(typeFn, typeConfiguration);
    }
    
    /**
     * Applies type configuration.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * @param {TypeConfiguration<TType>} typeConfiguration Type configuration.
     * 
     * @returns {TypeManager} Instance of type manager.
     */
    public applyTypeConfiguration<TType>(typeFn: TypeFn<TType>, typeConfiguration: TypeConfiguration<TType>): TypeManager
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
     * @returns {TypeManager} Instance of type manager.
     */
    public configure(typeManagerOptions: TypeManagerOptions): TypeManager
    {
        if (!isUndefined(typeManagerOptions.typeOptionsBase)) 
        {
            this.applyTypeOptionsBase(typeManagerOptions.typeOptionsBase);
        }

        if (!isUndefined(typeManagerOptions.typeOptionsMap)) 
        {
            this.applyTypeOptionsMap(typeManagerOptions.typeOptionsMap);
        }

        if (!isUndefined(typeManagerOptions.typeConfigurationMap)) 
        {
            this.applyTypeConfigurationMap(typeManagerOptions.typeConfigurationMap);
        }

        return this;
    }

    /**
     * Defines serializer context for x in static context.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * @param {any} x Some value.
     * @param {Array<GenericArgument<any>>} genericArguments Generic arguments.
     * 
     * @returns {SerializerContext<TType>} Serializer context.
     */
    public static defineSerializerContext<TType>(typeFn: TypeFn<TType>, x: any, genericArguments?: Array<GenericArgument<any>>): SerializerContext<TType>
    {
        return this.staticTypeManager.defineSerializerContext(typeFn, x, genericArguments);
    }

    /**
     * Defines serializer context for x.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * @param {any} x Some value.
     * @param {Array<GenericArgument<any>>} genericArguments Generic arguments.
     * 
     * @returns {SerializerContext<TType>} Serializer context.
     */
    public defineSerializerContext<TType>(typeFn: TypeFn<TType>, x: any, genericArguments?: Array<GenericArgument<any>>): SerializerContext<TType>
    {
        const typeMetadata = this.extractTypeMetadata(typeFn);
        const genericStructures = isNil(genericArguments) ? undefined : typeMetadata.defineGenericStructures(genericArguments);
        const genericMetadataResolvers = isNil(genericStructures) ? undefined : typeMetadata.defineGenericMetadataResolvers(genericStructures);
        
        return new SerializerContext(x, new Map<ReferenceKey, ReferenceValue>(), new Map<ReferenceKey, Array<ReferenceCallback>>(), 
        {
            jsonPathKey: '$',
            typeMetadata: typeMetadata,
            genericStructures: genericStructures,
            genericMetadataResolvers: genericMetadataResolvers
        });
    }
    
    /**
     * Serializes provided value based on the type in static context.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * @param {TypeLike<TType>} x Input value.
     * 
     * @returns {TypeLike<any>} Object created from provided input value or undefined. 
     */
    public static serialize<TType>(typeFn: TypeFn<TType>, x: undefined): any;
    public static serialize<TType>(typeFn: TypeFn<TType>, x: null): null;
    public static serialize<TType>(typeFn: TypeFn<TType>, x: Array<TType>): Array<any>;
    public static serialize<TType>(typeFn: TypeFn<TType>, x: TType): any;
    public static serialize<TType>(typeFn: TypeFn<TType>, x: TypeLike<TType | Array<TType>>): TypeLike<any>
    {
        return this.staticTypeManager.serialize(typeFn, x);
    }

    /**
     * Serializes provided value based on the type function.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * @param {TypeLike<TType>} x Input value.
     * 
     * @returns {TypeLike<any>} Object created from provided input value or undefined. 
     */
    public serialize<TType>(typeFn: TypeFn<TType>, x: undefined): any;
    public serialize<TType>(typeFn: TypeFn<TType>, x: null): null;
    public serialize<TType>(typeFn: TypeFn<TType>, x: Array<TType>): Array<any>;
    public serialize<TType>(typeFn: TypeFn<TType>, x: TType): any;
    public serialize<TType>(typeFn: TypeFn<TType>, x: TypeLike<TType | Array<TType>>): TypeLike<any>
    {
        const arrayFn = Array as TypeFn<Array<any>>;

        if (isArray(x) && typeFn !== arrayFn)
        {
            return this.defineSerializerContext(arrayFn, x, [typeFn]).serialize(x);
        }

        return this.defineSerializerContext(typeFn, x).serialize(x as any);
    }

    /**
     * Deserializes provided value based on the type function in static context.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * @param {TypeLike<any>} x Input value.
     *
     * @returns {TypeLike<TType>} Type created from provided input value or undefined.
     */
    public static deserialize<TType>(typeFn: TypeFn<TType>, x: undefined): any;
    public static deserialize<TType>(typeFn: TypeFn<TType>, x: null): null;
    public static deserialize<TType>(typeFn: TypeFn<TType>, x: Array<any>): Array<TType>;
    public static deserialize<TType>(typeFn: TypeFn<TType>, x: any): TType;
    public static deserialize<TType>(typeFn: TypeFn<TType>, x: TypeLike<any>): TypeLike<TType | Array<TType>>
    {
        return this.staticTypeManager.deserialize(typeFn, x);
    }

    /**
     * Deserializes provided value based on the type function.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * @param {TypeLike<any>} x Input value.
     *
     * @returns {TypeLike<TType>} Type created from provided input value or undefined.
     */
    public deserialize<TType>(typeFn: TypeFn<TType>, x: undefined): any;
    public deserialize<TType>(typeFn: TypeFn<TType>, x: null): null;
    public deserialize<TType>(typeFn: TypeFn<TType>, x: Array<any>): Array<TType>;
    public deserialize<TType>(typeFn: TypeFn<TType>, x: any): TType;
    public deserialize<TType>(typeFn: TypeFn<TType>, x: TypeLike<any>): TypeLike<TType | Array<TType>>
    {
        const arrayFn = Array as TypeFn<Array<any>>;

        if (isArray(x) && typeFn !== arrayFn)
        {
            return this.defineSerializerContext(arrayFn, x, [typeFn]).deserialize(x);
        }

        return this.defineSerializerContext(typeFn, x).deserialize(x as any);
    }

    /**
     * Converts provided value to a JavaScript Object Notation (JSON) string in static context.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * @param {any} x Input value, usually an object or array, to be converted.
     * @param {Function|Array<number>|Array<string>} replacer A function that transforms the results or an array of strings and numbers that acts as an approved list.
     * @param {string|number} space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
     * 
     * @returns {string} JSON string.
     */
    public static stringify<TType>(typeFn: TypeFn<TType>, x: any, replacer?: (this: any, key: string, value: any) => any | Array<number> | Array<string> | null, space?: string | number): string
    {
        return this.staticTypeManager.stringify(typeFn, x, replacer, space);
    }

    /**
     * Converts provided value to a JavaScript Object Notation (JSON) string.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * @param {any} x Input value, usually an object or array, to be converted.
     * @param {Function|Array<number>|Array<string>} replacer A function that transforms the results or an array of strings and numbers that acts as an approved list.
     * @param {string|number} space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
     * 
     * @returns {string} JSON string.
     */
    public stringify<TType>(typeFn: TypeFn<TType>, x: any, replacer?: (this: any, key: string, value: any) => any | Array<number> | Array<string> | null, space?: string | number): string
    {
        return jsonStringify(this.serialize(typeFn, x), replacer, space);
    }

    /**
     * Converts a JavaScript Object Notation (JSON) string into a type in static context.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * @param {string} x A valid JSON string.
     * @param {Function} reviver A function that transforms the results. This function is called for each member of the object.
     * 
     * @returns {TypeLike<TType>} Type created from provided input value or undefined.
     */
    public static parse<TType>(typeFn: TypeFn<TType>, x: string, reviver?: (this: any, key: string, value: any) => any): TypeLike<TType>
    {
        return this.staticTypeManager.parse(typeFn, x, reviver);
    }
    
    /**
     * Converts a JavaScript Object Notation (JSON) string into a type.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * @param {string} x A valid JSON string.
     * @param {Function} reviver A function that transforms the results. This function is called for each member of the object.
     * 
     * @returns {TypeLike<TType>} Type created from provided input value or undefined.
     */
    public parse<TType>(typeFn: TypeFn<TType>, x: string, reviver?: (this: any, key: string, value: any) => any): TypeLike<TType>
    {
        return this.deserialize(typeFn, jsonParse(x, reviver));
    }
}
