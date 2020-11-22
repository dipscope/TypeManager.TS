"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entityToObject = exports.objectToEntity = exports.entityToJson = exports.jsonToEntity = void 0;
const entity_builder_1 = require("./entity.builder");
/**
 * Converts JSON string to entity.
 *
 * @param {Function} entityCtor Entity constructor.
 * @param {string|object|object[]} json JSON string, object or array of objects.
 *
 * @returns {any} Entity.
 */
function jsonToEntity(entityCtor, json) {
    return entity_builder_1.EntityBuilder.buildEntity(entityCtor, json);
}
exports.jsonToEntity = jsonToEntity;
/**
 * Converts entity to JSON string.
 *
 * @param {Function} entityCtor Entity constructor.
 * @param {any} entity Entity.
 *
 * @returns {string} JSON string.
 */
function entityToJson(entityCtor, entity) {
    return entity_builder_1.EntityBuilder.buildJson(entityCtor, entity);
}
exports.entityToJson = entityToJson;
/**
 * Converts object to entity.
 *
 * @param {Function} entityCtor Entity constructor.
 * @param {string|object|object[]} object JSON string, object or array of objects.
 *
 * @returns {any} Entity.
 */
function objectToEntity(entityCtor, object) {
    return entity_builder_1.EntityBuilder.buildEntity(entityCtor, object);
}
exports.objectToEntity = objectToEntity;
/**
 * Converts entity to object.
 *
 * @param {Function} entityCtor Entity constructor.
 * @param {any} entity Entity.
 *
 * @returns {object} Entity object.
 */
function entityToObject(entityCtor, entity) {
    return entity_builder_1.EntityBuilder.buildObject(entityCtor, entity);
}
exports.entityToObject = entityToObject;
