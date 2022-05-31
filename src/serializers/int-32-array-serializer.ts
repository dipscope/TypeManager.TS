import isArray from 'lodash-es/isArray';
import isNull from 'lodash-es/isNull';
import isUndefined from 'lodash-es/isUndefined';

import { isInt32Array } from '../functions';
import { Serializer } from '../serializer';
import { SerializerContext } from '../serializer-context';
import { TypeLike } from '../type-like';

/**
 * Int 32 array serializer.
 * 
 * @type {Int32ArraySerializer}
 */
export class Int32ArraySerializer implements Serializer<Int32Array>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<Int32Array>} x Some value.
     * @param {SerializerContext<Int32Array>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<Int32Array>, serializerContext: SerializerContext<Int32Array>): TypeLike<any>
    {
        if (isUndefined(x))
        {
            return serializerContext.serializedDefaultValue;
        }

        if (isNull(x))
        {
            return x;
        }

        if (isInt32Array(x))
        {
            return Array.from(x);
        }
        
        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: cannot serialize value as int 32 array.`, x);
        }

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<Int32Array>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<Int32Array>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<Int32Array>): TypeLike<Int32Array>
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
            return Int32Array.from(x);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: cannot deserialize value as int 32 array.`, x);
        }

        return undefined;
    }
}
