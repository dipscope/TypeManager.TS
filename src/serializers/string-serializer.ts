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
        if (x === undefined)
        {
            return serializerContext.serializedDefaultValue;
        }

        if (x === null)
        {
            return serializerContext.serializedNullValue;
        }

        if (typeof x === 'string')
        {
            return x;
        }
        
        if (serializerContext.useImplicitConversion) 
        {
            return this.convert(x, serializerContext);
        }

        serializerContext.logger.error('StringSerializer', `${serializerContext.jsonPath}: cannot serialize value as string.`, x);

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
            return x;
        }

        if (serializerContext.useImplicitConversion) 
        {
            return this.convert(x, serializerContext);
        }

        serializerContext.logger.error('StringSerializer', `${serializerContext.jsonPath}: cannot deserialize value as string.`, x);

        return undefined;
    }

    /**
     * Converts provided value to the target type value.
     * 
     * @param {any} x Some value.
     * @param {SerializerContext<string>} serializerContext Type serializer context.
     * 
     * @returns {TypeLike<string>} Converted value or original value.
     */
    private convert(x: any, serializerContext: SerializerContext<string>): TypeLike<string>
    {
        if (typeof x === 'number' || typeof x === 'boolean') 
        {
            return String(x);
        }

        if (x instanceof Date)
        {
            return x.toISOString();
        }

        if (typeof x === 'object')
        {
            return JSON.stringify(x);
        }

        serializerContext.logger.error('StringSerializer', `${serializerContext.jsonPath}: cannot convert value to string.`, x);
        
        return undefined;
    }
}
