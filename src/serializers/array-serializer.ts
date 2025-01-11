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
        if (x === undefined)
        {
            return serializerContext.serializedDefaultValue;
        }

        if (x === null)
        {
            return serializerContext.serializedNullValue;
        }

        if (Array.isArray(x))
        {
            return serializerContext.defineReference(x, () =>
            {
                const arrayInput = x;
                const arrayOutput = new Array<any>(x.length);
                const genericSerializerContext = serializerContext.defineGenericSerializerContext(0);
                const valueSerializerContext = genericSerializerContext.defineChildSerializerContext();
                const serializer = valueSerializerContext.serializer;

                valueSerializerContext.referenceValueSetter = (v, k) => arrayOutput[k] = v;

                for (let i = 0; i < arrayInput.length; i++)
                {
                    valueSerializerContext.jsonPathKey = i;

                    arrayOutput[i] = serializer.serialize(arrayInput[i], valueSerializerContext);
                }
                
                return arrayOutput;
            });
        }

        serializerContext.logger.error('ArraySerializer', `${serializerContext.jsonPath}: cannot serialize value as array.`, x);

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
            return serializerContext.restoreReference(x, () =>
            {
                const arrayInput = x;
                const arrayOutput = new Array<any>(x.length);
                const genericSerializerContext = serializerContext.defineGenericSerializerContext(0);
                const valueSerializerContext = genericSerializerContext.defineChildSerializerContext();
                const serializer = valueSerializerContext.serializer;

                valueSerializerContext.referenceValueSetter = (v, k) => arrayOutput[k] = v;

                for (let i = 0; i < arrayInput.length; i++)
                {
                    valueSerializerContext.jsonPathKey = i;

                    arrayOutput[i] = serializer.deserialize(arrayInput[i], valueSerializerContext);
                }
        
                return arrayOutput;
            });
        }

        serializerContext.logger.error('ArraySerializer', `${serializerContext.jsonPath}: cannot deserialize value as array.`, x);

        return undefined;
    }
}
