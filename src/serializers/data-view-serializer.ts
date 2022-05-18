import { Fn } from '../core/fn';
import { Serializer } from '../core/serializer';
import { SerializerContext } from '../core/serializer-context';
import { TypeLike } from '../core/type-like';

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
        if (Fn.isUndefined(x))
        {
            return serializerContext.serializedDefaultValue;
        }

        if (Fn.isNull(x))
        {
            return x;
        }

        if (Fn.isDataView(x))
        {
            const arrayBufferView = new Uint16Array(x.buffer);
            const charCodeArray = Array.from(arrayBufferView);

            return charCodeArray.map(c => String.fromCharCode(c)).join('');
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot serialize value as data view!`, x);
        }

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
            const arrayBuffer = new ArrayBuffer(x.length * 2);
            const arrayBufferView = new Uint16Array(arrayBuffer);
        
            for (let i = 0; i < x.length; i++)
            {
                arrayBufferView[i] = x.charCodeAt(i);
            }
        
            return new DataView(arrayBuffer);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot deserialize value as data view!`, x);
        }

        return undefined;
    }
}
