/**
 * Type serializer.
 * 
 * @type {TypeSerializer}
 */
export abstract class TypeSerializer
{
    /**
     * Serializes provided value.
     * 
     * @param {any} x Some value.
     * 
     * @returns {any} Serialized value.
     */
    public abstract serialize(x: any): any;

    /**
     * Deserializes provided value.
     * 
     * @param {any} x Some value.
     * 
     * @returns {any} Deserialized value.
     */
    public abstract deserialize(x: any): any;

    /**
     * Called if implicit conversion is enabled. 
     * 
     * Converts provided value to the target type value. If conversion is 
     * not possible then returns original value.
     * 
     * @param {any} x Some value.
     * 
     * @returns {any} Converted value or original value.
     */
    public convert(x: any): any
    {
        return x;
    }
}
