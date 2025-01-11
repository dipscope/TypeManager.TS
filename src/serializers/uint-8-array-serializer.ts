import { Serializer } from '../serializer';
import { SerializerContext } from '../serializer-context';
import { TypeLike } from '../type-like';

/**
 * Uint 8 array serializer.
 * 
 * @type {Uint8ArraySerializer}
 */
export class Uint8ArraySerializer implements Serializer<Uint8Array>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<Uint8Array>} x Some value.
     * @param {SerializerContext<Uint8Array>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<Uint8Array>, serializerContext: SerializerContext<Uint8Array>): TypeLike<any>
    {
        if (x === undefined)
        {
            return serializerContext.serializedDefaultValue;
        }

        if (x === null)
        {
            return serializerContext.serializedNullValue;
        }

        if (x instanceof Uint8Array)
        {
            return Array.from(x);
        }

        serializerContext.logger.error('Uint8ArraySerializer', `${serializerContext.jsonPath}: cannot serialize value as uint 8 array.`, x);

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<Uint8Array>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<Uint8Array>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<Uint8Array>): TypeLike<Uint8Array>
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
            return Uint8Array.from(x);
        }

        serializerContext.logger.error('Uint8ArraySerializer', `${serializerContext.jsonPath}: cannot deserialize value as uint 8 array.`, x);

        return undefined;
    }
}
