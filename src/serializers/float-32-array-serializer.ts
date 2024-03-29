import { isArray, isNull, isUndefined } from 'lodash';
import { isFloat32Array } from '../functions/is-float-32-array';
import { Serializer } from '../serializer';
import { SerializerContext } from '../serializer-context';
import { TypeLike } from '../type-like';

/**
 * Float 32 array serializer.
 * 
 * @type {Float32ArraySerializer}
 */
export class Float32ArraySerializer implements Serializer<Float32Array>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<Float32Array>} x Some value.
     * @param {SerializerContext<Float32Array>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<Float32Array>, serializerContext: SerializerContext<Float32Array>): TypeLike<any>
    {
        if (isUndefined(x))
        {
            return serializerContext.serializedDefaultValue;
        }

        if (isNull(x))
        {
            return serializerContext.serializedNullValue;
        }

        if (isFloat32Array(x))
        {
            return Array.from(x);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.jsonPath}: cannot serialize value as float 32 array.`, x);
        }

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<Float32Array>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<Float32Array>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<Float32Array>): TypeLike<Float32Array>
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
            return Float32Array.from(x);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.jsonPath}: cannot deserialize value as float 32 array.`, x);
        }

        return undefined;
    }
}
