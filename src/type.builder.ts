import { TypeMetadata } from './type.metadata';
import { TypeBuilderOptions } from './type.builder.options';
import { TypeCtor } from './type.ctor';
import { TypeDecorator } from './type.decorator';
import { Fn } from './fn';
import { TypeDeclaration } from './type.declaration';
import { Log } from './log';

export class TypeBuilder
{
    public readonly typeMetadata: TypeMetadata;

    public constructor(typeCtor: TypeCtor)
    {
        this.typeMetadata = TypeDecorator.extractTypeMetadata(typeCtor);
        
        return;
    }

    public static configure(typeBuilderOptions: TypeBuilderOptions)
    {
        if (!Fn.isNil(typeBuilderOptions.logLevel))
        {
            Log.logLevel = typeBuilderOptions.logLevel;
        }

        if (!Fn.isNil(typeBuilderOptions.typeOptionsMap)) 
        {
            typeBuilderOptions.typeOptionsMap.forEach((typeOptions, typeCtor) => 
            {
                TypeDecorator.injectTypeMetadata(typeCtor, typeOptions, TypeDeclaration.Explicit);
            });
        }

        return;
    }

    public serialize(x: any): any 
    {
        return this.typeMetadata.serializer.serialize(x);
    }

    public deserialize(x: any): any 
    {
        return this.typeMetadata.serializer.deserialize(x);
    }
}
