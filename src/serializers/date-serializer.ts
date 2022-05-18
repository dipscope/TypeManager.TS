import { Fn } from '../core/fn';
import { Serializer } from '../core/serializer';
import { SerializerContext } from '../core/serializer-context';
import { TypeLike } from '../core/type-like';

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
        if (Fn.isUndefined(x))
        {
            return serializerContext.serializedDefaultValue;
        }

        if (Fn.isNull(x))
        {
            return x;
        }

        if (Fn.isDate(x))
        {
            return x.toISOString();
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot serialize value as date!`, x);
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
        if (Fn.isUndefined(x))
        {
            return serializerContext.deserializedDefaultValue;
        }

        if (Fn.isNull(x))
        {
            return x;
        }

        if (Fn.isString(x))
        {
            return new Date(x);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot deserialize value as date!`, x);
        }

        return undefined;
    }
}
