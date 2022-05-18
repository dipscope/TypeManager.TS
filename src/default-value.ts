import { DefaultValue } from './core';
import { TypeAndProperty } from './type-and-property';

/**
 * Default value decorator.
 * 
 * Used to define serialized and deserialized default value for type and property. 
 * 
 * @param {DefaultValue} defaultValue Default value.
 * 
 * @returns {ClassDecorator&PropertyDecorator} Class and property decorator.
 */
export function DefaultValue(defaultValue: DefaultValue): ClassDecorator & PropertyDecorator
{
    return TypeAndProperty({ serializedDefaultValue: defaultValue, deserializedDefaultValue: defaultValue });
}
