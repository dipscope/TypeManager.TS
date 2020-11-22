"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rel = exports.Relation = void 0;
const entity_builder_1 = require("./entity.builder");
const relation_descriptor_1 = require("./relation.descriptor");
/**
 * Relation property decorator.
 *
 * Used to define that certain entity property is a relation to another entity.
 * Entity relation can be a constructor or entity name defined by developer.
 *
 * @param {string|Function} relationEntity Relation entity constructor or unique name.
 * @param {string} propertyAlias Alias for a property.
 *
 * @returns {Function} Decorator function.
 */
function Relation(relationEntity, propertyAlias) {
    return function (target, propertyName) {
        const relationDescriptor = new relation_descriptor_1.RelationDescriptor(target.constructor, propertyName);
        if (typeof relationEntity === typeof 'string') {
            relationDescriptor.relationEntityName = relationEntity;
        }
        else {
            relationDescriptor.relationEntityCtor = relationEntity;
        }
        relationDescriptor.propertyAlias = propertyAlias;
        entity_builder_1.EntityBuilder.registerPropertyDescriptor(relationDescriptor);
        return;
    };
}
exports.Relation = Relation;
/**
 * Alias for relation decorator.
 *
 * @param {string|Function} relationEntity Relation entity constructor or unique name.
 * @param {string} propertyAlias Alias for a property.
 *
 * @returns {Function} Decorator function.
 */
function Rel(relationEntity, propertyAlias) {
    return Relation(relationEntity, propertyAlias);
}
exports.Rel = Rel;
