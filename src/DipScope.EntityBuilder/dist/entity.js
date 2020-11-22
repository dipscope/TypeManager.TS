"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = exports.Model = exports.Entity = void 0;
const entity_builder_1 = require("./entity.builder");
const entity_descriptor_1 = require("./entity.descriptor");
/**
 * Entity decorator.
 *
 * Registers entity class in the entity builder. Entity name is
 * unique name for that class.
 *
 * @param {string} entityName Unique name for entity.
 *
 * @returns {Function} Decorator function.
 */
function Entity(entityName) {
    return function (entityCtor) {
        const entityDescriptor = new entity_descriptor_1.EntityDescriptor(entityCtor);
        entityDescriptor.entityName = entityName;
        entity_builder_1.EntityBuilder.registerEntityDescriptor(entityDescriptor);
        return entityCtor;
    };
}
exports.Entity = Entity;
/**
 * Alias for entity decorator.
 *
 * @param {string} modelName Unique name for model.
 *
 * @returns {Function} Decorator function.
 */
function Model(modelName) {
    return Entity(modelName);
}
exports.Model = Model;
/**
 * Alias for entity decorator.
 *
 * @param {string} typeName Unique name for type.
 *
 * @returns {Function} Decorator function.
 */
function Type(typeName) {
    return Entity(typeName);
}
exports.Type = Type;
