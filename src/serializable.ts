import { Property } from './property';

/**
 * Serializable property decorator.
 * 
 * Used to define if certain property should be serializable. By default if this 
 * decorator is not applied property is serializable and deserializable.
 *
 * @param {boolean} serializable Serializable?
 * 
 * @returns {PropertyDecorator} Property decorator.
 */
export function Serializable(serializable: boolean = true): PropertyDecorator
{
    return Property({ serializable: serializable });
}
