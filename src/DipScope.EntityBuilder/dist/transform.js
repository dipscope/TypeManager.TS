"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Convert = exports.Transform = void 0;
const entity_builder_1 = require("./entity.builder");
const transform_descriptor_1 = require("./transform.descriptor");
/**
 * Property transform decorator.
 *
 * Used to apply additional property transformation.
 * For example transform date string to date time object and etc.
 *
 * @param {Function} deserializeFn Deserialize function.
 * @param {Function} serializeFn Serialize function.
 *
 * @returns {Function} Decorator function.
 */
function Transform(deserializeFn = (x) => x, serializeFn = (x) => x) {
    return function (target, propertyName) {
        const transformDescriptor = new transform_descriptor_1.TransformDescriptor(target.constructor, propertyName, serializeFn, deserializeFn);
        entity_builder_1.EntityBuilder.registerTransformDescriptor(transformDescriptor);
        return;
    };
}
exports.Transform = Transform;
/**
 * Alias for transform decorator.
 *
 * @param {Function} deserializeFn Deserialize function.
 * @param {Function} serializeFn Serialize function.
 *
 * @returns {Function}  Decorator function.
 */
function Convert(deserializeFn = (x) => x, serializeFn = (x) => x) {
    return Transform(deserializeFn, serializeFn);
}
exports.Convert = Convert;
