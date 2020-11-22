/**
 * Property descriptor contains information about certain entity property.
 *
 * @type {PropertyDescriptor}
 */
export declare class PropertyDescriptor {
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
     * Property alias.
     *
     * @type {string}
     */
    propertyAlias?: string;
    /**
     * Serialize this property when transforming to a plain object?
     *
     * @type {boolean}
     */
    serializable?: boolean;
    /**
     * Deserialize this property when transforming from a plain object?
     *
     * @type {boolean}
     */
    deserializable?: boolean;
    /**
     * Constructor.
     *
     * @param {Function} entityCtor Entity constructor.
     * @param {string} propertyName Property name.
     */
    constructor(entityCtor: new () => any, propertyName: string);
    /**
     * Checks if serialization configured for this property descriptor.
     *
     * @returns {boolean} True when serialization is configured. False otherwise.
     */
    get serializationConfigured(): boolean;
}
