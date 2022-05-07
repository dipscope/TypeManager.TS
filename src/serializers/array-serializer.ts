import { Fn } from '../core/fn';
import { Serializer } from '../core/serializer';
import { SerializerContext } from '../core/serializer-context';
import { TypeLike } from '../core/type-like';

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
        if (Fn.isUndefined(x))
        {
            return serializerContext.defaultValue;
        }

        if (Fn.isNull(x))
        {
            return x;
        }

        if (Fn.isArray(x))
        {
            return serializerContext.defineReference(x, () =>
            {
                const arrayInput = x;
                const arrayOutput = new Array<any>();
                const genericSerializerContext = serializerContext.defineGenericSerializerContext(0);
                
                for (let i = 0; i < arrayInput.length; i++)
                {
                    const valueSerializerContext = genericSerializerContext.defineChildSerializerContext({
                        path: `${genericSerializerContext.path}[${i}]` 
                    });

                    const value = valueSerializerContext.serialize(arrayInput[i]);
        
                    if (Fn.isFunction(value))
                    {
                        genericSerializerContext.pushReferenceCallback(arrayInput[i], () =>
                        {
                            arrayOutput[i] = value();
                        });
        
                        continue;
                    }
        
                    arrayOutput[i] = value;
                }
        
                return arrayOutput;
            });
        }

        if (serializerContext.log.errorEnabled)
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot serialize value as array!`, x);
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
        if (Fn.isUndefined(x))
        {
            return serializerContext.defaultValue;
        }

        if (Fn.isNull(x))
        {
            return x;
        }

        if (Fn.isArray(x))
        {
            return serializerContext.restoreReference(x, () =>
            {
                const arrayInput = x;
                const arrayOutput = new Array<any>();
                const genericSerializerContext = serializerContext.defineGenericSerializerContext(0);
                
                for (let i = 0; i < arrayInput.length; i++)
                {
                    const valueSerializerContext = genericSerializerContext.defineChildSerializerContext({
                        path: `${genericSerializerContext.path}[${i}]` 
                    });

                    const value = valueSerializerContext.deserialize(arrayInput[i]);
        
                    if (Fn.isFunction(value))
                    {
                        genericSerializerContext.pushReferenceCallback(arrayInput[i], () =>
                        {
                            arrayOutput[i] = value();
                        });
        
                        continue;
                    }
        
                    arrayOutput[i] = value;
                }
        
                return arrayOutput;
            });
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot deserialize value as array!`, x);
        }

        return undefined;
    }
}
