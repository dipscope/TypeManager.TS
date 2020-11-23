/**
 * Property descriptor contains information about certain entity property.
 *
 * @type {PropertyDescriptor}
 */
export class PropertyDescriptor
{
    /**
     * Entity constructor.
     *
     * @type {Function}
     */
    public entityCtor: new () => any;

    /**
     * Property name.
     *
     * @type {string}
     */
    public propertyName: string;

    /**
     * Property alias.
     * 
     * @type {string}
     */
    public propertyAlias?: string;

    /**
     * Serialize this property when transforming to a plain object?
     * 
     * @type {boolean}
     */
    public serializable?: boolean;

    /**
     * Deserialize this property when transforming from a plain object?
     * 
     * @type {boolean}
     */
    public deserializable?: boolean;

    /**
     * Constructor.
     * 
     * @param {Function} entityCtor Entity constructor.
     * @param {string} propertyName Property name.
     */
    public constructor(entityCtor: new () => any, propertyName: string)
    {
        this.entityCtor   = entityCtor;
        this.propertyName = propertyName;

        return;
    }

    /**
     * Checks if serialization configured for this property descriptor.
     * 
     * @returns {boolean} True when serialization is configured. False otherwise.
     */
    public get serializationConfigured(): boolean
    {
        return !!this.serializable || !!this.deserializable;
    }
}
