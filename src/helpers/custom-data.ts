import { Fn } from './../utils';
import { CustomData } from './../custom.data';
import { Type } from './../type';
import { Property } from './../property';

/**
 * Custom data decorator.
 * 
 * Used to define custom data for type or property.
 * 
 * @param {CustomData} customData Custom data.
 * 
 * @returns {ClassDecorator&PropertyDecorator} Class or property decorator.
 */
export function CustomData(customData: CustomData): ClassDecorator & PropertyDecorator
{
    return function (target: any, propertyName?: string | symbol): any
    {
        const usedOnClass = Fn.isNil(propertyName);

        if (usedOnClass)
        {
            return Type({ customData: customData })(target);
        }

        return Property({ customData: customData })(target, propertyName!);
    }
}
