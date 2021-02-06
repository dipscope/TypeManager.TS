import { Fn } from './../utils';
import { TypeSerializer } from './../type.serializer';
import { Type } from './../type';
import { Property } from './../property';

/**
 * Type serializer decorator.
 * 
 * Used to define custom type serializer for type or property.
 * 
 * @param {TypeSerializer} typeSerializer Type serializer.
 * 
 * @returns {ClassDecorator&PropertyDecorator} Class or property decorator.
 */
export function TypeSerializer(typeSerializer: TypeSerializer): ClassDecorator & PropertyDecorator
{
    return function (target: any, propertyName?: string | symbol): any
    {
        const usedOnClass = Fn.isNil(propertyName);

        if (usedOnClass)
        {
            return Type({ typeSerializer: typeSerializer })(target);
        }

        return Property({ typeSerializer: typeSerializer })(target, propertyName!);
    }
}
