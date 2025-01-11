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
        if (x === undefined)
        {
            return serializerContext.serializedDefaultValue;
        }

        if (x === null)
        {
            return serializerContext.serializedNullValue;
        }

        if (typeof x === 'number')
        {
            return x;
        }

        if (serializerContext.useImplicitConversion) 
        {
            return this.convert(x, serializerContext);
        }

        serializerContext.logger.error('NumberSerializer', `${serializerContext.jsonPath}: cannot serialize value as number.`, x);

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
        if (x === undefined)
        {
            return serializerContext.deserializedDefaultValue;
        }

        if (x === null)
        {
            return serializerContext.deserializedNullValue;
        }

        if (typeof x === 'number')
        {
            return x;
        }

        if (serializerContext.useImplicitConversion) 
        {
            return this.convert(x, serializerContext);
        }

        serializerContext.logger.error('NumberSerializer', `${serializerContext.jsonPath}: cannot deserialize value as number.`, x);

        return undefined;
    }

    /**
     * Converts provided value to the target type value.
     * 
     * @param {any} x Some value.
     * @param {SerializerContext<number>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<number>} Converted value.
     */
    private convert(x: any, serializerContext: SerializerContext<number>): TypeLike<number>
    {
        if (typeof x === 'string' || typeof x === 'boolean')
        {
            return Number(x);
        }
        
        serializerContext.logger.error('NumberSerializer', `${serializerContext.jsonPath}: cannot convert value to a number.`, x);

        return undefined;
    }
}
