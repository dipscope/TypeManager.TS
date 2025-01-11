import { Serializer } from '../serializer';
import { SerializerContext } from '../serializer-context';
import { TypeLike } from '../type-like';

/**
 * Uint 32 array serializer.
 * 
 * @type {Uint32ArraySerializer}
 */
export class Uint32ArraySerializer implements Serializer<Uint32Array>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<Uint32Array>} x Some value.
     * @param {SerializerContext<Uint32Array>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<Uint32Array>, serializerContext: SerializerContext<Uint32Array>): TypeLike<any>
    {
        if (x === undefined)
        {
            return serializerContext.serializedDefaultValue;
        }

        if (x === null)
        {
            return serializerContext.serializedNullValue;
        }

        if (x instanceof Uint32Array)
        {
            return Array.from(x);
        }
        
        serializerContext.logger.error('Uint32ArraySerializer', `${serializerContext.jsonPath}: cannot serialize value as uint 32 array.`, x);

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<Uint32Array>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<Uint32Array>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<Uint32Array>): TypeLike<Uint32Array>
    {
        if (x === undefined)
        {
            return serializerContext.deserializedDefaultValue;
        }

        if (x === null)
        {
            return serializerContext.deserializedNullValue;
        }

        if (Array.isArray(x))
        {
            return Uint32Array.from(x);
        }

        serializerContext.logger.error('Uint32ArraySerializer', `${serializerContext.jsonPath}: cannot deserialize value as uint 32 array.`, x);

        return undefined;
    }
}
