import { Fn } from './../utils';
import { TypeInjector } from './../type.injector';
import { Type } from './../type';
import { Property } from './../property';

/**
 * Type injector decorator.
 * 
 * Used to define custom type injector for type or property.
 * 
 * @param {TypeInjector} typeInjector Type injector.
 * 
 * @returns {ClassDecorator&PropertyDecorator} Class or property decorator.
 */
export function TypeInjector(typeInjector: TypeInjector): ClassDecorator & PropertyDecorator
{
    return function (target: any, propertyName?: string | symbol): any
    {
        const usedOnClass = Fn.isNil(propertyName);

        if (usedOnClass)
        {
            return Type({ typeInjector: typeInjector })(target);
        }

        return Property({ typeInjector: typeInjector })(target, propertyName!);
    }
}
