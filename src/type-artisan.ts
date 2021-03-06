import { Alias } from './core/alias';
import { Fn } from './core/fn';
import { Log } from './core/log';
import { LogLevel } from './core/log-level';
import { TypeArgument } from './core/type-argument';
import { TypeCtor } from './core/type-ctor';
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
     * Type metadata key which is used to store data in prototypes.
     * 
     * @type {string}
     */
    public static readonly typeMetadataKey: string = '__TMTypeMetadata__';
    
    /**
     * Global options of any type.
     * 
     * @type {TypeOptionsBase<any>}
     */
    public static readonly typeOptionsBase: TypeOptionsBase<any> = {
        defaultValue:          undefined,
        factory:               new TypeFactory(),
        injector:              new SingletonInjector(),
        log:                   new Log(LogLevel.Error),
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
     * @type {Map<TypeCtor<any>, TypeOptions<any>>}
     */
    public static readonly typeOptionsMap: Map<TypeCtor<any>, TypeOptions<any>> = new Map<TypeCtor<any>, TypeOptions<any>>([
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
     * Type constructor map for types with aliases.
     * 
     * @type {Map<Alias, TypeCtor<any>>}
     */
    public static readonly typeCtorMap: Map<Alias, TypeCtor<any>> = new Map<Alias, TypeCtor<any>>();
    
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
     * @param {TypeCtor<TType>} typeCtor Type constructor function.
     * @param {TypeOptions<TType>} typeOptions Type options.
     * 
     * @returns {void}
     */
    public static configureTypeOptions<TType>(typeCtor: TypeCtor<TType>, typeOptions: TypeOptions<TType>): void
    {
        let definedTypeOptions = this.typeOptionsMap.get(typeCtor);

        if (Fn.isNil(definedTypeOptions))
        {
            definedTypeOptions = {};

            this.typeOptionsMap.set(typeCtor, definedTypeOptions);
        }

        Fn.assign(definedTypeOptions, typeOptions);

        this.defineTypeMetadata(typeCtor, typeOptions);

        return;
    }

    /**
     * Configures type options per type.
     * 
     * @param {Map<TypeCtor<TType>, TypeOptions<TType>>} typeOptionsMap Type options map.
     * 
     * @returns {void}
     */
    public static configureTypeOptionsMap<TType>(typeOptionsMap: Map<TypeCtor<TType>, TypeOptions<TType>>): void
    {
        typeOptionsMap.forEach((typeOptions, typeCtor) => 
        {
            this.configureTypeOptions(typeCtor, typeOptions);
        });

        return;
    }

    /**
     * Declares type metadata for provided type constructor based on general configuration.
     * 
     * @param {TypeCtor<TType>} typeCtor Type constructor function.
     * 
     * @returns {TypeMetadata<TType>} Type metadata.
     */
    public static declareTypeMetadata<TType>(typeCtor: TypeCtor<TType>): TypeMetadata<TType>
    {
        const typeOptionsBase      = this.typeOptionsBase;
        const typeOptions          = this.typeOptionsMap.get(typeCtor);
        const typeMetadataResolver = this.resolveTypeMetadata.bind(this);
        const typeMetadata         = new TypeMetadata(typeMetadataResolver, typeCtor, typeOptionsBase, typeOptions ?? {});

        if (!Fn.isNil(typeMetadata.alias))
        {
            this.typeCtorMap.set(typeMetadata.alias, typeMetadata.typeCtor);
        }

        return typeMetadata;
    }

    /**
     * Defines type metadata for the type prototype.
     * 
     * @param {TypeCtor<TType>} typeCtor Type constructor function.
     * @param {TypeOptions<TType>} typeOptions Type options.
     * 
     * @returns {TypeMetadata<TType>} Type metadata for provided type constructor.
     */
    public static defineTypeMetadata<TType>(typeCtor: TypeCtor<TType>, typeOptions: TypeOptions<TType> = {}): TypeMetadata<TType>
    {
        const prototype       = typeCtor.prototype;
        const metadataKey     = this.typeMetadataKey;
        const metadataDefined = prototype.hasOwnProperty(metadataKey);
        const typeMetadata    = metadataDefined ? prototype[metadataKey] as TypeMetadata<TType> : this.declareTypeMetadata(typeCtor);

        if (!metadataDefined)
        {
            const typeMetadataParent = prototype[metadataKey] as TypeMetadata<any>;

            if (typeMetadataParent)
            {
                for (const propertyMetadata of typeMetadataParent.propertyMetadataMap.values())
                {
                    typeMetadata.propertyMetadataMap.set(propertyMetadata.name, propertyMetadata);
                }
            }
    
            Object.defineProperty(prototype, metadataKey, {
                enumerable:   false,
                configurable: false,
                writable:     false,
                value:        typeMetadata
            });
        }
        
        if (!Fn.isNil(typeOptions.alias))
        {
            this.typeCtorMap.set(typeOptions.alias, typeMetadata.typeCtor);
        }

        return typeMetadata.configure(typeOptions);
    }

    /**
     * Extracts type metadata from provided type constructor.
     * 
     * @param {TypeCtor<TType>} typeCtor Type constructor function.
     * 
     * @returns {TypeMetadata<TType>} Type metadata for provided type constructor.
     */
    public static extractTypeMetadata<TType>(typeCtor: TypeCtor<TType>): TypeMetadata<TType>
    {
        const prototype       = typeCtor.prototype;
        const metadataKey     = this.typeMetadataKey;
        const metadataDefined = prototype.hasOwnProperty(metadataKey);
        const typeMetadata    = metadataDefined ? prototype[metadataKey] as TypeMetadata<TType> : this.defineTypeMetadata(typeCtor);

        return typeMetadata;
    }

    /**
     * Resolves type metadata by provided type argument.
     * 
     * @type {TypeMetadata<any>} Type metadata for provided type argument.
     */
    public static resolveTypeMetadata<TType>(typeArgument: TypeArgument<TType>): TypeMetadata<TType>
    {
        const typeCtor = Fn.isString(typeArgument) ? this.typeCtorMap.get(typeArgument) : (Fn.isCtor(typeArgument) ? typeArgument : typeArgument());

        if (Fn.isNil(typeCtor))
        {
            throw new Error(`Cannot resolve type metadata for provided type argument: ${JSON.stringify(typeArgument)}! This is usually caused by invalid configuration!`);
        }

        return this.extractTypeMetadata(typeCtor);
    }
}
