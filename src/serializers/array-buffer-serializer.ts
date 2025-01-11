import { Serializer } from '../serializer';
import { SerializerContext } from '../serializer-context';
import { TypeLike } from '../type-like';

/**
 * Array buffer serializer.
 * 
 * @type {ArrayBufferSerializer}
 */
export class ArrayBufferSerializer implements Serializer<ArrayBuffer>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<ArrayBuffer>} x Some value.
     * @param {SerializerContext<ArrayBuffer>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<ArrayBuffer>, serializerContext: SerializerContext<ArrayBuffer>): TypeLike<any>
    {
        if (x === undefined)
        {
            return serializerContext.serializedDefaultValue;
        }

        if (x === null)
        {
            return serializerContext.serializedNullValue;
        }

        if (x instanceof ArrayBuffer)
        {
            const arrayBufferView = new Uint16Array(x);
            const charCodeArray = Array.from(arrayBufferView);

            return charCodeArray.map(c => String.fromCharCode(c)).join('');
        }

        serializerContext.logger.error('ArrayBufferSerializer', `${serializerContext.jsonPath}: cannot serialize value as array buffer.`, x);

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<ArrayBuffer>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<ArrayBuffer>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<ArrayBuffer>): TypeLike<ArrayBuffer>
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
            const arrayBuffer = new ArrayBuffer(x.length * 2);
            const arrayBufferView = new Uint16Array(arrayBuffer);
        
            for (let i = 0; i < x.length; i++)
            {
                arrayBufferView[i] = x.charCodeAt(i);
            }
        
            return arrayBuffer;
        }

        serializerContext.logger.error('ArrayBufferSerializer', `${serializerContext.jsonPath}: cannot deserialize value as array buffer.`, x);

        return undefined;
    }
}
