import { Property } from './../property';

/**
 * Deserializable property decorator.
 * 
 * Used to define if certain property should be deserializable. By default if this 
 * decorator is not applied property is serializable and deserializable.
 *
 * @param {boolean} deserializable Serializable?
 * 
 * @returns {PropertyDecorator} Property decorator.
 */
export function Deserializable(deserializable?: boolean): PropertyDecorator
{
    return Property({ deserializable: deserializable ?? true, reflectMetadata: false });
}