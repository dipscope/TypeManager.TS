import { TypeAndProperty } from './type-and-property';

/**
 * Alias decorator.
 * 
 * Can be used on type and property to define an alias.
 * 
 * @param {string} alias Type or property alias.
 * 
 * @returns {ClassDecorator&PropertyDecorator} Class and property decorator.
 */
export function Alias(alias: string): ClassDecorator & PropertyDecorator
{
    return TypeAndProperty({ alias: alias });
}
