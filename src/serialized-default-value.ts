import { DefaultValue } from './core';
import { TypeAndProperty } from './type-and-property';

/**
 * Serialized default value decorator.
 * 
 * Used to define serialized default value for type and property. 
 * 
 * @param {DefaultValue} serializedDefaultValue Default value.
 * 
 * @returns {ClassDecorator&PropertyDecorator} Class and property decorator.
 */
export function SerializedDefaultValue(serializedDefaultValue: DefaultValue): ClassDecorator & PropertyDecorator
{
    return TypeAndProperty({ serializedDefaultValue: serializedDefaultValue });
}
