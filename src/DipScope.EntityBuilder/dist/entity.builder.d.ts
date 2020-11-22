import { EntityDescriptor } from './entity.descriptor';
import { PropertyDescriptor } from './property.descriptor';
import { TransformDescriptor } from './transform.descriptor';
/**
 * Main class used for serializing and deserializing entities.
 *
 * @type {EntityBuilder}
 */
export declare class EntityBuilder {
    /**
     * Entity descriptor constructor map.
     *
     * Describes available entities which were declared by developer based on the entity constructor.
     * Map key is a constructor function.
     *
     * @type {Map<Function, EntityDescriptor>}
     */
    static readonly entityDescriptorCtorMap: Map<new () => any, EntityDescriptor>;
    /**
     * Entity descriptor name map.
     *
     * Describes available entities which were declared by developer based on the entity name.
     * Map key is an entity name.
     *
     * @type {Map<string, EntityDescriptor>}
     */
    static readonly entityDescriptorNameMap: Map<string, EntityDescriptor>;
    /**
     * Registers entity descriptor.
     *
     * @param {EntityDescriptor} entityDescriptor Entity descriptor to register.
     *
     * @return {EntityDescriptor} Mapped entity descriptor.
     */
    static registerEntityDescriptor(entityDescriptor: EntityDescriptor): EntityDescriptor;
    /**
     * Registers property descriptor.
     *
     * @param {PropertyDescriptor} propertyDescriptor Property descriptor to register.
     *
     * @returns {PropertyDescriptor} Mapped property descriptor.
     */
    static registerPropertyDescriptor(propertyDescriptor: PropertyDescriptor): PropertyDescriptor;
    /**
     * Registers transform descriptor.
     *
     * @param {TransformDescriptor} transformDescriptor Transform descriptor to register.
     *
     * @returns {TransformDescriptor} Mapped transform descriptor.
     */
    static registerTransformDescriptor(transformDescriptor: TransformDescriptor): TransformDescriptor;
    /**
     * Builds entity for provided entity constructor.
     *
     * @param {Function} entityCtor Entity constructor.
     * @param {string|object|object[]} input JSON string, object or array of objects.
     * @param {Map<object, any>} relationEntityMap Map used to resolve circular references.
     *
     * @returns {any} Null, entity or array of entities depending from the input.
     */
    static buildEntity(entityCtor: new () => any, input: string | object | object[], relationEntityMap?: Map<object, any>): any;
    /**
     * Builds object for provided entity constructor.
     *
     * @param {Function} entityCtor Entity constructor.
     * @param {string|object|object[]} input JSON string, entity object or array of entity objects.
     * @param {Map<object, any>} relationObjectMap Map used to resolve circular references.
     *
     * @returns {any} Null, object or array of objects depending from the input.
     */
    static buildObject(entityCtor: new () => any, input: string | object | object[], relationObjectMap?: Map<object, any>): object;
    /**
     * Builds JSON string for provided entity constructor.
     *
     * @param {Function} entityCtor Entity constructor.
     * @param {string|object|object[]} input JSON string, entity object or array of entity objects.
     *
     * @returns {any} Null or JSON string.
     */
    static buildJson(entityCtor: new () => any, input: string | object | object[]): string;
}
