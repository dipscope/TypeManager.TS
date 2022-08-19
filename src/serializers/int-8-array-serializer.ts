import { isArray, isNull, isUndefined } from 'lodash';
import { isInt8Array } from '../functions/is-int-8-array';
import { Serializer } from '../serializer';
import { SerializerContext } from '../serializer-context';
import { TypeLike } from '../type-like';

/**
 * Int 8 array serializer.
 * 
 * @type {Int8ArraySerializer}
 */
export class Int8ArraySerializer implements Serializer<Int8Array>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<Int8Array>} x Some value.
     * @param {SerializerContext<Int8Array>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<Int8Array>, serializerContext: SerializerContext<Int8Array>): TypeLike<any>
    {
        if (isUndefined(x))
        {
            return serializerContext.serializedDefaultValue;
        }

        if (isNull(x))
        {
            return serializerContext.serializedNullValue;
        }

        if (isInt8Array(x))
        {
            return Array.from(x);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.jsonPath}: cannot serialize value as int 8 array.`, x);
        }

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<Int8Array>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<Int8Array>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<Int8Array>): TypeLike<Int8Array>
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
            return Int8Array.from(x);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.jsonPath}: cannot deserialize value as int 8 array.`, x);
        }

        return undefined;
    }
}
