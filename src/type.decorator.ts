import { TypeCtor } from './type.ctor';
import { TypeDeclaration } from './type.declaration';
import { TypeMetadata } from './type.metadata';
import { TypeOptions } from './type.options';
import { Fn } from './fn';
import { StringSerializer } from './serializers/string.serializer';
import { NumberSerializer } from './serializers/number.serializer';
import { BooleanSerializer } from './serializers/boolean.serializer';
import { DateSerializer } from './serializers/date.serializer';
import { DirectSerializer } from './serializers/direct.serializer';

export class TypeDecorator
{
    private static readonly typeMetadataKey: string = '__TBTypeMetadata__';
    
    private static readonly typeOptionsMap: Map<TypeCtor, TypeOptions> = new Map<TypeCtor, TypeOptions>([
        [String,  { serializer: new StringSerializer() }],
        [Number,  { serializer: new NumberSerializer() }],
        [Boolean, { serializer: new BooleanSerializer() }],
        [Date,    { serializer: new DateSerializer() }]
    ]);

    public static readonly typeCtorMap: Map<string, TypeCtor> = new Map<string, TypeCtor>();

    public static injectTypeMetadata(typeCtor: TypeCtor, typeOptions: TypeOptions, typeDeclaration: TypeDeclaration): TypeMetadata
    {
        const prototype        = typeCtor.prototype;
        const metadataKey      = this.typeMetadataKey;
        const metadataInjected = prototype.hasOwnProperty(metadataKey);
        const typeMetadata     = metadataInjected ? prototype[metadataKey] as TypeMetadata : new TypeMetadata(Fn.nameOf(typeCtor), typeCtor, typeDeclaration);

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

        if (!Fn.isNil(typeOptions.alias)) 
        {
            this.typeCtorMap.set(typeOptions.alias, typeMetadata.typeCtor);
        }

        return typeMetadata.configure(typeOptions);
    }

    public static declareTypeMetadata(typeCtor: TypeCtor): TypeMetadata
    {
        const typeOptions     = this.typeOptionsMap.get(typeCtor);
        const typeDeclaration = typeOptions ? TypeDeclaration.Explicit : TypeDeclaration.Implicit;
        const typeMetadata    = this.injectTypeMetadata(typeCtor, typeOptions ?? {}, typeDeclaration);

        return typeMetadata;
    }

    public static extractTypeMetadata(typeCtor: TypeCtor): TypeMetadata
    {
        const prototype        = typeCtor.prototype;
        const metadataKey      = this.typeMetadataKey;
        const metadataInjected = prototype.hasOwnProperty(metadataKey);
        const typeMetadata     = metadataInjected ? prototype[metadataKey] as TypeMetadata : this.declareTypeMetadata(typeCtor);

        return typeMetadata;
    }

    public static buildDecorateFn(typeOptions: TypeOptions): Function
    {
        const fn = function (typeCtor: TypeCtor): TypeCtor
        {
            TypeDecorator.injectTypeMetadata(typeCtor, typeOptions, TypeDeclaration.Explicit);

            return typeCtor;
        };

        return fn;
    }
}
