"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityDescriptor = void 0;
/**
 * Entity descriptor contains information about entity, its properties and transformations.
 *
 * @type {EntityDescriptor}
 */
class EntityDescriptor {
    /**
     * Constructor.
     *
     * @param {Function} entityCtor Entity constructor.
     */
    constructor(entityCtor) {
        /**
         * Property descriptor entity map.
         *
         * Describes available entity properties which were declared by developer.
         * Map key is a property name. Used during serialization.
         *
         * @type {Map<string, PropertyDescriptor>}
         */
        this.propertyDescriptorEntityMap = new Map();
        /**
         * Property descriptor object map.
         *
         * Describes available plain entity object properties which were declared by developer.
         * Map key is a property alias or name. Used during deserialization.
         *
         * @type {Map<string, PropertyDescriptor>}
         */
        this.propertyDescriptorObjectMap = new Map();
        /**
         * Transform descriptor map.
         *
         * Describes available entity property transforms which were declared by developer.
         * Map key is a property name. Used during serialization and deserialization.
         *
         * @type {Map<string, TransformDescriptor>}
         */
        this.transformDescriptorMap = new Map();
        this.entityCtor = entityCtor;
        return;
    }
}
exports.EntityDescriptor = EntityDescriptor;
