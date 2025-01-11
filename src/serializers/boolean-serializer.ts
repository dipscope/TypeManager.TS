import { Serializer } from '../serializer';
import { SerializerContext } from '../serializer-context';
import { TypeLike } from '../type-like';

/**
 * Boolean serializer.
 * 
 * @type {BooleanSerializer}
 */
export class BooleanSerializer implements Serializer<boolean>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<boolean>} x Some value.
     * @param {SerializerContext<boolean>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<boolean>, serializerContext: SerializerContext<boolean>): TypeLike<any>
    {
        if (x === undefined)
        {
            return serializerContext.serializedDefaultValue;
        }

        if (x === null)
        {
            return serializerContext.serializedNullValue;
        }

        if (typeof x === 'boolean')
        {
            return x;
        }

        if (serializerContext.useImplicitConversion) 
        {
            return this.convert(x, serializerContext);
        }

        serializerContext.logger.error('BooleanSerializer', `${serializerContext.jsonPath}: cannot serialize value as boolean.`, x);

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<boolean>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<boolean>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<boolean>): TypeLike<boolean>
    {
        if (x === undefined)
        {
            return serializerContext.deserializedDefaultValue;
        }

        if (x === null)
        {
            return serializerContext.deserializedNullValue;
        }

        if (typeof x === 'boolean')
        {
            return x;
        }

        if (serializerContext.useImplicitConversion) 
        {
            return this.convert(x, serializerContext);
        }

        serializerContext.logger.error('BooleanSerializer', `${serializerContext.jsonPath}: cannot deserialize value as boolean.`, x);

        return undefined;
    }

    /**
     * Converts provided value to the target type value.
     * 
     * @param {any} x Some value.
     * @param {SerializerContext<boolean>} serializerContext Type serializer context.
     * 
     * @returns {TypeLike<boolean>} Converted value.
     */
    private convert(x: any, serializerContext: SerializerContext<boolean>): TypeLike<boolean>
    {
        if (typeof x === 'string' && (x === 'true' || x === 'false'))
        {
            return x === 'true';
        }

        if (typeof x === 'string' && (x === '1' || x === '0'))
        {
            return x === '1';
        }

        if (typeof x === 'number' && (x === 1 || x === 0))
        {
            return x === 1;
        }

        serializerContext.logger.error('BooleanSerializer', `${serializerContext.jsonPath}: cannot convert value to boolean.`, x);

        return undefined;
    }
}
