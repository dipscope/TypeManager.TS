/**
 * Transform descriptor contains information about additional property transformations.
 *
 * @type {TransformDescriptor}
 */
export class TransformDescriptor
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
     * Serialize function.
     *
     * @type {Function}
     */
    public serializeFn: (x: any) => any;

    /**
     * Deserialize function.
     *
     * @type {Function}
     */
    public deserializeFn: (x: any) => any;

    /**
     * Constructor.
     * 
     * @param {Function} entityCtor Entity constructor.
     * @param {string} propertyName Property name.
     * @param {Function} serializeFn Serialization function.
     * @param {Function} deserializeFn Deserialization function.
     */
    public constructor(entityCtor: new () => any, propertyName: string, serializeFn: (x: any) => any, deserializeFn: (x: any) => any)
    {
        this.entityCtor    = entityCtor;
        this.propertyName  = propertyName;
        this.serializeFn   = serializeFn;
        this.deserializeFn = deserializeFn;

        return;
    }
}
