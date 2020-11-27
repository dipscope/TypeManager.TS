import { EntityBuilder } from './entity.builder';
import { PropertyDescriptor } from './property.descriptor';

/**
 * Property decorator.
 *
 * Used to define the certain entity property.
 * Property alias is an optional name if it differs in the plain object.
 * 
 * @param {string} propertyAlias Alias for a property.
 *
 * @returns {Function} Decorator function.
 */
export function Property(propertyAlias?: string): Function
{
    return function (target: any, propertyName: string): void
    {
        const propertyDescriptor = new PropertyDescriptor(target.constructor, propertyName);

        propertyDescriptor.propertyAlias = propertyAlias;

        EntityBuilder.registerPropertyDescriptor(propertyDescriptor);

        return;
    }
}

/**
 * Serializable property decorator.
 * 
 * Used to define if certain property should be serializable. By default if this 
 * decorator is not applied property is serializable and deserializable.
 *
 * @returns {Function} Decorator function.
 */
export function Serializable(): Function
{
    return function (target: any, propertyName: string): void
    {
        const propertyDescriptor = new PropertyDescriptor(target.constructor, propertyName);

        propertyDescriptor.serializable = true;

        EntityBuilder.registerPropertyDescriptor(propertyDescriptor);

        return;
    }
}

/**
 * Deserializable property decorator.
 * 
 * Used to define if certain property should be deserializable. By default if this 
 * decorator is not applied property is serializable and deserializable.
 *
 * @returns {Function} Decorator function.
 */
export function Deserializable(): Function
{
    return function (target: any, propertyName: string): void
    {
        const propertyDescriptor = new PropertyDescriptor(target.constructor, propertyName);

        propertyDescriptor.deserializable = true;

        EntityBuilder.registerPropertyDescriptor(propertyDescriptor);

        return;
    }
}

/**
 * Alias for property decorator.
 *
 * @param {string} propAlias Alias for a property.
 *
 * @returns {Function} Decorator function.
 */
export function Prop(propAlias?: string): Function
{
    return Property(propAlias);
}

/**
 * Alias for property decorator.
 *
 * @param {string} attributeAlias Alias for an attribute.
 *
 * @returns {Function} Decorator function.
 */
export function Attribute(attributeAlias?: string): Function
{
    return Property(attributeAlias);
}

/**
 * Alias for property decorator.
 *
 * @param {string} attrAlias Alias for an attribute.
 *
 * @returns {Function} Decorator function.
 */
export function Attr(attrAlias?: string): Function
{
    return Property(attrAlias);
}
