import { DefaultValue } from './core';
import { TypeAndProperty } from './type-and-property';

/**
 * Deserialized default value decorator.
 * 
 * Used to define deserialized default value for type and property. 
 * 
 * @param {DefaultValue} deserializedDefaultValue Default value.
 * 
 * @returns {ClassDecorator&PropertyDecorator} Class and property decorator.
 */
export function DeserializedDefaultValue(deserializedDefaultValue: DefaultValue): ClassDecorator & PropertyDecorator
{
    return TypeAndProperty({ deserializedDefaultValue: deserializedDefaultValue });
}
