import { EntityDescriptor } from './entity.descriptor';
import { PropertyDescriptor } from './property.descriptor';
import { RelationDescriptor } from './relation.descriptor';
import { TransformDescriptor } from './transform.descriptor';

/**
 * Main class used for serializing and deserializing entities.
 * 
 * @type {EntityBuilder}
 */
export class EntityBuilder
{
    /**
     * Entity descriptor constructor map.
     * 
     * Describes available entities which were declared by developer based on the entity constructor. 
     * Map key is a constructor function.
     * 
     * @type {Map<Function, EntityDescriptor>}
     */
    public static readonly entityDescriptorCtorMap: Map<new () => any, EntityDescriptor> = new Map<new () => any, EntityDescriptor>();

    /**
     * Entity descriptor name map.
     *
     * Describes available entities which were declared by developer based on the entity name.
     * Map key is an entity name.
     *
     * @type {Map<string, EntityDescriptor>}
     */
    public static readonly entityDescriptorNameMap: Map<string, EntityDescriptor> = new Map<string, EntityDescriptor>();

    /**
     * Registers entity descriptor.
     * 
     * @param {EntityDescriptor} entityDescriptor Entity descriptor to register.
     *
     * @return {EntityDescriptor} Mapped entity descriptor.
     */
    public static registerEntityDescriptor(entityDescriptor: EntityDescriptor): EntityDescriptor
    {
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
    public static registerPropertyDescriptor(propertyDescriptor: PropertyDescriptor): PropertyDescriptor
    {
        const entityDescriptor       = new EntityDescriptor(propertyDescriptor.entityCtor);
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
    public static registerTransformDescriptor(transformDescriptor: TransformDescriptor): TransformDescriptor
    {
        const entityDescriptor       = new EntityDescriptor(transformDescriptor.entityCtor);
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
     * @param {string|any|any[]} input JSON string, object or array of objects.
     * @param {Map<any, any>} relationEntityMap Map used to resolve circular references.
     *
     * @returns {any|null} Null, entity or array of entities depending from the input.
     */
    public static buildEntity(entityCtor: new () => any, input: string | any | any[], relationEntityMap: Map<any, any> = new Map<any, any>()): any | null
    {
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
        const objects  = Array.isArray(input) ? input : [input];
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

                const entityPropertyName  = propertyDescriptor.propertyName;
                const entityPropertyValue = object[objectPropertyName];
                const relationDescriptor  = propertyDescriptor instanceof RelationDescriptor ? propertyDescriptor : null;

                if (relationDescriptor && entityPropertyValue) {

                    const objectEntityPropertyValue = typeof entityPropertyValue === typeof {};

                    if (!objectEntityPropertyValue || (!relationDescriptor.relationEntityCtor && !relationDescriptor.relationEntityName)) {
                        continue;
                    }

                    const relationEntityDescriptor = relationDescriptor.relationEntityCtor
                        ? this.entityDescriptorCtorMap.get(relationDescriptor.relationEntityCtor!)
                        : this.entityDescriptorNameMap.get(relationDescriptor.relationEntityName!);

                    if (!relationEntityDescriptor) {
                        continue;
                    }

                    let relationEntity = relationEntityMap.get(entityPropertyValue);

                    if (!relationEntity) {
                        relationEntity = this.buildEntity(relationEntityDescriptor.entityCtor, entityPropertyValue, relationEntityMap);
                        relationEntityMap.set(entityPropertyValue, relationEntity);
                    }

                    entity[entityPropertyName] = relationEntity;

                } else {
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
     * @param {string|any|any[]} input JSON string, entity object or array of entity objects.
     * @param {Map<any, any>} relationObjectMap Map used to resolve circular references.
     *
     * @returns {any|null} Null, object or array of objects depending from the input.
     */
    public static buildObject(entityCtor: new () => any, input: string | any | any[], relationObjectMap: Map<any, any> = new Map<any, any>()): any | null
    {
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

        const objects  = [];
        const entities = Array.isArray(input) ? input : [input];
        const multiple = Array.isArray(input);

        for (let entity of entities) {
            const object = {} as any;

            for (let entityPropertyName in entity) {
                const propertyDescriptor = entityDescriptor.propertyDescriptorEntityMap.get(entityPropertyName);

                if (!propertyDescriptor || (propertyDescriptor.serializationConfigured && !propertyDescriptor.serializable)) {
                    continue;
                }

                const objectPropertyName  = propertyDescriptor.propertyAlias || propertyDescriptor.propertyName;
                const objectPropertyValue = entity[entityPropertyName];
                const relationDescriptor  = propertyDescriptor instanceof RelationDescriptor ? propertyDescriptor : null;

                if (relationDescriptor && objectPropertyValue) {

                    const objectObjectPropertyValue = typeof objectPropertyValue === typeof {};

                    if (!objectObjectPropertyValue || (!relationDescriptor.relationEntityCtor && !relationDescriptor.relationEntityName)) {
                        continue;
                    }

                    const relationEntityDescriptor = relationDescriptor.relationEntityCtor
                        ? this.entityDescriptorCtorMap.get(relationDescriptor.relationEntityCtor!)
                        : this.entityDescriptorNameMap.get(relationDescriptor.relationEntityName!);

                    if (!relationEntityDescriptor) {
                        continue;
                    }

                    let relationObject = relationObjectMap.get(objectPropertyValue);

                    if (!relationObject) {
                        relationObject = this.buildObject(relationEntityDescriptor.entityCtor, objectPropertyValue, relationObjectMap);
                        relationObjectMap.set(objectPropertyValue, relationObject);
                    }

                    object[objectPropertyName] = relationObject;

                } else {
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
     * @param {string|any|any[]} input JSON string, entity object or array of entity objects.
     *
     * @returns {string|null} Null or JSON string.
     */
    public static buildJson(entityCtor: new () => any, input: string | any | any[]): string | null
    {
        const object = this.buildObject(entityCtor, input);

        return object ? JSON.stringify(object) : null;
    }
}
