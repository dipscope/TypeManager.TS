import { Fn } from './../utils';
import { TypeFactory } from './../type.factory';
import { Type } from './../type';
import { Property } from './../property';

/**
 * Type factory decorator.
 * 
 * Used to define custom type factory for type or property.
 * 
 * @param {TypeFactory<TType>} typeFactory Type factory.
 * 
 * @returns {ClassDecorator&PropertyDecorator} Class or property decorator.
 */
export function TypeFactory<TType>(typeFactory: TypeFactory<TType>): ClassDecorator & PropertyDecorator
{
    return function (target: any, propertyName?: string | symbol): any
    {
        const usedOnClass = Fn.isNil(propertyName);

        if (usedOnClass)
        {
            return Type({ typeFactory: typeFactory })(target);
        }

        return Property({ typeFactory: typeFactory })(target, propertyName!);
    }
}
