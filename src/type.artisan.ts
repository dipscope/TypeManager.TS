import { Fn } from './utils';
import { StringSerializer, NumberSerializer, BooleanSerializer, DateSerializer, ObjectSerializer } from './serializers';
import { TypeCtor } from './type.ctor';
import { TypeDeclaration } from './type.declaration';
import { TypeMetadata } from './type.metadata';
import { TypeOptions } from './type.options';

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
     * @type {TypeOptions}
     */
    public static readonly typeOptions: TypeOptions = {
        defaultValue: undefined,
        useDefaultValue: false,
        useImplicitConversion: false
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
     * @param {TypeOptions} typeOptions Type options.
     * 
     * @returns {void}
     */
    public static configureTypeOptions(typeOptions: TypeOptions): void
    {
        Object.assign(this.typeOptions, typeOptions);

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
            this.typeOptionsMap.set(typeCtor, typeOptions);
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
        const typeOptions     = this.typeOptionsMap.get(typeCtor);
        const typeDeclaration = typeOptions ? TypeDeclaration.Explicit : TypeDeclaration.Implicit;
        const typeSerializer  = new ObjectSerializer(typeCtor, this.extractTypeMetadata.bind(this));
        const typeMetadata    = new TypeMetadata(typeCtor, typeDeclaration, typeSerializer);

        return typeMetadata.configure(this.typeOptions).configure(typeOptions ?? {});
    }

    /**
     * Injects type metadata into the type proptotype.
     * 
     * @param {TypeCtor} typeCtor Type constructor function.
     * @param {TypeOptions} typeOptions Type options.
     * @param {TypeDeclaration} typeDeclaration Type declaration.
     * 
     * @returns {TypeMetadata} Type metadata for provided type constructor.
     */
    public static injectTypeMetadata(typeCtor: TypeCtor, typeOptions: TypeOptions, typeDeclaration: TypeDeclaration): TypeMetadata
    {
        const prototype        = typeCtor.prototype;
        const metadataKey      = this.typeMetadataKey;
        const metadataInjected = prototype.hasOwnProperty(metadataKey);
        const typeMetadata     = metadataInjected ? prototype[metadataKey] as TypeMetadata : this.declareTypeMetadata(typeCtor);

        if (!metadataInjected)
        {
            const typeMetadataParent = prototype[metadataKey] as TypeMetadata;

            if (typeMetadataParent)
            {
                typeMetadataParent.propertyMetadataMap.forEach((propertyMetadata, propertyName) =>
                {
                    typeMetadata.propertyMetadataMap.set(propertyName, propertyMetadata);
                });
            }
    
            Object.defineProperty(prototype, metadataKey, {
                enumerable: false,
                configurable: false,
                writable: false,
                value: typeMetadata
            });
        }
        
        if (!typeMetadata.declaredExplicitly)
        {
            typeMetadata.typeDeclaration = typeDeclaration;
        }

        // TODO: Refactor - will not work for introduced global config.
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
        const prototype        = typeCtor.prototype;
        const metadataKey      = this.typeMetadataKey;
        const metadataInjected = prototype.hasOwnProperty(metadataKey);
        const typeMetadata     = metadataInjected ? prototype[metadataKey] as TypeMetadata : this.injectTypeMetadata(typeCtor, {}, TypeDeclaration.Implicit);

        return typeMetadata;
    }
}
