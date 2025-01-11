import { Serializer } from '../serializer';
import { SerializerContext } from '../serializer-context';
import { TypeLike } from '../type-like';

/**
 * Float 64 array serializer.
 * 
 * @type {Float64ArraySerializer}
 */
export class Float64ArraySerializer implements Serializer<Float64Array>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<Float64Array>} x Some value.
     * @param {SerializerContext<Float64Array>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<Float64Array>, serializerContext: SerializerContext<Float64Array>): TypeLike<any>
    {
        if (x === undefined)
        {
            return serializerContext.serializedDefaultValue;
        }

        if (x === null)
        {
            return serializerContext.serializedNullValue;
        }

        if (x instanceof Float64Array)
        {
            return Array.from(x);
        }

        serializerContext.logger.error('Float64ArraySerializer', `${serializerContext.jsonPath}: cannot serialize value as float 64 array.`, x);

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<Float64Array>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<Float64Array>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<Float64Array>): TypeLike<Float64Array>
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
            return Float64Array.from(x);
        }

        serializerContext.logger.error('Float64ArraySerializer', `${serializerContext.jsonPath}: cannot deserialize value to a float 64 array.`, x);

        return undefined;
    }
}
