import { TypeFn } from './core';
import { Alias } from './core/alias';
import { Fn } from './core/fn';
import { Log } from './core/log';
import { LogLevel } from './core/log-level';
import { TypeArgument } from './core/type-argument';
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

/**
 * Type artisan class to encapsulate type manipulating functions.
 * 
 * @type {TypeArtisan}
 */
export class TypeArtisan
{
    /**
     * Global options of any type.
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
     * Type options per type. 
     * 
     * Overrides global type options.
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
     * Type function map for types with aliases.
     * 
     * @type {Map<Alias, TypeFn<any>>}
     */
    public static readonly typeFnMap: Map<Alias, TypeFn<any>> = new Map<Alias, TypeFn<any>>();
    
    /**
     * Configures global type options.
     * 
     * @param {Partial<TypeOptionsBase<TType>>} typeOptionsBase Type options base.
     * 
     * @returns {void}
     */
    public static configureTypeOptionsBase<TType>(typeOptionsBase: Partial<TypeOptionsBase<TType>>): void
    {
        Fn.assign(this.typeOptionsBase, typeOptionsBase);

        return;
    }

    /**
     * Configures type options.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * @param {TypeOptions<TType>} typeOptions Type options.
     * 
     * @returns {void}
     */
    public static configureTypeOptions<TType>(typeFn: TypeFn<TType>, typeOptions: TypeOptions<TType>): void
    {
        let definedTypeOptions = this.typeOptionsMap.get(typeFn);

        if (Fn.isNil(definedTypeOptions))
        {
            definedTypeOptions = {};

            this.typeOptionsMap.set(typeFn, definedTypeOptions);
        }

        Fn.assign(definedTypeOptions, typeOptions);

        this.defineTypeMetadata(typeFn, typeOptions);

        return;
    }

    /**
     * Configures type options per type.
     * 
     * @param {Map<TypeFn<TType>, TypeOptions<TType>>} typeOptionsMap Type options map.
     * 
     * @returns {void}
     */
    public static configureTypeOptionsMap<TType>(typeOptionsMap: Map<TypeFn<TType>, TypeOptions<TType>>): void
    {
        typeOptionsMap.forEach((typeOptions, typeFn) => 
        {
            this.configureTypeOptions(typeFn, typeOptions);
        });

        return;
    }

    /**
     * Declares type metadata for provided type function based on general configuration.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * 
     * @returns {TypeMetadata<TType>} Type metadata.
     */
    public static declareTypeMetadata<TType>(typeFn: TypeFn<TType>): TypeMetadata<TType>
    {
        const typeOptionsBase      = this.typeOptionsBase;
        const typeOptions          = this.typeOptionsMap.get(typeFn);
        const typeMetadataResolver = this.resolveTypeMetadata.bind(this);
        const typeMetadata         = new TypeMetadata(typeMetadataResolver, typeFn, typeOptionsBase, typeOptions ?? {});

        if (!Fn.isNil(typeMetadata.alias))
        {
            this.typeFnMap.set(typeMetadata.alias, typeMetadata.typeFn);
        }

        return typeMetadata;
    }

    /**
     * Defines type metadata for the type prototype.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * @param {TypeOptions<TType>} typeOptions Type options.
     * 
     * @returns {TypeMetadata<TType>} Type metadata for provided type constructor.
     */
    public static defineTypeMetadata<TType>(typeFn: TypeFn<TType>, typeOptions: TypeOptions<TType> = {}): TypeMetadata<TType>
    {
        const prototype       = typeFn.prototype;
        const metadataDefined = prototype.hasOwnProperty(TypeMetadata.key);
        const typeMetadata    = metadataDefined ? prototype[TypeMetadata.key] as TypeMetadata<TType> : this.declareTypeMetadata(typeFn);

        if (!metadataDefined)
        {
            Object.defineProperty(prototype, TypeMetadata.key, {
                enumerable:   false,
                configurable: false,
                writable:     false,
                value:        typeMetadata
            });
        }
        
        if (!Fn.isNil(typeOptions.alias))
        {
            this.typeFnMap.set(typeOptions.alias, typeMetadata.typeFn);
        }

        return typeMetadata.configure(typeOptions);
    }

    /**
     * Extracts type metadata from provided type constructor.
     * 
     * @param {TypeFn<TType>} typeFn Type function.
     * 
     * @returns {TypeMetadata<TType>} Type metadata for provided type constructor.
     */
    public static extractTypeMetadata<TType>(typeFn: TypeFn<TType>): TypeMetadata<TType>
    {
        const prototype       = typeFn.prototype;
        const metadataDefined = prototype.hasOwnProperty(TypeMetadata.key);
        const typeMetadata    = metadataDefined ? prototype[TypeMetadata.key] as TypeMetadata<TType> : this.defineTypeMetadata(typeFn);

        return typeMetadata;
    }

    /**
     * Resolves type metadata by provided type argument.
     * 
     * @type {TypeMetadata<any>} Type metadata for provided type argument.
     */
    public static resolveTypeMetadata<TType>(typeArgument: TypeArgument<TType>): TypeMetadata<TType>
    {
        const typeFn = Fn.isString(typeArgument) ? this.typeFnMap.get(typeArgument) : (Fn.isArrowFunction(typeArgument) ? typeArgument() : typeArgument);

        if (Fn.isNil(typeFn))
        {
            throw new Error(`Cannot resolve type metadata for provided type argument: ${JSON.stringify(typeArgument)}! This is usually caused by invalid configuration!`);
        }

        return this.extractTypeMetadata(typeFn);
    }
}
