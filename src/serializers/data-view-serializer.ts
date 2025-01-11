import { Serializer } from '../serializer';
import { SerializerContext } from '../serializer-context';
import { TypeLike } from '../type-like';

/**
 * Data view serializer.
 * 
 * @type {DataViewSerializer}
 */
export class DataViewSerializer implements Serializer<DataView>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<DataView>} x Some value.
     * @param {SerializerContext<DataView>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<DataView>, serializerContext: SerializerContext<DataView>): TypeLike<any>
    {
        if (x === undefined)
        {
            return serializerContext.serializedDefaultValue;
        }

        if (x === null)
        {
            return serializerContext.serializedNullValue;
        }

        if (x instanceof DataView)
        {
            const arrayBufferView = new Uint16Array(x.buffer);
            const charCodeArray = Array.from(arrayBufferView);

            return charCodeArray.map(c => String.fromCharCode(c)).join('');
        }

        serializerContext.logger.error('DataViewSerializer', `${serializerContext.jsonPath}: cannot serialize value as data view.`, x);

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<DataView>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<DataView>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<DataView>): TypeLike<DataView>
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
        
            return new DataView(arrayBuffer);
        }

        serializerContext.logger.error('DataViewSerializer', `${serializerContext.jsonPath}: cannot deserialize value as data view.`, x);

        return undefined;
    }
}
