import { Alias } from './core/alias';
import { Fn } from './core/fn';
import { GenericArgument } from './core/generic-argument';
import { Log } from './core/log';
import { LogLevel } from './core/log-level';
import { ReferenceCallback } from './core/reference-callback';
import { ReferenceKey } from './core/reference-key';
import { ReferenceValue } from './core/reference-value';
import { SerializerContext } from './core/serializer-context';
import { TypeArgument } from './core/type-argument';
import { TypeFn } from './core/type-fn';
import { TypeLike } from './core/type-like';
import { TypeMetadata } from './core/type-metadata';
import { TypeOptions } from './core/type-options';
import { TypeOptionsBase } from './core/type-options-base';
import { TypeFactory } from './factories/type.factory';
import { SingletonInjector } from './injectors/singleton.injector';
import { DirectReferenceHandler } from './reference-handlers/direct.reference-handler';
import { ArrayBufferSerializer } from './serializers/array-buffer.serializer';
import { ArraySerializer } from './serializers/array.serializer';
import { BooleanSerializer } from './serializers/boolean.serializer';
import { DataViewSerializer } from './serializers/data-view.serializer';
import { DateSerializer } from './serializers/date.serializer';
import { Float32ArraySerializer } from './serializers/float-32-array.serializer';
import { Float64ArraySerializer } from './serializers/float-64-array.serializer';
import { Int16ArraySerializer } from './serializers/int-16-array.serializer';
import { Int32ArraySerializer } from './serializers/int-32-array.serializer';
import { Int8ArraySerializer } from './serializers/int-8-array.serializer';
import { MapSerializer } from './serializers/map.serializer';
import { NumberSerializer } from './serializers/number.serializer';
import { SetSerializer } from './serializers/set.serializer';
import { StringSerializer } from './serializers/string.serializer';
import { TypeSerializer } from './serializers/type.serializer';
import { Uint16ArraySerializer } from './serializers/uint-16-array.serializer';
import { Uint32ArraySerializer } from './serializers/uint-32-array.serializer';
import { Uint8ArraySerializer } from './serializers/uint-8-array.serializer';
import { Uint8ClampedArraySerializer } from './serializers/uint-8-clamped-array.serializer';
import { TypeManagerOptions } from './type-manager-options';

/**
 * Type manager class for external usage.
 * 
 * @type {TypeManager<TType>}
 */
export class TypeManager<TType>
{
    /**
     * Key to query type metadata from the prototypes.
     * 
     * @type {string}
     */
    public static readonly typeMetadataKey: string = '__TMTypeMetadata__';

    /**
     * Static global options of any type.
     * 
     * @type {TypeOptionsBase<any>}
     */
    public static readonly typeOptionsBase: TypeOptionsBase<any> = {
        defaultValue:          undefined,
        discriminator:         '__type__',
        factory:               new TypeFactory(),
        injector:              new SingletonInjector(),
        log:                   new Log(LogLevel.Error),
        preserveDiscriminator: false,
        referenceHandler:      new DirectReferenceHandler(),
        serializer:            new TypeSerializer(),
        useDefaultValue:       false,
        useImplicitConversion: false
    };

    /**
     * Static type options per type. 
     * 
     * Overrides static global type options.
     * 
     * @type {Map<TypeFn<any>, TypeOptions<any>>}
     */
    public static readonly typeOptionsMap: Map<TypeFn<any>, TypeOptions<any>> = new Map<TypeFn<any>, TypeOptions<any>>([
        [ArrayBuffer,       { serializer: new ArrayBufferSerializer(),       defaultValue: undefined }],
        [Array,             { serializer: new ArraySerializer(),             defaultValue: () => []  }],
        [Boolean,           { serializer: new BooleanSerializer(),           defaultValue: false     }],
        [DataView,          { serializer: new DataViewSerializer(),          defaultValue: undefined }],
        [Date,              { serializer: new DateSerializer(),              defaultValue: undefined }],
        [Float32Array,      { serializer: new Float32ArraySerializer(),      defaultValue: undefined }],
        [Float64Array,      { serializer: new Float64ArraySerializer(),      defaultValue: undefined }],
        [Int8Array,         { serializer: new Int8ArraySerializer(),         defaultValue: undefined }],
        [Int16Array,        { serializer: new Int16ArraySerializer(),        defaultValue: undefined }],
        [Int32Array,        { serializer: new Int32ArraySerializer(),        defaultValue: undefined }],
        [Map,               { serializer: new MapSerializer(),               defaultValue: undefined }],
        [Number,            { serializer: new NumberSerializer(),            defaultValue: 0         }],
        [Set,               { serializer: new SetSerializer(),               defaultValue: undefined }],
        [String,            { serializer: new StringSerializer(),            defaultValue: undefined }],
        [Uint8Array,        { serializer: new Uint8ArraySerializer(),        defaultValue: undefined }],
        [Uint8ClampedArray, { serializer: new Uint8ClampedArraySerializer(), defaultValue: undefined }],
        [Uint16Array,       { serializer: new Uint16ArraySerializer(),       defaultValue: undefined }],
        [Uint32Array,       { serializer: new Uint32ArraySerializer(),       defaultValue: undefined }]
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
        this.typeFn             = typeFn;
        this.typeManagerOptions = typeManagerOptions ?? {};
        this.typeOptionsBase    = this.buildTypeOptionsBase();
        this.typeOptionsMap     = this.buildTypeOptionsMap();
        this.typeMetadata       = this.extractTypeMetadata(typeFn);

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

        if (Fn.isNil(typeOptions))
        {
            typeOptions = {};

            this.typeOptionsMap.set(typeFn, typeOptions);
        }

        const typeMetadataResolver = this.resolveTypeMetadata.bind(this);
        const typeOptionsBase      = this.typeOptionsBase;
        const parentPrototype      = Object.getPrototypeOf(typeFn.prototype) ?? {};
        const parentTypeMetadata   = parentPrototype[this.typeMetadataKey];
        const typeMetadata         = new TypeMetadata(typeMetadataResolver, typeFn, typeOptionsBase, typeOptions, parentTypeMetadata);

        return typeMetadata;
    }

    /**
     * Defines type metadata for the type prototype.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * @param {TypeOptions<TType>} typeOptions Type options.
     * 
     * @returns {TypeMetadata<TType>} Type metadata for provided type function.
     */
    public static defineTypeMetadata<TType>(typeFn: TypeFn<TType>, typeOptions?: TypeOptions<TType>): TypeMetadata<TType>
    {
        const prototype       = typeFn.prototype;
        const metadataDefined = prototype.hasOwnProperty(this.typeMetadataKey);
        const typeMetadata    = metadataDefined ? prototype[this.typeMetadataKey] as TypeMetadata<TType> : this.declareTypeMetadata(typeFn);

        if (!metadataDefined)
        {
            Object.defineProperty(prototype, this.typeMetadataKey, {
                enumerable:   false,
                configurable: false,
                writable:     false,
                value:        typeMetadata
            });
        }

        if (!Fn.isNil(typeOptions))
        {
            typeMetadata.configure(typeOptions);
        }

        if (!Fn.isNil(typeMetadata.alias))
        {
            this.typeFnMap.set(typeMetadata.alias, typeMetadata.typeFn);
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
        const prototype       = typeFn.prototype;
        const metadataDefined = prototype.hasOwnProperty(this.typeMetadataKey);
        const typeMetadata    = metadataDefined ? prototype[this.typeMetadataKey] as TypeMetadata<TType> : this.defineTypeMetadata(typeFn);

        return typeMetadata;
    }

    /**
     * Resolves type metadata by provided type argument.
     * 
     * @type {TypeMetadata<any>} Type metadata for provided type argument.
     */
    private static resolveTypeMetadata<TType>(typeArgument: TypeArgument<TType>): TypeMetadata<TType>
    {
        const typeFn = Fn.isString(typeArgument) ? this.typeFnMap.get(typeArgument) : (Fn.isArrowFunction(typeArgument) ? typeArgument() : typeArgument);

        if (Fn.isNil(typeFn))
        {
            throw new Error(`Cannot resolve type metadata for provided type argument: ${JSON.stringify(typeArgument)}! This is usually caused by invalid configuration!`);
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
        Fn.assign(this.typeOptionsBase, typeOptionsBase);

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
        this.defineTypeMetadata(typeFn, typeOptions);

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
        if (!Fn.isUndefined(typeManagerOptions.typeOptionsBase)) 
        {
            this.configureTypeOptionsBase(typeManagerOptions.typeOptionsBase);
        }

        if (!Fn.isUndefined(typeManagerOptions.typeOptionsMap)) 
        {
            this.configureTypeOptionsMap(typeManagerOptions.typeOptionsMap);
        }

        return this;
    }

    /**
     * Defines serializer context for x in static context.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * @param {any} x Some value.
     * @param {GenericArgument<any>[]} genericArguments Generic arguments.
     * 
     * @returns {SerializerContext<TType>} Serializer context.
     */
    private static defineSerializerContext<TType>(typeFn: TypeFn<TType>, x: any, genericArguments?: GenericArgument<any>[]): SerializerContext<TType>
    {
        return new SerializerContext({
            $:                    x,
            path:                 '$',
            typeMetadata:         this.extractTypeMetadata(typeFn),
            genericArguments:     genericArguments,
            referenceCallbackMap: new WeakMap<ReferenceKey, ReferenceCallback[]>(),
            referenceMap:         new WeakMap<ReferenceKey, ReferenceValue>()
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
    public static serialize<TType>(typeFn: TypeFn<TType>, x: undefined): undefined;
    public static serialize<TType>(typeFn: TypeFn<TType>, x: null): null;
    public static serialize<TType>(typeFn: TypeFn<TType>, x: TType[]): any[];
    public static serialize<TType>(typeFn: TypeFn<TType>, x: TType): any;
    public static serialize<TType>(typeFn: TypeFn<TType>, x: TypeLike<TType | TType[]>): TypeLike<any>
    {
        const arrayFn = Array as TypeFn<any[]>;

        if (Fn.isArray(x) && typeFn !== arrayFn)
        {
            return this.defineSerializerContext(arrayFn, x, [typeFn]).serialize(x as any);
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
    public static deserialize<TType>(typeFn: TypeFn<TType>, x: undefined): undefined;
    public static deserialize<TType>(typeFn: TypeFn<TType>, x: null): null;
    public static deserialize<TType>(typeFn: TypeFn<TType>, x: any[]): TType[];
    public static deserialize<TType>(typeFn: TypeFn<TType>, x: any): TType;
    public static deserialize<TType>(typeFn: TypeFn<TType>, x: TypeLike<any>): TypeLike<TType | TType[]>
    {
        const arrayFn = Array as TypeFn<any[]>;

        if (Fn.isArray(x) && typeFn !== arrayFn)
        {
            return this.defineSerializerContext(arrayFn, x, [typeFn]).deserialize(x as any);
        }

        return this.defineSerializerContext(typeFn, x).deserialize(x as any);
    }

    /**
     * Converts provided value to a JavaScript Object Notation (JSON) string.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * @param {any} x Input value, usually an object or array, to be converted.
     * @param {Function|number[]|string[]} replacer A function that transforms the results or an array of strings and numbers that acts as an approved list.
     * @param {string|number} space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
     * 
     * @returns {string} JSON string.
     */
    public static stringify<TType>(typeFn: TypeFn<TType>, x: any, replacer?: (this: any, key: string, value: any) => any | number[] | string[] | null, space?: string | number): string
    {
        return JSON.stringify(this.serialize(typeFn, x), replacer, space);
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
        return this.deserialize(typeFn, JSON.parse(x, reviver));
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

        if (Fn.isNil(typeOptions))
        {
            typeOptions = {};

            this.typeOptionsMap.set(typeFn, typeOptions);
        }

        const typeMetadataResolver = this.resolveTypeMetadata.bind(this);
        const typeOptionsBase      = this.typeOptionsBase;
        const parentPrototype      = Object.getPrototypeOf(typeFn.prototype) ?? {};
        const parentTypeMetadata   = this.typeMetadataMap.get(parentPrototype.constructor);
        const typeMetadata         = new TypeMetadata(typeMetadataResolver, typeFn, typeOptionsBase, typeOptions, parentTypeMetadata);

        return typeMetadata;
    }

    /**
     * Defines type metadata in the type metadata map.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * @param {TypeOptions<TType>} typeOptions Type options.
     * 
     * @returns {TypeMetadata<TType>} Type metadata for provided type function.
     */
    public defineTypeMetadata<TType>(typeFn: TypeFn<TType>, typeOptions?: TypeOptions<TType>): TypeMetadata<TType>
    {
        let typeMetadata = this.typeMetadataMap.get(typeFn);

        if (Fn.isNil(typeMetadata))
        {
            typeMetadata = this.declareTypeMetadata(typeFn);

            this.typeMetadataMap.set(typeFn, typeMetadata);
        }

        if (!Fn.isNil(typeOptions))
        {
            typeMetadata.configure(typeOptions);
        }

        if (!Fn.isNil(typeMetadata.alias))
        {
            this.typeFnMap.set(typeMetadata.alias, typeMetadata.typeFn);
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
        return this.typeMetadataMap.get(typeFn) ?? this.defineTypeMetadata(typeFn);
    }

    /**
     * Resolves type metadata by provided type argument.
     * 
     * @type {TypeMetadata<any>} Type metadata for provided type argument.
     */
    private resolveTypeMetadata<TType>(typeArgument: TypeArgument<TType>): TypeMetadata<TType>
    {
        const typeFn = Fn.isString(typeArgument) ? this.typeFnMap.get(typeArgument) : (Fn.isArrowFunction(typeArgument) ? typeArgument() : typeArgument);

        if (Fn.isNil(typeFn))
        {
            throw new Error(`Cannot resolve type metadata for provided type argument: ${JSON.stringify(typeArgument)}! This is usually caused by invalid configuration!`);
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
        Fn.assign(this.typeOptionsBase, typeOptionsBase);

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
        this.defineTypeMetadata(typeFn, typeOptions);

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
        if (!Fn.isUndefined(typeManagerOptions.typeOptionsBase)) 
        {
            this.configureTypeOptionsBase(typeManagerOptions.typeOptionsBase);
        }

        if (!Fn.isUndefined(typeManagerOptions.typeOptionsMap)) 
        {
            this.configureTypeOptionsMap(typeManagerOptions.typeOptionsMap);
        }

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

        return Fn.assign({}, TypeManager.typeOptionsBase, typeOptionsBase);
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

        if (Fn.isNil(this.typeManagerOptions.typeOptionsMap))
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
     * @param {GenericArgument<any>[]} genericArguments Generic arguments.
     * 
     * @returns {SerializerContext<any>} Serializer context.
     */
    private defineSerializerContext(x: any, genericArguments?: GenericArgument<any>[]): SerializerContext<TType>
    {
        return new SerializerContext({
            $:                    x,
            path:                 '$',
            typeMetadata:         this.typeMetadata,
            genericArguments:     genericArguments,
            referenceCallbackMap: new WeakMap<ReferenceKey, ReferenceCallback[]>(),
            referenceMap:         new WeakMap<ReferenceKey, ReferenceValue>()
        });
    }

    /**
     * Serializes provided value.
     * 
     *  @param {TypeLike<TType>} x Input value.
     * 
     * @returns {TypeLike<any>} Object created from provided input value or undefined. 
     */
    public serialize(x: undefined): undefined;
    public serialize(x: null): null;
    public serialize(x: TType[]): any[];
    public serialize(x: TType): any;
    public serialize(x: TypeLike<TType | TType[]>): TypeLike<any>
    {
        const arrayFn = Array as TypeFn<any[]>;

        if (Fn.isArray(x) && this.typeMetadata.typeFn !== arrayFn)
        {
            const arrayMetadata = this.extractTypeMetadata(arrayFn);

            const arraySerializerContext = this.defineSerializerContext(x).defineChildSerializerContext({
                typeMetadata:     arrayMetadata,
                genericArguments: [this.typeMetadata.typeFn]
            });

            return arraySerializerContext.serialize(x as any);
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
    public deserialize(x: undefined): undefined;
    public deserialize(x: null): null;
    public deserialize(x: any[]): TType[];
    public deserialize(x: any): TType;
    public deserialize(x: TypeLike<any>): TypeLike<TType | TType[]>
    {
        const arrayFn = Array as TypeFn<any[]>;

        if (Fn.isArray(x) && this.typeMetadata.typeFn !== arrayFn)
        {
            const arrayMetadata = this.extractTypeMetadata(arrayFn);

            const arraySerializerContext = this.defineSerializerContext(x).defineChildSerializerContext({
                typeMetadata:     arrayMetadata,
                genericArguments: [this.typeMetadata.typeFn]
            });

            return arraySerializerContext.deserialize(x as any);
        }

        return this.defineSerializerContext(x).deserialize(x as any);
    }

    /**
     * Converts provided value to a JavaScript Object Notation (JSON) string.
     * 
     * @param {any} x Input value, usually an object or array, to be converted.
     * @param {Function|number[]|string[]} replacer A function that transforms the results or an array of strings and numbers that acts as an approved list.
     * @param {string|number} space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
     * 
     * @returns {string} JSON string.
     */
    public stringify(x: any, replacer?: (this: any, key: string, value: any) => any | number[] | string[] | null, space?: string | number): string
    {
        return JSON.stringify(this.serialize(x), replacer, space);
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
        return this.deserialize(JSON.parse(x, reviver));
    }
}
