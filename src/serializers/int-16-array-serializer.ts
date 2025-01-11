import { Serializer } from '../serializer';
import { SerializerContext } from '../serializer-context';
import { TypeLike } from '../type-like';

/**
 * Int 16 array serializer.
 * 
 * @type {Int16ArraySerializer}
 */
export class Int16ArraySerializer implements Serializer<Int16Array>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<Int16Array>} x Some value.
     * @param {SerializerContext<Int16Array>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<Int16Array>, serializerContext: SerializerContext<Int16Array>): TypeLike<any>
    {
        if (x === undefined)
        {
            return serializerContext.serializedDefaultValue;
        }

        if (x === null)
        {
            return serializerContext.serializedNullValue;
        }

        if (x instanceof Int16Array)
        {
            return Array.from(x);
        }

        serializerContext.logger.error('Int16ArraySerializer', `${serializerContext.jsonPath}: cannot serialize value as int 16 array.`, x);

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<Int16Array>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<Int16Array>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<Int16Array>): TypeLike<Int16Array>
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
            return Int16Array.from(x);
        }

        serializerContext.logger.error('Int16ArraySerializer', `${serializerContext.jsonPath}: cannot deserialize value as int 16 array.`, x);

        return undefined;
    }
}
