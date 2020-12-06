import { Fn } from './fn';
import { TypeCtor } from './type.ctor';
import { TypeMetadata } from './type.metadata';
import { PropertyOptions } from './property.options';
import { TypeDecorator } from './type.decorator';
import { PropertyMetadata } from './property.metadata';
import { TypeDeclaration } from './type.declaration';
import { TypeResolver } from './type.resolver';
import { Log } from './log';

export class PropertyDecorator 
{
    public static injectPropertyMetadata(typeCtor: TypeCtor, propertyName: string, propertyOptions: PropertyOptions): PropertyMetadata
    {
        const typeDescriptor   = TypeDecorator.injectTypeMetadata(typeCtor, {}, TypeDeclaration.Implicit);
        const metadataInjected = typeDescriptor.propertyMetadataMap.has(propertyName);
        const propertyMetadata = metadataInjected ? typeDescriptor.propertyMetadataMap.get(propertyName)! : new PropertyMetadata(propertyName);

        if (!metadataInjected)
        {
            typeDescriptor.propertyMetadataMap.set(propertyName, propertyMetadata);
        }

        return propertyMetadata.configure(propertyOptions);
    }

    public static buildTypeResolverForAlias(typeAlias: string): TypeResolver
    {
        const typeResolver = () => TypeDecorator.typeCtorMap.get(typeAlias);

        return typeResolver;
    }

    public static buildDecorateFn(propertyOptions: PropertyOptions): Function
    {
        const fn = function (target: any, propertyName: string): void
        {
            const declaringTypeCtor = target.constructor;
            const targetName        = `${Fn.nameOf(declaringTypeCtor)}.${String(propertyName)}`;

            if (Fn.isFunction(target))
            {
                Log.error(`${targetName}: cannot decorate a static property!`);

                return;
            }

            if (Fn.isFunction(target[propertyName])) 
            {
                Log.error(`${targetName}: cannot decorate a method property!`);

                return;
            }

            if (propertyOptions.reflectMetadata && Fn.isNil(propertyOptions.typeResolver))
            {
                const typeCtor = Fn.extractReflectMetadata('design:type', target, propertyName);

                if (!Fn.isNil(typeCtor))
                {
                    propertyOptions.typeResolver = () => typeCtor;
                }
            }

            PropertyDecorator.injectPropertyMetadata(declaringTypeCtor, propertyName, propertyOptions);

            return;
        };

        return fn;
    }
}
