import { Serializer } from './serializer';
import { TypeOptions } from './type.options';
import { Fn } from './fn';
import { TypeDeclaration } from './type.declaration';
import { TypeCtor } from './type.ctor';
import { PropertyMetadata } from './property.metadata';
import { TypeSerializer } from './serializers/type.serializer';

export class TypeMetadata
{
    public name: string;

    public typeCtor: TypeCtor;

    public typeDeclaration: TypeDeclaration;

    public serializer: Serializer<any, any>;

    public alias?: string;

    public defaultValue?: any;

    public readonly propertyMetadataMap: Map<string, PropertyMetadata> = new Map<string, PropertyMetadata>();

    public constructor(name: string, typeCtor: TypeCtor, typeDeclaration: TypeDeclaration)
    {
        this.name            = name;
        this.typeCtor        = typeCtor;
        this.typeDeclaration = typeDeclaration;
        this.serializer      = new TypeSerializer(typeCtor);

        return;
    }

    public get declaredExplicitly(): boolean
    {
        return this.typeDeclaration === TypeDeclaration.Explicit;
    }

    public get declaredImplicitly(): boolean
    {
        return this.typeDeclaration === TypeDeclaration.Implicit;
    }

    public configure(typeOptions: TypeOptions): TypeMetadata
    {
        if (!Fn.isNil(typeOptions.serializer)) 
        {
            this.serializer = typeOptions.serializer;
        }

        if (!Fn.isNil(typeOptions.alias)) 
        {
            this.alias = typeOptions.alias;
        }

        if (!Fn.isNil(typeOptions.defaultValue)) 
        {
            this.defaultValue = typeOptions.defaultValue;
        }
        
        return this;
    }
}
