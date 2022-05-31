import isArray from 'lodash-es/isArray';
import isNull from 'lodash-es/isNull';
import isUndefined from 'lodash-es/isUndefined';

import { isUint32Array } from '../functions';
import { Serializer } from '../serializer';
import { SerializerContext } from '../serializer-context';
import { TypeLike } from '../type-like';

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
        if (isUndefined(x))
        {
            return serializerContext.serializedDefaultValue;
        }

        if (isNull(x))
        {
            return x;
        }

        if (isUint32Array(x))
        {
            return Array.from(x);
        }
        
        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: cannot serialize value as uint 32 array.`, x);
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
            return Uint32Array.from(x);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: cannot deserialize value as uint 32 array.`, x);
        }

        return undefined;
    }
}
