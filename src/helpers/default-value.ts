import { Fn } from './../utils';
import { Type } from './../type';
import { Property } from './../property';

/**
 * Default value decorator.
 * 
 * Used to define default value for type or property.
 * 
 * @param {any} value Value.
 * 
 * @returns {Function} Class or property decorator.
 */
export function DefaultValue(defaultValue: any): ClassDecorator & PropertyDecorator
{
    return function (target: any, propertyName?: string | symbol): any
    {
        const usedOnClass = Fn.isNil(propertyName);

        if (usedOnClass)
        {
            return Type({ defaultValue: defaultValue })(target);
        }

        return Property({ defaultValue: defaultValue, reflectMetadata: false })(target, propertyName!);
    }
}
