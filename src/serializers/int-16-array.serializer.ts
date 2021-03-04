import { Fn } from '../core/fn';
import { Serializer } from '../core/serializer';
import { SerializerContext } from '../core/serializer-context';
import { TypeLike } from '../core/type-like';

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
        if (Fn.isUndefined(x))
        {
            return serializerContext.defaultValue;
        }

        if (Fn.isNull(x))
        {
            return x;
        }

        if (Fn.isInt16Array(x))
        {
            return Array.from(x);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot serialize value as int 16 array!`, x);
        }

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
            return Int16Array.from(x);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot deserialize value as int 16 array!`, x);
        }

        return undefined;
    }
}
