import { CustomData } from './core';
import { TypeAndProperty } from './type-and-property';

/**
 * Custom data decorator.
 * 
 * Used to define custom data for type and property.
 * 
 * @param {CustomData} customData Custom data.
 * 
 * @returns {ClassDecorator&PropertyDecorator} Class and property decorator.
 */
export function CustomData(customData: CustomData): ClassDecorator & PropertyDecorator
{
    return TypeAndProperty({ customData: customData });
}
