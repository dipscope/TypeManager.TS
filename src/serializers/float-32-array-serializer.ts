import { Fn } from '../core/fn';
import { Serializer } from '../core/serializer';
import { SerializerContext } from '../core/serializer-context';
import { TypeLike } from '../core/type-like';

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
        if (Fn.isUndefined(x))
        {
            return serializerContext.serializedDefaultValue;
        }

        if (Fn.isNull(x))
        {
            return x;
        }

        if (Fn.isFloat32Array(x))
        {
            return Array.from(x);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot serialize value as float 32 array!`, x);
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
        if (Fn.isUndefined(x))
        {
            return serializerContext.deserializedDefaultValue;
        }

        if (Fn.isNull(x))
        {
            return x;
        }

        if (Fn.isArray(x))
        {
            return Float32Array.from(x);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot deserialize value as float 32 array!`, x);
        }

        return undefined;
    }
}
