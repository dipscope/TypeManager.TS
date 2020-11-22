import { PropertyDescriptor } from './property.descriptor';
import { TransformDescriptor } from './transform.descriptor';
/**
 * Entity descriptor contains information about entity, its properties and transformations.
 *
 * @type {EntityDescriptor}
 */
export declare class EntityDescriptor {
    /**
     * Entity constructor.
     *
     * @type {Function}
     */
    entityCtor: new () => any;
    /**
     * Entity name defined by developer.
     *
     * @type {string}
     */
    entityName?: string;
    /**
     * Property descriptor entity map.
     *
     * Describes available entity properties which were declared by developer.
     * Map key is a property name. Used during serialization.
     *
     * @type {Map<string, PropertyDescriptor>}
     */
    readonly propertyDescriptorEntityMap: Map<string, PropertyDescriptor>;
    /**
     * Property descriptor object map.
     *
     * Describes available plain entity object properties which were declared by developer.
     * Map key is a property alias or name. Used during deserialization.
     *
     * @type {Map<string, PropertyDescriptor>}
     */
    readonly propertyDescriptorObjectMap: Map<string, PropertyDescriptor>;
    /**
     * Transform descriptor map.
     *
     * Describes available entity property transforms which were declared by developer.
     * Map key is a property name. Used during serialization and deserialization.
     *
     * @type {Map<string, TransformDescriptor>}
     */
    readonly transformDescriptorMap: Map<string, TransformDescriptor>;
    /**
     * Constructor.
     *
     * @param {Function} entityCtor Entity constructor.
     */
    constructor(entityCtor: new () => any);
}
