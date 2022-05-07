import { Fn } from '../core/fn';
import { Serializer } from '../core/serializer';
import { SerializerContext } from '../core/serializer-context';
import { TypeLike } from '../core/type-like';

/**
 * Uint 32 array serializer.
 * 
 * @type {Uint32ArraySerializer}
 */
export class Uint32ArraySerializer implements Serializer<Uint32Array>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<Uint32Array>} x Some value.
     * @param {SerializerContext<Uint32Array>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<Uint32Array>, serializerContext: SerializerContext<Uint32Array>): TypeLike<any>
    {
        if (Fn.isUndefined(x))
        {
            return serializerContext.defaultValue;
        }

        if (Fn.isNull(x))
        {
            return x;
        }

        if (Fn.isUint32Array(x))
        {
            return Array.from(x);
        }
        
        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot serialize value as uint 32 array!`, x);
        }

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<Uint32Array>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<Uint32Array>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<Uint32Array>): TypeLike<Uint32Array>
    {
        if (Fn.isUndefined(x))
        {
            return serializerContext.defaultValue;
        }

        if (Fn.isNull(x))
        {
            return x;
        }

        if (Fn.isArray(x))
        {
            return Uint32Array.from(x);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot deserialize value as uint 32 array!`, x);
        }

        return undefined;
    }
}
