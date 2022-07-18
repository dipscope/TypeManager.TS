import isArray from 'lodash/isArray';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
import { isUint8ClampedArray } from '../functions';
import { Serializer } from '../serializer';
import { SerializerContext } from '../serializer-context';
import { TypeLike } from '../type-like';

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
        if (isUndefined(x))
        {
            return serializerContext.serializedDefaultValue;
        }

        if (isNull(x))
        {
            return serializerContext.serializedNullValue;
        }

        if (isUint8ClampedArray(x))
        {
            return Array.from(x);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.jsonPath}: cannot serialize value as uint 8 clamped array.`, x);
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
            return Uint8ClampedArray.from(x);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.jsonPath}: cannot deserialize value as uint 8 clamped array.`, x);
        }

        return undefined;
    }
}
