import { Serializer } from './core/serializer';
import { TypeAndProperty } from './type-and-property';

/**
 * Serializer decorator.
 * 
 * Used to define custom serializer for type and property.
 * 
 * @param {Serializer<TType>} serializer Serializer.
 * 
 * @returns {ClassDecorator&PropertyDecorator} Class and property decorator.
 */
export function Serializer<TType>(serializer: Serializer<TType>): ClassDecorator & PropertyDecorator
{
    return TypeAndProperty({ serializer: serializer });
}
