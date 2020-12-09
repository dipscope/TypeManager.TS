import { Fn } from './../utils';
import { TypeSerializer } from './../type.serializer';
import { Type } from './../type';
import { Property } from './../property';

/**
 * Serializer decorator.
 * 
 * Used to define custom serializer for type or property.
 * 
 * @param {TypeSerializer<any, any>} typeSerializer Type serializer.
 * 
 * @returns {Function} Class or property decorator.
 */
export function Serializer(typeSerializer: TypeSerializer<any, any>): Function
{
    return function (target: any, propertyName?: string | symbol): any
    {
        const usedOnClass = Fn.isNil(propertyName);

        if (usedOnClass)
        {
            return Type({ typeSerializer: typeSerializer })(target);
        }

        return Property({ typeSerializer: typeSerializer, reflectMetadata: false })(target, propertyName!);
    }
}
