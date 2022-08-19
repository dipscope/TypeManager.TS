import { isDate, isNull, isString, isUndefined } from 'lodash';
import { Serializer } from '../serializer';
import { SerializerContext } from '../serializer-context';
import { TypeLike } from '../type-like';

/**
 * Date serializer.
 * 
 * @type {DateSerializer}
 */
export class DateSerializer implements Serializer<Date>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<Date>} x Some value.
     * @param {SerializerContext<Date>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<Date>, serializerContext: SerializerContext<Date>): TypeLike<any>
    {
        if (isUndefined(x))
        {
            return serializerContext.serializedDefaultValue;
        }

        if (isNull(x))
        {
            return serializerContext.serializedNullValue;
        }

        if (isDate(x))
        {
            return x.toISOString();
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.jsonPath}: cannot serialize value as date.`, x);
        }

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<Date>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<Date>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<Date>): TypeLike<Date>
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
            return new Date(x);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.jsonPath}: cannot deserialize value as date.`, x);
        }

        return undefined;
    }
}
