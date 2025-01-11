import { Serializer } from '../serializer';
import { SerializerContext } from '../serializer-context';
import { TypeLike } from '../type-like';

/**
 * Uint 16 array serializer.
 * 
 * @type {Uint16ArraySerializer}
 */
export class Uint16ArraySerializer implements Serializer<Uint16Array>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<Uint16Array>} x Some value.
     * @param {SerializerContext<Uint16Array>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<Uint16Array>, serializerContext: SerializerContext<Uint16Array>): TypeLike<any>
    {
        if (x === undefined)
        {
            return serializerContext.serializedDefaultValue;
        }

        if (x === null)
        {
            return serializerContext.serializedNullValue;
        }

        if (x instanceof Uint16Array)
        {
            return Array.from(x);
        }

        serializerContext.logger.error('Uint16ArraySerializer', `${serializerContext.jsonPath}: cannot serialize value as uint 16 array.`, x);

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<Uint16Array>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<Uint16Array>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<Uint16Array>): TypeLike<Uint16Array>
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
            return Uint16Array.from(x);
        }

        serializerContext.logger.error('Uint16ArraySerializer', `${serializerContext.jsonPath}: cannot deserialize value as uint 16 array.`, x);

        return undefined;
    }
}
