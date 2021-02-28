import { Fn } from './../core/fn';
import { TypeLike } from './../core/type-like';
import { Serializer } from './../core/serializer';
import { SerializerContext } from './../core/serializer-context';

/**
 * Uint 8 array serializer.
 * 
 * @type {Uint8ArraySerializer}
 */
export class Uint8ArraySerializer implements Serializer<Uint8Array>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<Uint8Array>} x Some value.
     * @param {SerializerContext<Uint8Array>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<Uint8Array>, serializerContext: SerializerContext<Uint8Array>): TypeLike<any>
    {
        if (Fn.isUndefined(x))
        {
            return serializerContext.defaultValue;
        }

        if (Fn.isNull(x))
        {
            return x;
        }

        if (Fn.isUint8Array(x))
        {
            return Array.from(x);
        }

        if (Fn.isArray(x))
        {
            return x.map(v => this.serialize(v, serializerContext));
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot serialize value as uint 8 array!`, x);
        }

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<Uint8Array>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<Uint8Array>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<Uint8Array>): TypeLike<Uint8Array>
    {
        if (Fn.isUndefined(x))
        {
            return serializerContext.defaultValue;
        }

        if (Fn.isNull(x))
        {
            return x;
        }

        if (Fn.isArray(x) && x.every(v => Fn.isNumber(v) && !Number.isNaN(v)))
        {
            return Uint8Array.from(x);
        }

        if (Fn.isArray(x) && x.every(v => Fn.isArray(v)))
        {
            return x.map(v => this.deserialize(v, serializerContext));
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot deserialize value as uint 8 array!`, x);
        }

        return undefined;
    }
}
