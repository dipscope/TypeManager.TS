"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityBuilder = void 0;
const entity_descriptor_1 = require("./entity.descriptor");
const relation_descriptor_1 = require("./relation.descriptor");
/**
 * Main class used for serializing and deserializing entities.
 *
 * @type {EntityBuilder}
 */
class EntityBuilder {
    /**
     * Registers entity descriptor.
     *
     * @param {EntityDescriptor} entityDescriptor Entity descriptor to register.
     *
     * @return {EntityDescriptor} Mapped entity descriptor.
     */
    static registerEntityDescriptor(entityDescriptor) {
        let mappedEntityDescriptor = this.entityDescriptorCtorMap.get(entityDescriptor.entityCtor);
        if (!mappedEntityDescriptor) {
            mappedEntityDescriptor = entityDescriptor;
            this.entityDescriptorCtorMap.set(mappedEntityDescriptor.entityCtor, mappedEntityDescriptor);
        }
        if (entityDescriptor.entityName) {
            mappedEntityDescriptor.entityName = entityDescriptor.entityName;
            this.entityDescriptorNameMap.set(mappedEntityDescriptor.entityName, mappedEntityDescriptor);
        }
        return mappedEntityDescriptor;
    }
    /**
     * Registers property descriptor.
     *
     * @param {PropertyDescriptor} propertyDescriptor Property descriptor to register.
     *
     * @returns {PropertyDescriptor} Mapped property descriptor.
     */
    static registerPropertyDescriptor(propertyDescriptor) {
        const entityDescriptor = new entity_descriptor_1.EntityDescriptor(propertyDescriptor.entityCtor);
        const mappedEntityDescriptor = this.registerEntityDescriptor(entityDescriptor);
        let mappedPropertyDescriptor = mappedEntityDescriptor.propertyDescriptorEntityMap.get(propertyDescriptor.propertyName);
        if (!mappedPropertyDescriptor) {
            mappedPropertyDescriptor = propertyDescriptor;
            mappedEntityDescriptor.propertyDescriptorEntityMap.set(mappedPropertyDescriptor.propertyName, mappedPropertyDescriptor);
            mappedEntityDescriptor.propertyDescriptorObjectMap.set(mappedPropertyDescriptor.propertyAlias || mappedPropertyDescriptor.propertyName, mappedPropertyDescriptor);
        }
        if (propertyDescriptor.propertyAlias) {
            mappedPropertyDescriptor.propertyAlias = propertyDescriptor.propertyAlias;
            mappedEntityDescriptor.propertyDescriptorObjectMap.set(mappedPropertyDescriptor.propertyAlias, mappedPropertyDescriptor);
        }
        if (propertyDescriptor.serializationConfigured && propertyDescriptor.serializable) {
            mappedPropertyDescriptor.serializable = propertyDescriptor.serializable;
        }
        if (propertyDescriptor.serializationConfigured && propertyDescriptor.deserializable) {
            mappedPropertyDescriptor.deserializable = propertyDescriptor.deserializable;
        }
        return mappedPropertyDescriptor;
    }
    /**
     * Registers transform descriptor.
     *
     * @param {TransformDescriptor} transformDescriptor Transform descriptor to register.
     *
     * @returns {TransformDescriptor} Mapped transform descriptor.
     */
    static registerTransformDescriptor(transformDescriptor) {
        const entityDescriptor = new entity_descriptor_1.EntityDescriptor(transformDescriptor.entityCtor);
        const mappedEntityDescriptor = this.registerEntityDescriptor(entityDescriptor);
        let mappedTransformDescriptor = mappedEntityDescriptor.transformDescriptorMap.get(transformDescriptor.propertyName);
        if (!mappedTransformDescriptor) {
            mappedTransformDescriptor = transformDescriptor;
            mappedEntityDescriptor.transformDescriptorMap.set(mappedTransformDescriptor.propertyName, mappedTransformDescriptor);
        }
        return mappedTransformDescriptor;
    }
    /**
     * Builds entity for provided entity constructor.
     *
     * @param {Function} entityCtor Entity constructor.
     * @param {string|object|object[]} input JSON string, object or array of objects.
     * @param {Map<object, any>} relationEntityMap Map used to resolve circular references.
     *
     * @returns {any} Null, entity or array of entities depending from the input.
     */
    static buildEntity(entityCtor, input, relationEntityMap = new Map()) {
        const entityDescriptor = this.entityDescriptorCtorMap.get(entityCtor);
        if (!entityDescriptor || !input) {
            return null;
        }
        const stringInput = typeof input === typeof 'string';
        const objectInput = typeof input === typeof {};
        if (!stringInput && !objectInput) {
            return null;
        }
        if (stringInput) {
            input = JSON.parse(String(input));
        }
        const entities = [];
        const objects = Array.isArray(input) ? input : [input];
        const multiple = Array.isArray(input);
        for (let object of objects) {
            const entity = new entityCtor();
            if (entityDescriptor.entityName) {
                entity.$entityName = entityDescriptor.entityName;
            }
            for (let objectPropertyName in object) {
                const propertyDescriptor = entityDescriptor.propertyDescriptorObjectMap.get(objectPropertyName);
                if (!propertyDescriptor || (propertyDescriptor.serializationConfigured && !propertyDescriptor.deserializable)) {
                    continue;
                }
                const entityPropertyName = propertyDescriptor.propertyName;
                const entityPropertyValue = object[objectPropertyName];
                const relationDescriptor = propertyDescriptor instanceof relation_descriptor_1.RelationDescriptor ? propertyDescriptor : null;
                if (relationDescriptor && entityPropertyValue) {
                    const objectEntityPropertyValue = typeof entityPropertyValue === typeof {};
                    if (!objectEntityPropertyValue || (!relationDescriptor.entityCtor && !relationDescriptor.relationEntityName)) {
                        continue;
                    }
                    const relationEntityDescriptor = relationDescriptor.entityCtor
                        ? this.entityDescriptorCtorMap.get(relationDescriptor.entityCtor)
                        : this.entityDescriptorNameMap.get(relationDescriptor.relationEntityName);
                    if (!relationEntityDescriptor) {
                        continue;
                    }
                    let relationEntity = relationEntityMap.get(entityPropertyValue);
                    if (!relationEntity) {
                        relationEntity = this.buildEntity(relationEntityDescriptor.entityCtor, entityPropertyValue, relationEntityMap);
                        relationEntityMap.set(entityPropertyValue, relationEntity);
                    }
                    entity[entityPropertyName] = relationEntity;
                }
                else {
                    entity[entityPropertyName] = entityPropertyValue;
                }
                const transformDescriptor = entityDescriptor.transformDescriptorMap.get(propertyDescriptor.propertyName);
                if (transformDescriptor) {
                    entity[entityPropertyName] = transformDescriptor.deserializeFn(entity[entityPropertyName]);
                }
            }
            entities.push(entity);
        }
        return multiple ? entities : (entities.length > 0 ? entities.shift() : null);
    }
    /**
     * Builds object for provided entity constructor.
     *
     * @param {Function} entityCtor Entity constructor.
     * @param {string|object|object[]} input JSON string, entity object or array of entity objects.
     * @param {Map<object, any>} relationObjectMap Map used to resolve circular references.
     *
     * @returns {any} Null, object or array of objects depending from the input.
     */
    static buildObject(entityCtor, input, relationObjectMap = new Map()) {
        const entityDescriptor = this.entityDescriptorCtorMap.get(entityCtor);
        if (!entityDescriptor || !input) {
            return null;
        }
        const stringInput = typeof input === typeof 'string';
        const objectInput = typeof input === typeof {};
        if (!stringInput && !objectInput) {
            return null;
        }
        if (stringInput) {
            input = JSON.parse(String(input));
        }
        const objects = [];
        const entities = Array.isArray(input) ? input : [input];
        const multiple = Array.isArray(input);
        for (let entity of entities) {
            const object = {};
            for (let entityPropertyName in entity) {
                const propertyDescriptor = entityDescriptor.propertyDescriptorEntityMap.get(entityPropertyName);
                if (!propertyDescriptor || (propertyDescriptor.serializationConfigured && !propertyDescriptor.serializable)) {
                    continue;
                }
                const objectPropertyName = propertyDescriptor.propertyAlias || propertyDescriptor.propertyName;
                const objectPropertyValue = entity[entityPropertyName];
                const relationDescriptor = propertyDescriptor instanceof relation_descriptor_1.RelationDescriptor ? propertyDescriptor : null;
                if (relationDescriptor && objectPropertyValue) {
                    const objectObjectPropertyValue = typeof objectPropertyValue === typeof {};
                    if (!objectObjectPropertyValue || (!relationDescriptor.entityCtor && !relationDescriptor.relationEntityName)) {
                        continue;
                    }
                    const relationEntityDescriptor = relationDescriptor.entityCtor
                        ? this.entityDescriptorCtorMap.get(relationDescriptor.entityCtor)
                        : this.entityDescriptorNameMap.get(relationDescriptor.relationEntityName);
                    if (!relationEntityDescriptor) {
                        continue;
                    }
                    let relationObject = relationObjectMap.get(objectPropertyValue);
                    if (!relationObject) {
                        relationObject = this.buildObject(relationEntityDescriptor.entityCtor, objectPropertyValue, relationObjectMap);
                        relationObjectMap.set(objectPropertyValue, relationObject);
                    }
                    object[objectPropertyName] = relationObject;
                }
                else {
                    object[objectPropertyName] = objectPropertyValue;
                }
                const transformDescriptor = entityDescriptor.transformDescriptorMap.get(propertyDescriptor.propertyName);
                if (transformDescriptor) {
                    object[objectPropertyName] = transformDescriptor.serializeFn(object[objectPropertyName]);
                }
            }
            objects.push(object);
        }
        return multiple ? objects : (objects.length > 0 ? objects.shift() : null);
    }
    /**
     * Builds JSON string for provided entity constructor.
     *
     * @param {Function} entityCtor Entity constructor.
     * @param {string|object|object[]} input JSON string, entity object or array of entity objects.
     *
     * @returns {any} Null or JSON string.
     */
    static buildJson(entityCtor, input) {
        const object = this.buildObject(entityCtor, input);
        return object ? JSON.stringify(object) : null;
    }
}
exports.EntityBuilder = EntityBuilder;
/**
 * Entity descriptor constructor map.
 *
 * Describes available entities which were declared by developer based on the entity constructor.
 * Map key is a constructor function.
 *
 * @type {Map<Function, EntityDescriptor>}
 */
EntityBuilder.entityDescriptorCtorMap = new Map();
/**
 * Entity descriptor name map.
 *
 * Describes available entities which were declared by developer based on the entity name.
 * Map key is an entity name.
 *
 * @type {Map<string, EntityDescriptor>}
 */
EntityBuilder.entityDescriptorNameMap = new Map();
