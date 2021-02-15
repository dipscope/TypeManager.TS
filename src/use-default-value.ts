import { TypeAndProperty } from './type-and-property';

/**
 * Use default value decorator.
 * 
 * Used to define if default value should be used.
 * 
 * @param {boolean} useDefaultValue True when default value should be used. False otherwise.
 * 
 * @returns {ClassDecorator&PropertyDecorator} Class and property decorator.
 */
export function UseDefaultValue(useDefaultValue: boolean = true): ClassDecorator & PropertyDecorator
{
    return TypeAndProperty({ useDefaultValue: useDefaultValue });
}
