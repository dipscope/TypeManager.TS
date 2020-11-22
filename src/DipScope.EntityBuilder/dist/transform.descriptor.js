"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformDescriptor = void 0;
/**
 * Transform descriptor contains information about additional property transformations.
 *
 * @type {TransformDescriptor}
 */
class TransformDescriptor {
    /**
     * Constructor.
     *
     * @param {Function} entityCtor Entity constructor.
     * @param {string} propertyName Property name.
     * @param {Function} serializeFn Serialization function.
     * @param {Function} deserializeFn Deserialization function.
     */
    constructor(entityCtor, propertyName, serializeFn, deserializeFn) {
        this.entityCtor = entityCtor;
        this.propertyName = propertyName;
        this.serializeFn = serializeFn;
        this.deserializeFn = deserializeFn;
        return;
    }
}
exports.TransformDescriptor = TransformDescriptor;
