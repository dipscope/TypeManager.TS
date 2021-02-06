import { Fn, Log } from './utils';
import { ObjectFactory } from './factories';
import { SingletonInjector } from './injectors';
import { StringSerializer, NumberSerializer, BooleanSerializer, DateSerializer, ObjectSerializer } from './serializers';
import { TypeCtor } from './type.ctor';
import { TypeMetadata } from './type.metadata';
import { TypeOptions } from './type.options';
import { TypeOptionsBase } from './type.options.base';

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
     * Global type options shared among all types.
     * 
     * @type {TypeOptionsBase}
     */
    public static readonly typeOptionsBase: TypeOptionsBase = {
        customData:            {},
        defaultValue:          undefined,
        useDefaultValue:       false,
        useImplicitConversion: false,
        typeFactory:           new ObjectFactory(),
        typeInjector:          new SingletonInjector(),
        typeSerializer:        new ObjectSerializer()
    };

    /**
     * Type options per type. 
     * 
     * Overrides global type options.
     * 
     * @type {Map<TypeCtor, TypeOptions>}
     */
    public static readonly typeOptionsMap: Map<TypeCtor, TypeOptions> = new Map<TypeCtor, TypeOptions>([
        [String,  { alias: 'String',  typeSerializer: new StringSerializer(),  defaultValue: null             }],
        [Number,  { alias: 'Number',  typeSerializer: new NumberSerializer(),  defaultValue: 0                }],
        [Boolean, { alias: 'Boolean', typeSerializer: new BooleanSerializer(), defaultValue: false            }],
        [Date,    { alias: 'Date',    typeSerializer: new DateSerializer(),    defaultValue: () => new Date() }]
    ]);

    /**
     * Type constructor map for types with aliases.
     * 
     * @type {Map<string, TypeCtor>}
     */
    public static readonly typeCtorMap: Map<string, TypeCtor> = new Map<string, TypeCtor>();
    
    /**
     * Configures global type options.
     * 
     * @param {Partial<TypeOptionsBase>} typeOptionsBase Type options base.
     * 
     * @returns {void}
     */
    public static configureTypeOptionsBase(typeOptionsBase: Partial<TypeOptionsBase>): void
    {
        Fn.assign(this.typeOptionsBase, typeOptionsBase);

        if (!Log.errorEnabled)
        {
            return;
        }

        if (Fn.isNil(this.typeOptionsBase.customData))
        {
            Log.error('Custom type options must be specified for type options base!');
        }

        if (Fn.isNil(this.typeOptionsBase.useDefaultValue))
        {
            Log.error('Using of default values must be specified for type options base!');
        }

        if (Fn.isNil(this.typeOptionsBase.useImplicitConversion))
        {
            Log.error('Using of implicit convertion must be specified for type options base!');
        }

        if (Fn.isNil(this.typeOptionsBase.typeFactory))
        {
            Log.error('Type factory must be specified for type options base!');
        }

        if (Fn.isNil(this.typeOptionsBase.typeInjector))
        {
            Log.error('Type injector must be specified for type options base!');
        }

        if (Fn.isNil(this.typeOptionsBase.typeSerializer))
        {
            Log.error('Type serializer must be specified for type options base!');
        }

        return;
    }

    /**
     * Configures type options.
     * 
     * @param {TypeCtor} typeCtor Type constructor function.
     * @param {TypeOptions} typeOptions Type options.
     * 
     * @returns {void}
     */
    public static configureTypeOptions(typeCtor: TypeCtor, typeOptions: TypeOptions): void
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
     * @param {Map<TypeCtor, TypeOptions>} typeOptionsMap Type options map.
     * 
     * @returns {void}
     */
    public static configureTypeOptionsMap(typeOptionsMap: Map<TypeCtor, TypeOptions>): void
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
     * @param {TypeCtor} typeCtor Type constructor function.
     * 
     * @returns {TypeMetadata} Type metadata.
     */
    public static declareTypeMetadata(typeCtor: TypeCtor): TypeMetadata
    {
        const typeOptionsBase      = this.typeOptionsBase;
        const typeOptions          = this.typeOptionsMap.get(typeCtor);
        const typeMetadataResolver = this.extractTypeMetadata.bind(this);
        const typeMetadata         = new TypeMetadata(typeCtor, typeOptionsBase, typeMetadataResolver);

        typeMetadata.configure(typeOptions ?? {});

        if (!Fn.isNil(typeMetadata.alias))
        {
            this.typeCtorMap.set(typeMetadata.alias, typeMetadata.typeCtor);
        }

        return typeMetadata;
    }

    /**
     * Defines type metadata for the type prototype.
     * 
     * @param {TypeCtor} typeCtor Type constructor function.
     * @param {TypeOptions} typeOptions Type options.
     * 
     * @returns {TypeMetadata} Type metadata for provided type constructor.
     */
    public static defineTypeMetadata(typeCtor: TypeCtor, typeOptions: TypeOptions = {}): TypeMetadata
    {
        const prototype       = typeCtor.prototype;
        const metadataKey     = this.typeMetadataKey;
        const metadataDefined = prototype.hasOwnProperty(metadataKey);
        const typeMetadata    = metadataDefined ? prototype[metadataKey] as TypeMetadata : this.declareTypeMetadata(typeCtor);

        if (!metadataDefined)
        {
            const typeMetadataParent = prototype[metadataKey] as TypeMetadata;

            if (typeMetadataParent)
            {
                for (const propertyMetadata of typeMetadataParent.propertyMetadataMap.values())
                {
                    typeMetadata.propertyMetadataMap.set(propertyMetadata.name, propertyMetadata);
                }
            }
    
            Object.defineProperty(prototype, metadataKey, {
                enumerable: false,
                configurable: false,
                writable: false,
                value: typeMetadata
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
     * @param {TypeCtor} typeCtor Type constructor function.
     * 
     * @returns {TypeMetadata} Type metadata for provided type constructor.
     */
    public static extractTypeMetadata(typeCtor: TypeCtor): TypeMetadata
    {
        const prototype       = typeCtor.prototype;
        const metadataKey     = this.typeMetadataKey;
        const metadataDefined = prototype.hasOwnProperty(metadataKey);
        const typeMetadata    = metadataDefined ? prototype[metadataKey] as TypeMetadata : this.defineTypeMetadata(typeCtor);

        return typeMetadata;
    }
}
