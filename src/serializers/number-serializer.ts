import isBoolean from 'lodash/isBoolean';
import isNull from 'lodash/isNull';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';

import { Serializer } from '../serializer';
import { SerializerContext } from '../serializer-context';
import { TypeLike } from '../type-like';

/**
 * Number serializer.
 * 
 * @type {NumberSerializer}
 */
export class NumberSerializer implements Serializer<number>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<number>} x Some value.
     * @param {SerializerContext<number>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<number>, serializerContext: SerializerContext<number>): TypeLike<any>
    {
        if (isUndefined(x))
        {
            return serializerContext.serializedDefaultValue;
        }

        if (isNull(x) || isNumber(x))
        {
            return x;
        }

        if (serializerContext.useImplicitConversion) 
        {
            return this.convert(x, serializerContext);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: cannot serialize value as number.`, x);
        }

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<number>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<number>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<number>): TypeLike<number>
    {
        if (isUndefined(x))
        {
            return serializerContext.deserializedDefaultValue;
        }

        if (isNull(x) || isNumber(x))
        {
            return x;
        }

        if (serializerContext.useImplicitConversion) 
        {
            return this.convert(x, serializerContext);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: cannot deserialize value as number.`, x);
        }

        return undefined;
    }

    /**
     * Converts provided value to the target type value.
     * 
     * @param {any} x Some value.
     * @param {SerializerContext<number>} serializerContext Serializer context.
     * 
     * @returns {number|undefined} Converted value or undefined.
     */
    private convert(x: any, serializerContext: SerializerContext<number>): number | undefined
    {
        if (isString(x) || isBoolean(x))
        {
            return Number(x);
        }
        
        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: cannot convert value to a number.`, x);
        }

        return undefined;
    }
}
