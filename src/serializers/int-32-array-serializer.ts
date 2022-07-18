import isArray from 'lodash/isArray';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
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
            return serializerContext.serializedNullValue;
        }

        if (isInt32Array(x))
        {
            return Array.from(x);
        }
        
        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.jsonPath}: cannot serialize value as int 32 array.`, x);
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
            return serializerContext.deserializedNullValue;
        }

        if (isArray(x))
        {
            return Int32Array.from(x);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.jsonPath}: cannot deserialize value as int 32 array.`, x);
        }

        return undefined;
    }
}
