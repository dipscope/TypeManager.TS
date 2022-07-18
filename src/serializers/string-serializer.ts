import isBoolean from 'lodash/isBoolean';
import isDate from 'lodash/isDate';
import isNull from 'lodash/isNull';
import isNumber from 'lodash/isNumber';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';
import { Serializer } from '../serializer';
import { SerializerContext } from '../serializer-context';
import { TypeLike } from '../type-like';

/**
 * String serializer.
 * 
 * @type {StringSerializer}
 */
export class StringSerializer implements Serializer<string>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<string>} x Some value.
     * @param {SerializerContext<string>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<string>, serializerContext: SerializerContext<string>): TypeLike<any>
    {
        if (isUndefined(x))
        {
            return serializerContext.serializedDefaultValue;
        }

        if (isNull(x))
        {
            return serializerContext.serializedNullValue;
        }

        if (isString(x))
        {
            return x;
        }
        
        if (serializerContext.useImplicitConversion) 
        {
            return this.convert(x, serializerContext);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.jsonPath}: cannot serialize value as string.`, x);
        }

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<string>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<string>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<string>): TypeLike<string>
    {
        if (isUndefined(x))
        {
            return serializerContext.deserializedDefaultValue;
        }

        if (isNull(x))
        {
            return serializerContext.deserializedNullValue;
        }

        if (isString(x))
        {
            return x;
        }

        if (serializerContext.useImplicitConversion) 
        {
            return this.convert(x, serializerContext);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.jsonPath}: cannot deserialize value as string.`, x);
        }

        return undefined;
    }

    /**
     * Converts provided value to the target type value.
     * 
     * @param {any} x Some value.
     * @param {SerializerContext<string>} serializerContext Type serializer context.
     * 
     * @returns {string|undefined} Converted value or original value.
     */
    private convert(x: any, serializerContext: SerializerContext<string>): string | undefined
    {
        if (isNumber(x) || isBoolean(x)) 
        {
            return String(x);
        }

        if (isDate(x))
        {
            return x.toISOString();
        }

        if (isObject(x))
        {
            return JSON.stringify(x);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.jsonPath}: cannot convert value to string.`, x);
        }
        
        return undefined;
    }
}
