"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyDescriptor = void 0;
/**
 * Property descriptor contains information about certain entity property.
 *
 * @type {PropertyDescriptor}
 */
class PropertyDescriptor {
    /**
     * Constructor.
     *
     * @param {Function} entityCtor Entity constructor.
     * @param {string} propertyName Property name.
     */
    constructor(entityCtor, propertyName) {
        this.entityCtor = entityCtor;
        this.propertyName = propertyName;
        return;
    }
    /**
     * Checks if serialization configured for this property descriptor.
     *
     * @returns {boolean} True when serialization is configured. False otherwise.
     */
    get serializationConfigured() {
        return this.serializable || this.deserializable;
    }
}
exports.PropertyDescriptor = PropertyDescriptor;
