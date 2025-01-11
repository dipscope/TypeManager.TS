import { Serializer } from '../serializer';
import { SerializerContext } from '../serializer-context';
import { TypeLike } from '../type-like';

/**
 * Set serializer.
 * 
 * @type {SetSerializer}
 */
export class SetSerializer implements Serializer<Set<any>>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<Set<any>>} x Some value.
     * @param {SerializerContext<Set<any>>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<Set<any>>, serializerContext: SerializerContext<Set<any>>): TypeLike<any>
    {
        if (x === undefined)
        {
            return serializerContext.serializedDefaultValue;
        }

        if (x === null)
        {
            return serializerContext.serializedNullValue;
        }

        if (x instanceof Set)
        {
            return serializerContext.defineReference(x, () =>
            {
                const set = x;
                const array = new Array<any>(set.size);
                const genericSerializerContext = serializerContext.defineGenericSerializerContext(0);
                const valueSerializerContext = genericSerializerContext.defineChildSerializerContext();
                const serializer = valueSerializerContext.serializer;

                valueSerializerContext.referenceValueSetter = (v, k) => array[k] = v;

                let i = -1;
                
                for (const v of set)
                {
                    i++;

                    valueSerializerContext.jsonPathKey = i;

                    array[i] = serializer.serialize(v, valueSerializerContext);
                }

                return array;
            });
        }

        serializerContext.logger.error('SetSerializer', `${serializerContext.jsonPath}: cannot serialize value as set.`, x);

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<Set<any>>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<Set<any>>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<Set<any>>): TypeLike<Set<any>>
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
                const array = x;
                const set = new Set<any>();
                const genericSerializerContext = serializerContext.defineGenericSerializerContext(0);
                const valueSerializerContext = genericSerializerContext.defineChildSerializerContext();
                const serializer = valueSerializerContext.serializer;
                
                valueSerializerContext.referenceValueSetter = v => set.add(v);

                for (let i = 0; i < array.length; i++)
                {
                    valueSerializerContext.jsonPathKey = i;

                    set.add(serializer.deserialize(array[i], valueSerializerContext));
                }

                return set;
            });
        }

        serializerContext.logger.error('SetSerializer', `${serializerContext.jsonPath}: cannot deserialize value as set.`, x);

        return undefined;
    }
}
