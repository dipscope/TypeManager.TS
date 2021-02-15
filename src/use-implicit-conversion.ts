import { TypeAndProperty } from './type-and-property';

/**
 * Use implicit conversion decorator.
 * 
 * Used to define if implicit conversion should be used.
 * 
 * @param {boolean} useImplicitConversion True when implicit conversion should be used. False otherwise.
 * 
 * @returns {ClassDecorator&PropertyDecorator} Class and property decorator.
 */
export function UseImplicitConversion(useImplicitConversion: boolean = true): ClassDecorator & PropertyDecorator
{
    return TypeAndProperty({ useImplicitConversion: useImplicitConversion });
}
