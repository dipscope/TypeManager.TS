import { TypeAndProperty } from './type-and-property';

/**
 * Default value decorator.
 * 
 * Used to define default value for type and property.
 * 
 * @param {any} defaultValue Default value.
 * 
 * @returns {ClassDecorator&PropertyDecorator} Class and property decorator.
 */
export function DefaultValue(defaultValue: any): ClassDecorator & PropertyDecorator
{
    return TypeAndProperty({ defaultValue: defaultValue });
}
