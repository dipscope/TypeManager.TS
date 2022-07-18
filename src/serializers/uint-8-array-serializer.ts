import isArray from 'lodash/isArray';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
import { isUint8Array } from '../functions';
import { Serializer } from '../serializer';
import { SerializerContext } from '../serializer-context';
import { TypeLike } from '../type-like';

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
        if (isUndefined(x))
        {
            return serializerContext.serializedDefaultValue;
        }

        if (isNull(x))
        {
            return serializerContext.serializedNullValue;
        }

        if (isUint8Array(x))
        {
            return Array.from(x);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.jsonPath}: cannot serialize value as uint 8 array.`, x);
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
            return Uint8Array.from(x);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.jsonPath}: cannot deserialize value as uint 8 array.`, x);
        }

        return undefined;
    }
}
