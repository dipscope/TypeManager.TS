import { Property } from './../property';

/**
 * Serializable property decorator.
 * 
 * Used to define if certain property should be serializable. By default if this 
 * decorator is not applied property is serializable and deserializable.
 *
 * @returns {PropertyDecorator} Property decorator.
 */
export function Serializable(): PropertyDecorator
{
    return Property({ serializable: true, reflectMetadata: false });
}
