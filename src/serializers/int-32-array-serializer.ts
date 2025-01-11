import { Serializer } from '../serializer';
import { SerializerContext } from '../serializer-context';
import { TypeLike } from '../type-like';

/**
 * Int 32 array serializer.
 * 
 * @type {Int32ArraySerializer}
 */
export class Int32ArraySerializer implements Serializer<Int32Array>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<Int32Array>} x Some value.
     * @param {SerializerContext<Int32Array>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<Int32Array>, serializerContext: SerializerContext<Int32Array>): TypeLike<any>
    {
        if (x === undefined)
        {
            return serializerContext.serializedDefaultValue;
        }

        if (x === null)
        {
            return serializerContext.serializedNullValue;
        }

        if (x instanceof Int32Array)
        {
            return Array.from(x);
        }
        
        serializerContext.logger.error('Int32ArraySerializer', `${serializerContext.jsonPath}: cannot serialize value as int 32 array.`, x);

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<Int32Array>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<Int32Array>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<Int32Array>): TypeLike<Int32Array>
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
            return Int32Array.from(x);
        }

        serializerContext.logger.error('Int32ArraySerializer', `${serializerContext.jsonPath}: cannot deserialize value as int 32 array.`, x);

        return undefined;
    }
}
