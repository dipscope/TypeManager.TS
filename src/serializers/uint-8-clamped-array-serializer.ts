import { Fn } from '../core/fn';
import { Serializer } from '../core/serializer';
import { SerializerContext } from '../core/serializer-context';
import { TypeLike } from '../core/type-like';

/**
 * Uint 8 clamped array serializer.
 * 
 * @type {Uint8ClampedArraySerializer}
 */
export class Uint8ClampedArraySerializer implements Serializer<Uint8ClampedArray>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<Uint8ClampedArray>} x Some value.
     * @param {SerializerContext<Uint8ClampedArray>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<Uint8ClampedArray>, serializerContext: SerializerContext<Uint8ClampedArray>): TypeLike<any>
    {
        if (Fn.isUndefined(x))
        {
            return serializerContext.defaultValue;
        }

        if (Fn.isNull(x))
        {
            return x;
        }

        if (Fn.isUint8ClampedArray(x))
        {
            return Array.from(x);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot serialize value as uint 8 clamped array!`, x);
        }

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<Uint8ClampedArray>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<Uint8ClampedArray>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<Uint8ClampedArray>): TypeLike<Uint8ClampedArray>
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
            return Uint8ClampedArray.from(x);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot deserialize value as uint 8 clamped array!`, x);
        }

        return undefined;
    }
}
