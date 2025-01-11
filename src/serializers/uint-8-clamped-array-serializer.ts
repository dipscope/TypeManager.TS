import { Serializer } from '../serializer';
import { SerializerContext } from '../serializer-context';
import { TypeLike } from '../type-like';

/**
 * Uint 8 clamped array serializer.
 * 
 * @type {Uint8ClampedArraySerializer}
 */
export class Uint8ClampedArraySerializer implements Serializer<Uint8ClampedArray>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<Uint8ClampedArray>} x Some value.
     * @param {SerializerContext<Uint8ClampedArray>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<Uint8ClampedArray>, serializerContext: SerializerContext<Uint8ClampedArray>): TypeLike<any>
    {
        if (x === undefined)
        {
            return serializerContext.serializedDefaultValue;
        }

        if (x === null)
        {
            return serializerContext.serializedNullValue;
        }

        if (x instanceof Uint8ClampedArray)
        {
            return Array.from(x);
        }

        serializerContext.logger.error('Uint8ClampedArraySerializer', `${serializerContext.jsonPath}: cannot serialize value as uint 8 clamped array.`, x);

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<Uint8ClampedArray>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<Uint8ClampedArray>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<Uint8ClampedArray>): TypeLike<Uint8ClampedArray>
    {
        if (x === undefined)
        {
            return serializerContext.deserializedDefaultValue;
        }

        if (x === null)
        {
            return serializerContext.deserializedNullValue;
        }

        if (Array.isArray(x))
        {
            return Uint8ClampedArray.from(x);
        }

        serializerContext.logger.error('Uint8ClampedArraySerializer', `${serializerContext.jsonPath}: cannot deserialize value as uint 8 clamped array.`, x);

        return undefined;
    }
}
