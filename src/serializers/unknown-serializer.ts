import { Serializer } from '../serializer';
import { SerializerContext } from '../serializer-context';
import { TypeLike } from '../type-like';

/**
 * Unknown serializer.
 * 
 * @type {UnknownSerializer}
 */
export class UnknownSerializer implements Serializer<unknown>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<unknown>} x Some value.
     * @param {SerializerContext<unknown>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<unknown>, serializerContext: SerializerContext<unknown>): TypeLike<any>
    {
        if (x === undefined)
        {
            return serializerContext.serializedDefaultValue;
        }

        if (x === null)
        {
            return serializerContext.serializedNullValue;
        }

        return x;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<unknown>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<unknown>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<unknown>): TypeLike<unknown>
    {
        if (x === undefined)
        {
            return serializerContext.deserializedDefaultValue;
        }

        if (x === null)
        {
            return serializerContext.deserializedNullValue;
        }

        return x;
    }
}
