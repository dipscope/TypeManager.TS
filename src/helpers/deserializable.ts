import { Property } from './../property';

/**
 * Deserializable property decorator.
 * 
 * Used to define if certain property should be deserializable. By default if this 
 * decorator is not applied property is serializable and deserializable.
 *
 * @returns {PropertyDecorator} Property decorator.
 */
export function Deserializable(): PropertyDecorator
{
    return Property({ deserializable: true, reflectMetadata: false });
}