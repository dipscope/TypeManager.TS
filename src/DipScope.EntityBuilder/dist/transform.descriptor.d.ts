/**
 * Transform descriptor contains information about additional property transformations.
 *
 * @type {TransformDescriptor}
 */
export declare class TransformDescriptor {
    /**
     * Entity constructor.
     *
     * @type {Function}
     */
    entityCtor: new () => any;
    /**
     * Property name.
     *
     * @type {string}
     */
    propertyName: string;
    /**
     * Serialize function.
     *
     * @type {Function}
     */
    serializeFn: (x: any) => any;
    /**
     * Deserialize function.
     *
     * @type {Function}
     */
    deserializeFn: (x: any) => any;
    /**
     * Constructor.
     *
     * @param {Function} entityCtor Entity constructor.
     * @param {string} propertyName Property name.
     * @param {Function} serializeFn Serialization function.
     * @param {Function} deserializeFn Deserialization function.
     */
    constructor(entityCtor: new () => any, propertyName: string, serializeFn: (x: any) => any, deserializeFn: (x: any) => any);
}
