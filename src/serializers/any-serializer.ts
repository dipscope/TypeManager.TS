import { Serializer } from '../serializer';
import { SerializerContext } from '../serializer-context';
import { TypeLike } from '../type-like';

/**
 * Any serializer.
 * 
 * @type {AnySerializer}
 */
export class AnySerializer implements Serializer<any>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<any>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<any>, serializerContext: SerializerContext<any>): TypeLike<any>
    {
        if (x === undefined)
        {
            return serializerContext.serializedDefaultValue;
        }

        if (x === null)
        {
            return serializerContext.serializedNullValue;
        }

        return x;
    }
    
    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<any>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<any>): TypeLike<any>
    {
        if (x === undefined)
        {
            return serializerContext.deserializedDefaultValue;
        }

        if (x === null)
        {
            return serializerContext.deserializedNullValue;
        }

        return x;
    }
}
