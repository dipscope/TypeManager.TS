import { Fn } from './../utils';
import { Type } from './../type';
import { Property } from './../property';

/**
 * Use implicit conversion decorator.
 * 
 * Used to define if implicit conversion should be used.
 * 
 * @param {boolean} useImplicitConversion True when implicit conversion should be used. False otherwise.
 * 
 * @returns {Function} Class or property decorator.
 */
export function UseImplicitConversion(useImplicitConversion?: boolean): ClassDecorator & PropertyDecorator
{
    return function (target: any, propertyName?: string | symbol): any
    {
        const usedOnClass = Fn.isNil(propertyName);

        if (usedOnClass)
        {
            return Type({ useImplicitConversion: useImplicitConversion ?? true })(target);
        }

        return Property({ useImplicitConversion: useImplicitConversion ?? true, reflectMetadata: false })(target, propertyName!);
    }
}
