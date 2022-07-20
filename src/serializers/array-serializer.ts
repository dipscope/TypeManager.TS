import isArray from 'lodash/isArray';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
import { Serializer } from '../serializer';
import { SerializerContext } from '../serializer-context';
import { TypeLike } from '../type-like';

/**
 * Array serializer.
 * 
 * @type {ArraySerializer}
 */
export class ArraySerializer implements Serializer<Array<any>>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<Array<any>>} x Some value.
     * @param {SerializerContext<Array<any>>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<Array<any>>, serializerContext: SerializerContext<Array<any>>): TypeLike<any>
    {
        if (isUndefined(x))
        {
            return serializerContext.serializedDefaultValue;
        }

        if (isNull(x))
        {
            return serializerContext.serializedNullValue;
        }

        if (isArray(x))
        {
            return serializerContext.defineReference(x, () =>
            {
                const arrayInput = x;
                const arrayOutput = new Array<any>(x.length);
                const genericSerializerContext = serializerContext.defineGenericSerializerContext(0);
                
                for (let i = 0; i < arrayInput.length; i++)
                {
                    const valueSerializerContext = genericSerializerContext.defineChildSerializerContext({
                        jsonPathKey: i,
                        referenceValueSetter: v => arrayOutput[i] = v
                    });

                    arrayOutput[i] = valueSerializerContext.serialize(arrayInput[i]);
                }
        
                return arrayOutput;
            });
        }

        if (serializerContext.log.errorEnabled)
        {
            serializerContext.log.error(`${serializerContext.jsonPath}: cannot serialize value as array.`, x);
        }

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<Array<any>>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<Array<any>>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<Array<any>>): TypeLike<Array<any>>
    {
        if (isUndefined(x))
        {
            return serializerContext.deserializedDefaultValue;
        }

        if (isNull(x))
        {
            return serializerContext.deserializedNullValue;
        }

        if (isArray(x))
        {
            return serializerContext.restoreReference(x, () =>
            {
                const arrayInput = x;
                const arrayOutput = new Array<any>(x.length);
                const genericSerializerContext = serializerContext.defineGenericSerializerContext(0);
                
                for (let i = 0; i < arrayInput.length; i++)
                {
                    const valueSerializerContext = genericSerializerContext.defineChildSerializerContext({
                        jsonPathKey: i,
                        referenceValueSetter: v => arrayOutput[i] = v
                    });

                    arrayOutput[i] = valueSerializerContext.deserialize(arrayInput[i]);
                }
        
                return arrayOutput;
            });
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.jsonPath}: cannot deserialize value as array.`, x);
        }

        return undefined;
    }
}
