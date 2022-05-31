import isArray from 'lodash-es/isArray';
import isNull from 'lodash-es/isNull';
import isUndefined from 'lodash-es/isUndefined';

import { isUint16Array } from '../functions';
import { Serializer } from '../serializer';
import { SerializerContext } from '../serializer-context';
import { TypeLike } from '../type-like';

/**
 * Uint 16 array serializer.
 * 
 * @type {Uint16ArraySerializer}
 */
export class Uint16ArraySerializer implements Serializer<Uint16Array>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<Uint16Array>} x Some value.
     * @param {SerializerContext<Uint16Array>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<Uint16Array>, serializerContext: SerializerContext<Uint16Array>): TypeLike<any>
    {
        if (isUndefined(x))
        {
            return serializerContext.serializedDefaultValue;
        }

        if (isNull(x))
        {
            return x;
        }

        if (isUint16Array(x))
        {
            return Array.from(x);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: cannot serialize value as uint 16 array.`, x);
        }

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<Uint16Array>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<Uint16Array>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<Uint16Array>): TypeLike<Uint16Array>
    {
        if (isUndefined(x))
        {
            return serializerContext.deserializedDefaultValue;
        }

        if (isNull(x))
        {
            return x;
        }

        if (isArray(x))
        {
            return Uint16Array.from(x);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: cannot deserialize value as uint 16 array.`, x);
        }

        return undefined;
    }
}
