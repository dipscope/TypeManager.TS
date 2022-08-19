import { isArray, isNull, isUndefined } from 'lodash';
import { isFloat64Array } from '../functions/is-float-64-array';
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
        if (isUndefined(x))
        {
            return serializerContext.serializedDefaultValue;
        }

        if (isNull(x))
        {
            return serializerContext.serializedNullValue;
        }

        if (isFloat64Array(x))
        {
            return Array.from(x);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.jsonPath}: cannot serialize value as float 64 array.`, x);
        }

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
        if (isUndefined(x))
        {
            return serializerContext.deserializedDefaultValue;
        }

        if (isNull(x))
        {
            return serializerContext.deserializedNullValue;
        }

        if (isArray(x))
        {
            return Float64Array.from(x);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.jsonPath}: cannot deserialize value to a float 64 array.`, x);
        }

        return undefined;
    }
}
