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
        if (x === undefined)
        {
            return serializerContext.serializedDefaultValue;
        }

        if (x === null)
        {
            return serializerContext.serializedNullValue;
        }

        if (x instanceof Date)
        {
            return x.toISOString();
        }

        serializerContext.logger.error('DateSerializer', `${serializerContext.jsonPath}: cannot serialize value as date.`, x);

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
        if (x === undefined)
        {
            return serializerContext.deserializedDefaultValue;
        }

        if (x === null)
        {
            return serializerContext.deserializedNullValue;
        }

        if (typeof x === 'string')
        {
            return new Date(x);
        }
        
        serializerContext.logger.error('DateSerializer', `${serializerContext.jsonPath}: cannot deserialize value as date.`, x);

        return undefined;
    }
}
