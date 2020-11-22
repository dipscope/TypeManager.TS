"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = exports.Output = exports.Attr = exports.Attribute = exports.Prop = exports.Deserializable = exports.Serializable = exports.Property = void 0;
const entity_builder_1 = require("./entity.builder");
const property_descriptor_1 = require("./property.descriptor");
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
function Property(propertyAlias) {
    return function (target, propertyName) {
        const propertyDescriptor = new property_descriptor_1.PropertyDescriptor(target.constructor, propertyName);
        propertyDescriptor.propertyAlias = propertyAlias;
        entity_builder_1.EntityBuilder.registerPropertyDescriptor(propertyDescriptor);
        return;
    };
}
exports.Property = Property;
/**
 * Serializable property decorator.
 *
 * Used to define if certain property should be serializable. By default if this
 * decorator is not applied property is serializable and deserializable.
 *
 * @returns {Function} Decorator function.
 */
function Serializable() {
    return function (target, propertyName) {
        const propertyDescriptor = new property_descriptor_1.PropertyDescriptor(target.constructor, propertyName);
        propertyDescriptor.serializable = true;
        entity_builder_1.EntityBuilder.registerPropertyDescriptor(propertyDescriptor);
        return;
    };
}
exports.Serializable = Serializable;
/**
 * Deserializable property decorator.
 *
 * Used to define if certain property should be deserializable. By default if this
 * decorator is not applied property is serializable and deserializable.
 *
 * @returns {Function} Decorator function.
 */
function Deserializable() {
    return function (target, propertyName) {
        const propertyDescriptor = new property_descriptor_1.PropertyDescriptor(target.constructor, propertyName);
        propertyDescriptor.deserializable = true;
        entity_builder_1.EntityBuilder.registerPropertyDescriptor(propertyDescriptor);
        return;
    };
}
exports.Deserializable = Deserializable;
/**
 * Alias for property decorator.
 *
 * @param {string} propAlias Alias for a property.
 *
 * @returns {Function} Decorator function.
 */
function Prop(propAlias) {
    return Property(propAlias);
}
exports.Prop = Prop;
/**
 * Alias for property decorator.
 *
 * @param {string} attributeAlias Alias for an attribute.
 *
 * @returns {Function} Decorator function.
 */
function Attribute(attributeAlias) {
    return Property(attributeAlias);
}
exports.Attribute = Attribute;
/**
 * Alias for property decorator.
 *
 * @param {string} attrAlias Alias for an attribute.
 *
 * @returns {Function} Decorator function.
 */
function Attr(attrAlias) {
    return Property(attrAlias);
}
exports.Attr = Attr;
/**
 * Alias for serializable decorator.
 *
 * @returns {Function} Decorator function.
 */
function Output() {
    return Serializable();
}
exports.Output = Output;
/**
 * Alias for deserializable decorator.
 *
 * @returns {Function} Decorator function.
 */
function Input() {
    return Deserializable();
}
exports.Input = Input;
