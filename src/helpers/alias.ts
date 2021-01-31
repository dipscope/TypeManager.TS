import { Fn } from './../utils';
import { Type } from './../type';
import { Property } from './../property';

/**
 * Alias decorator.
 * 
 * Can be used on type or property to define an alias.
 * 
 * @param {string} alias Type or property alias.
 * 
 * @returns {ClassDecorator&PropertyDecorator} Class or property decorator.
 */
export function Alias(alias: string): ClassDecorator & PropertyDecorator
{
    return function (target: any, propertyName?: string | symbol): any
    {
        const usedOnClass = Fn.isNil(propertyName);

        if (usedOnClass)
        {
            return Type({ alias: alias })(target);
        }

        return Property({ alias: alias })(target, propertyName!);
    }
}
