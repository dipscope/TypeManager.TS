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
export declare function Property(propertyAlias?: string): Function;
/**
 * Serializable property decorator.
 *
 * Used to define if certain property should be serializable. By default if this
 * decorator is not applied property is serializable and deserializable.
 *
 * @returns {Function} Decorator function.
 */
export declare function Serializable(): Function;
/**
 * Deserializable property decorator.
 *
 * Used to define if certain property should be deserializable. By default if this
 * decorator is not applied property is serializable and deserializable.
 *
 * @returns {Function} Decorator function.
 */
export declare function Deserializable(): Function;
/**
 * Alias for property decorator.
 *
 * @param {string} propAlias Alias for a property.
 *
 * @returns {Function} Decorator function.
 */
export declare function Prop(propAlias?: string): Function;
/**
 * Alias for property decorator.
 *
 * @param {string} attributeAlias Alias for an attribute.
 *
 * @returns {Function} Decorator function.
 */
export declare function Attribute(attributeAlias?: string): Function;
/**
 * Alias for property decorator.
 *
 * @param {string} attrAlias Alias for an attribute.
 *
 * @returns {Function} Decorator function.
 */
export declare function Attr(attrAlias?: string): Function;
/**
 * Alias for serializable decorator.
 *
 * @returns {Function} Decorator function.
 */
export declare function Output(): Function;
/**
 * Alias for deserializable decorator.
 *
 * @returns {Function} Decorator function.
 */
export declare function Input(): Function;
