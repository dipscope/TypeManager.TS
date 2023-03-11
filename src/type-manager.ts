import { isArray, isNil, isString, isUndefined, merge } from 'lodash';
import { Alias } from './alias';
import { TypeFactory } from './factories/type-factory';
import { isArrowFunction } from './functions/is-arrow-function';
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
import { TypeArgument } from './type-argument';
import { TypeConfiguration } from './type-configuration';
import { TypeFn } from './type-fn';
import { TypeLike } from './type-like';
import { TypeManagerOptions } from './type-manager-options';
import { TypeMetadata } from './type-metadata';
import { typeMetadataSymbol } from './type-metadata-symbol';
import { TypeOptions } from './type-options';
import { TypeOptionsBase } from './type-options-base';

/**
 * Type manager class for external usage.
 * 
 * @type {TypeManager<TType>}
 */
export class TypeManager<TType>
{
    /**
     * Static global options of any type.
     * 
     * @type {TypeOptionsBase<any>}
     */
    public static readonly typeOptionsBase: TypeOptionsBase<any> = {
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
        propertyMetadataSorter: undefined,
        injectMetadataSorter: undefined
    };
    
    /**
     * Static type options per type. 
     * 
     * Overrides static global type options.
     * 
     * @type {Map<TypeFn<any>, TypeOptions<any>>}
     */
    public static readonly typeOptionsMap: Map<TypeFn<any>, TypeOptions<any>> = new Map<TypeFn<any>, TypeOptions<any>>([
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
     * Static type function map for types with aliases.
     * 
     * @type {Map<Alias, TypeFn<any>>}
     */
    public static readonly typeFnMap: Map<Alias, TypeFn<any>> = new Map<Alias, TypeFn<any>>();

    /**
     * Type function provided to the type manager.
     * 
     * @type {TypeFn<TType>}
     */
    public readonly typeFn: TypeFn<TType>;

    /**
     * Type metadata for provided type function.
     * 
     * @type {TypeMetadata<TType>}
     */
    public readonly typeMetadata: TypeMetadata<TType>;

    /**
     * Type manager options.
     * 
     * @type {TypeManagerOptions}
     */
    public readonly typeManagerOptions: TypeManagerOptions;

    /**
     * Type options base of current instance.
     * 
     * @type {TypeOptionsBase<any>}
     */
    public readonly typeOptionsBase: TypeOptionsBase<any>;

    /**
     * Type options map of current instance.
     * 
     * @type {Map<TypeFn<any>, TypeOptions<any>>}
     */
    public readonly typeOptionsMap: Map<TypeFn<any>, TypeOptions<any>> = new Map<TypeFn<any>, TypeOptions<any>>();

    /**
     * Type function map for types with aliases of current instance.
     * 
     * @type {Map<Alias, TypeFn<any>>}
     */
    public readonly typeFnMap: Map<Alias, TypeFn<any>> = new Map<Alias, TypeFn<any>>();

    /**
     * Type metadata map of current instance.
     * 
     * @type {Map<TypeFn<any>, TypeMetadata<any>>}
     */
    public readonly typeMetadataMap: Map<TypeFn<any>, TypeMetadata<any>> = new Map<TypeFn<any>, TypeMetadata<any>>();

    /**
     * Constructor.
     * 
     * Creating an instance of type manager is a heavy operation as it preserves a configuration state.
     * If you don't modify any of type manager options at runtime it is better to use static methods.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * @param {TypeManagerOptions} typeManagerOptions Type manager options.
     */
    public constructor(typeFn: TypeFn<TType>, typeManagerOptions?: TypeManagerOptions)
    {
        this.typeFn = typeFn;
        this.typeManagerOptions = typeManagerOptions ?? {};
        this.typeOptionsBase = this.buildTypeOptionsBase();
        this.typeOptionsMap = this.buildTypeOptionsMap();
        this.typeMetadata = this.extractTypeMetadata(typeFn);

        return;
    }

    /**
     * Declares type metadata for provided type function based on general configuration.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * 
     * @returns {TypeMetadata<TType>} Type metadata.
     */
    private static declareTypeMetadata<TType>(typeFn: TypeFn<TType>): TypeMetadata<TType>
    {
        let typeOptions = this.typeOptionsMap.get(typeFn);

        if (isNil(typeOptions))
        {
            typeOptions = {};

            this.typeOptionsMap.set(typeFn, typeOptions);
        }

        const typeMetadataResolver = this.resolveTypeMetadata.bind(this);
        const typeFnMap = this.typeFnMap;
        const typeOptionsBase = this.typeOptionsBase;
        const parentPrototype = Object.getPrototypeOf(typeFn.prototype) ?? {};
        const parentTypeMetadata = parentPrototype[typeMetadataSymbol];
        const typeMetadata = new TypeMetadata(typeMetadataResolver, typeFn, typeFnMap, typeOptionsBase, typeOptions, parentTypeMetadata);

        return typeMetadata;
    }

    /**
     * Configures type metadata for the type prototype.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * @param {TypeOptions<TType>} typeOptions Type options.
     * 
     * @returns {TypeMetadata<TType>} Type metadata for provided type function.
     */
    public static configureTypeMetadata<TType>(typeFn: TypeFn<TType>, typeOptions?: TypeOptions<TType>): TypeMetadata<TType>
    {
        const prototype = typeFn.prototype;
        const metadataDefined = prototype.hasOwnProperty(typeMetadataSymbol);
        const typeMetadata = metadataDefined ? prototype[typeMetadataSymbol] as TypeMetadata<TType> : this.declareTypeMetadata(typeFn);

        if (!metadataDefined)
        {
            Object.defineProperty(prototype, typeMetadataSymbol, {
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
     * Extracts type metadata from provided type function.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * 
     * @returns {TypeMetadata<TType>} Type metadata for provided type function.
     */
    public static extractTypeMetadata<TType>(typeFn: TypeFn<TType>): TypeMetadata<TType>
    {
        const prototype = typeFn.prototype;
        const metadataDefined = prototype.hasOwnProperty(typeMetadataSymbol);
        const typeMetadata = metadataDefined ? prototype[typeMetadataSymbol] as TypeMetadata<TType> : this.configureTypeMetadata(typeFn);

        return typeMetadata;
    }

    /**
     * Resolves type metadata by provided type argument.
     * 
     * @type {TypeMetadata<any>} Type metadata for provided type argument.
     */
    private static resolveTypeMetadata<TType>(typeArgument: TypeArgument<TType>): TypeMetadata<TType>
    {
        const typeFn = isString(typeArgument) ? this.typeFnMap.get(typeArgument) : (isArrowFunction(typeArgument) ? typeArgument() : typeArgument);

        if (isNil(typeFn))
        {
            throw new Error(`Cannot resolve type metadata for provided type argument: ${jsonStringify(typeArgument)}. This is usually caused by invalid configuration.`);
        }

        return this.extractTypeMetadata(typeFn);
    }

    /**
     * Configures static global type options.
     * 
     * @param {Partial<TypeOptionsBase<TType>>} typeOptionsBase Type options base.
     * 
     * @returns {typeof TypeManager} Static instance of type manager.
     */
    public static configureTypeOptionsBase<TType>(typeOptionsBase: Partial<TypeOptionsBase<TType>>): typeof TypeManager
    {
        merge(this.typeOptionsBase, typeOptionsBase);

        return this;
    }

    /**
     * Configures static type options.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * @param {TypeOptions<TType>} typeOptions Type options.
     * 
     * @returns {typeof TypeManager} Static instance of type manager.
     */
    public static configureTypeOptions<TType>(typeFn: TypeFn<TType>, typeOptions: TypeOptions<TType>): typeof TypeManager
    {
        this.configureTypeMetadata(typeFn, typeOptions);

        return this;
    }

    /**
     * Configures static type options map.
     * 
     * @param {Map<TypeFn<TType>, TypeOptions<TType>>} typeOptionsMap Type options map.
     * 
     * @returns {typeof TypeManager} Static instance of type manager.
     */
    public static configureTypeOptionsMap<TType>(typeOptionsMap: Map<TypeFn<TType>, TypeOptions<TType>>): typeof TypeManager
    {
        for (const [typeFn, typeOptions] of typeOptionsMap)
        {
            this.configureTypeOptions(typeFn, typeOptions);
        }

        return this;
    }

    /**
     * Configures type manager in static context.
     * 
     * @param {TypeManagerOptions} typeManagerOptions Type manager options.
     * 
     * @returns {typeof TypeManager} Static instance of type manager.
     */
    public static configure(typeManagerOptions: TypeManagerOptions): typeof TypeManager
    {
        if (!isUndefined(typeManagerOptions.typeOptionsBase)) 
        {
            this.configureTypeOptionsBase(typeManagerOptions.typeOptionsBase);
        }

        if (!isUndefined(typeManagerOptions.typeOptionsMap)) 
        {
            this.configureTypeOptionsMap(typeManagerOptions.typeOptionsMap);
        }

        return this;
    }

    /**
     * Applies type configuration in static context.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * @param {TypeConfiguration<TType>} typeConfiguration Type configuration.
     * 
     * @returns {typeof TypeManager} Static instance of type manager.
     */
    public static applyTypeConfiguration<TType>(typeFn: TypeFn<TType>, typeConfiguration: TypeConfiguration<TType>): typeof TypeManager
    {
        const typeMetadata = this.extractTypeMetadata(typeFn);

        typeConfiguration.configure(typeMetadata);

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
    private static defineSerializerContext<TType>(typeFn: TypeFn<TType>, x: any, genericArguments?: Array<GenericArgument<any>>): SerializerContext<TType>
    {
        return new SerializerContext(x, new WeakMap<ReferenceKey, ReferenceValue>(), new WeakMap<ReferenceKey, Array<ReferenceCallback>>(), 
        {
            jsonPathKey: '$',
            typeMetadata: this.extractTypeMetadata(typeFn),
            genericArguments: genericArguments
        });
    }

    /**
     * Serializes provided value based on the type function.
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
        const arrayFn = Array as TypeFn<any[]>;

        if (isArray(x) && typeFn !== arrayFn)
        {
            return this.defineSerializerContext(arrayFn, x, [typeFn]).serialize(x);
        }

        return this.defineSerializerContext(typeFn, x).serialize(x as any);
    }

    /**
     * Deserializes provided value based on the type function.
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
        const arrayFn = Array as TypeFn<any[]>;

        if (isArray(x) && typeFn !== arrayFn)
        {
            return this.defineSerializerContext(arrayFn, x, [typeFn]).deserialize(x);
        }

        return this.defineSerializerContext(typeFn, x).deserialize(x as any);
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
    public static stringify<TType>(typeFn: TypeFn<TType>, x: any, replacer?: (this: any, key: string, value: any) => any | Array<number> | Array<string> | null, space?: string | number): string
    {
        return jsonStringify(this.serialize(typeFn, x), replacer, space);
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
    public static parse<TType>(typeFn: TypeFn<TType>, x: string, reviver?: (this: any, key: string, value: any) => any): TypeLike<TType>
    {
        return this.deserialize(typeFn, jsonParse(x, reviver));
    }

    /**
     * Declares type metadata for provided type function.
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

        const typeMetadataResolver = this.resolveTypeMetadata.bind(this);
        const typeFnMap = this.typeFnMap;
        const typeOptionsBase = this.typeOptionsBase;
        const parentPrototype = Object.getPrototypeOf(typeFn.prototype) ?? {};
        const parentTypeMetadata = this.typeMetadataMap.get(parentPrototype.constructor);
        const typeMetadata = new TypeMetadata(typeMetadataResolver, typeFn, typeFnMap, typeOptionsBase, typeOptions, parentTypeMetadata);

        return typeMetadata;
    }

    /**
     * Configures type metadata in the type metadata map.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * @param {TypeOptions<TType>} typeOptions Type options.
     * 
     * @returns {TypeMetadata<TType>} Type metadata for provided type function.
     */
    public configureTypeMetadata<TType>(typeFn: TypeFn<TType>, typeOptions?: TypeOptions<TType>): TypeMetadata<TType>
    {
        let typeMetadata = this.typeMetadataMap.get(typeFn);

        if (isNil(typeMetadata))
        {
            typeMetadata = this.declareTypeMetadata(typeFn);

            this.typeMetadataMap.set(typeFn, typeMetadata);
        }

        if (!isNil(typeOptions))
        {
            typeMetadata.configure(typeOptions);
        }

        return typeMetadata;
    }

    /**
     * Extracts type metadata from provided type function.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * 
     * @returns {TypeMetadata<TType>} Type metadata for provided type function.
     */
    public extractTypeMetadata<TType>(typeFn: TypeFn<TType>): TypeMetadata<TType>
    {
        return this.typeMetadataMap.get(typeFn) ?? this.configureTypeMetadata(typeFn);
    }

    /**
     * Resolves type metadata by provided type argument.
     * 
     * @type {TypeMetadata<any>} Type metadata for provided type argument.
     */
    private resolveTypeMetadata<TType>(typeArgument: TypeArgument<TType>): TypeMetadata<TType>
    {
        const typeFn = isString(typeArgument) ? this.typeFnMap.get(typeArgument) : (isArrowFunction(typeArgument) ? typeArgument() : typeArgument);

        if (isNil(typeFn))
        {
            throw new Error(`Cannot resolve type metadata for provided type argument: ${jsonStringify(typeArgument)}. This is usually caused by invalid configuration.`);
        }

        return this.extractTypeMetadata(typeFn);
    }

    /**
     * Configures instance global type options.
     * 
     * @param {Partial<TypeOptionsBase<any>>} typeOptionsBase Type options base.
     * 
     * @returns {TypeManager<TType>} Current instance of type manager.
     */
    public configureTypeOptionsBase(typeOptionsBase: Partial<TypeOptionsBase<any>>): TypeManager<TType>
    {
        merge(this.typeOptionsBase, typeOptionsBase);

        return this;
    }
 
    /**
     * Configures instance type options.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * @param {TypeOptions<TType>} typeOptions Type options.
     * 
     * @returns {TypeManager<TType>} Current instance of type manager.
     */
    public configureTypeOptions(typeFn: TypeFn<any>, typeOptions: TypeOptions<any>): TypeManager<TType>
    {
        this.configureTypeMetadata(typeFn, typeOptions);

        return this;
    }
 
    /**
     * Configures instance type options map.
     * 
     * @param {Map<TypeFn<TType>, TypeOptions<TType>>} typeOptionsMap Type options map.
     * 
     * @returns {TypeManager<TType>} Current instance of type manager.
     */
    public configureTypeOptionsMap(typeOptionsMap: Map<TypeFn<any>, TypeOptions<any>>): TypeManager<TType>
    {
        for (const [typeFn, typeOptions] of typeOptionsMap)
        {
            this.configureTypeOptions(typeFn, typeOptions);
        }

        return this;
    }

    /**
     * Configures type manager.
     * 
     * @param {TypeManagerOptions} typeManagerOptions Type manager options.
     * 
     * @returns {TypeManager<TType>} Current instance of type manager.
     */
    public configure(typeManagerOptions: TypeManagerOptions): TypeManager<TType>
    {
        if (!isUndefined(typeManagerOptions.typeOptionsBase)) 
        {
            this.configureTypeOptionsBase(typeManagerOptions.typeOptionsBase);
        }

        if (!isUndefined(typeManagerOptions.typeOptionsMap)) 
        {
            this.configureTypeOptionsMap(typeManagerOptions.typeOptionsMap);
        }

        return this;
    }

    /**
     * Applies type configuration in static context.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * @param {TypeConfiguration<TType>} typeConfiguration Type configuration.
     * 
     * @returns {typeof TypeManager} Static instance of type manager.
     */
    public applyTypeConfiguration(typeFn: TypeFn<any>, typeConfiguration: TypeConfiguration<any>): TypeManager<TType>
    {
        const typeMetadata = this.extractTypeMetadata(typeFn);

        typeConfiguration.configure(typeMetadata);

        return this;
    }

    /**
     * Builds type options base for the current instance.
     * 
     * @returns {TypeOptionsBase<any>} Type options base.
     */
    private buildTypeOptionsBase(): TypeOptionsBase<any>
    {
        const typeOptionsBase = this.typeManagerOptions.typeOptionsBase ?? {};

        return merge({}, TypeManager.typeOptionsBase, typeOptionsBase);
    }

    /**
     * Builds type options map of the current instance.
     * 
     * @returns {Map<TypeFn<any>, TypeOptions<any>>} Type options map.
     */
    private buildTypeOptionsMap(): Map<TypeFn<any>, TypeOptions<any>>
    {
        const typeOptionsMap = this.typeOptionsMap;

        for (const [typeFn, typeOptions] of TypeManager.typeOptionsMap)
        {
            this.configureTypeOptions(typeFn, typeOptions);
        }

        if (isNil(this.typeManagerOptions.typeOptionsMap))
        {
            return typeOptionsMap;
        }

        for (const [typeFn, typeOptions] of this.typeManagerOptions.typeOptionsMap)
        {
            this.configureTypeOptions(typeFn, typeOptions);
        }

        return typeOptionsMap;
    }

    /**
     * Defines serializer context for x.
     * 
     * @param {any} x Some value.
     * @param {Array<GenericArgument<any>>} genericArguments Generic arguments.
     * 
     * @returns {SerializerContext<any>} Serializer context.
     */
    private defineSerializerContext(x: any, genericArguments?: Array<GenericArgument<any>>): SerializerContext<TType>
    {
        return new SerializerContext(x, new WeakMap<ReferenceKey, ReferenceValue>(), new WeakMap<ReferenceKey, Array<ReferenceCallback>>(), 
        {
            jsonPathKey: '$',
            typeMetadata: this.typeMetadata,
            genericArguments: genericArguments
        });
    }

    /**
     * Serializes provided value.
     * 
     *  @param {TypeLike<TType>} x Input value.
     * 
     * @returns {TypeLike<any>} Object created from provided input value or undefined. 
     */
    public serialize(x: undefined): any;
    public serialize(x: null): null;
    public serialize(x: Array<TType>): Array<any>;
    public serialize(x: TType): any;
    public serialize(x: TypeLike<TType | Array<TType>>): TypeLike<any>
    {
        const arrayFn = Array as TypeFn<any[]>;

        if (isArray(x) && this.typeMetadata.typeFn !== arrayFn)
        {
            const arrayMetadata = this.extractTypeMetadata(arrayFn);
            const arraySerializerContext = new SerializerContext(x, new WeakMap<ReferenceKey, ReferenceValue>(), new WeakMap<ReferenceKey, Array<ReferenceCallback>>(), 
            {
                jsonPathKey: '$',
                typeMetadata: arrayMetadata,
                genericArguments: [this.typeMetadata.typeFn]
            });

            return arraySerializerContext.serialize(x);
        }

        return this.defineSerializerContext(x).serialize(x as any);
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Input value.
     * 
     * @returns {TypeLike<TType>} Type created from provided input value or undefined.
     */
    public deserialize(x: undefined): any;
    public deserialize(x: null): null;
    public deserialize(x: Array<any>): Array<TType>;
    public deserialize(x: any): TType;
    public deserialize(x: TypeLike<any>): TypeLike<TType | Array<TType>>
    {
        const arrayFn = Array as TypeFn<any[]>;

        if (isArray(x) && this.typeMetadata.typeFn !== arrayFn)
        {
            const arrayMetadata = this.extractTypeMetadata(arrayFn);
            const arraySerializerContext = new SerializerContext(x, new WeakMap<ReferenceKey, ReferenceValue>(), new WeakMap<ReferenceKey, Array<ReferenceCallback>>(), 
            {
                jsonPathKey: '$',
                typeMetadata: arrayMetadata,
                genericArguments: [this.typeMetadata.typeFn]
            });

            return arraySerializerContext.deserialize(x);
        }

        return this.defineSerializerContext(x).deserialize(x as any);
    }

    /**
     * Converts provided value to a JavaScript Object Notation (JSON) string.
     * 
     * @param {any} x Input value, usually an object or array, to be converted.
     * @param {Function|Array<number>|Array<string>} replacer A function that transforms the results or an array of strings and numbers that acts as an approved list.
     * @param {string|number} space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
     * 
     * @returns {string} JSON string.
     */
    public stringify(x: any, replacer?: (this: any, key: string, value: any) => any | Array<number> | Array<string> | null, space?: string | number): string
    {
        return jsonStringify(this.serialize(x), replacer, space);
    }

    /**
     * Converts a JavaScript Object Notation (JSON) string into a type.
     * 
     * @param {string} x A valid JSON string.
     * @param {Function} reviver A function that transforms the results. This function is called for each member of the object.
     * 
     * @returns {TypeLike<TType>} Type created from provided input value or undefined.
     */
    public parse(x: string, reviver?: (this: any, key: string, value: any) => any): TypeLike<TType>
    {
        return this.deserialize(jsonParse(x, reviver));
    }
}
