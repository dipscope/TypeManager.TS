/**
 * Type serializer interface.
 * 
 * @type {TypeSerializer}
 */
export interface TypeSerializer
{
    /**
     * Serializes provided value.
     * 
     * @param {any} x Some value.
     * 
     * @returns {any} Serialized value.
     */
    serialize(x: any): any;

    /**
     * Deserializes provided value.
     * 
     * @param {any} x Some value.
     * 
     * @returns {any} Deserialized value.
     */
    deserialize(x: any): any;
}
