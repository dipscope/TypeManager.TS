import { Serializer } from '../serializer';
import { SerializerContext } from '../serializer-context';
import { TypeLike } from '../type-like';

/**
 * Map serializer.
 * 
 * @type {MapSerializer}
 */
export class MapSerializer implements Serializer<Map<any, any>>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<Map<any, any>>} x Some value.
     * @param {SerializerContext<Map<any, any>>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<Map<any, any>>, serializerContext: SerializerContext<Map<any, any>>): TypeLike<any>
    {
        if (x === undefined)
        {
            return serializerContext.serializedDefaultValue;
        }

        if (x === null)
        {
            return serializerContext.serializedNullValue;
        }

        if (x instanceof Map)
        {
            return serializerContext.defineReference(x, () =>
            {
                const map = x;
                const array = new Array<any>(x.size);
                const genericKeySerializerContext = serializerContext.defineGenericSerializerContext(0);
                const genericValueSerializerContext = serializerContext.defineGenericSerializerContext(1);
                const keyArraySerializerContext = genericKeySerializerContext.defineChildSerializerContext();
                const valueArraySerializerContext = genericValueSerializerContext.defineChildSerializerContext();
                const keySerializerContext = keyArraySerializerContext.defineChildSerializerContext();
                const valueSerializerContext = valueArraySerializerContext.defineChildSerializerContext();

                keySerializerContext.jsonPathKey = 'key';
                keySerializerContext.typeState = genericKeySerializerContext.typeState;
                keySerializerContext.referenceValueSetter = (v, k) => array[keyArraySerializerContext.jsonPathKey][k] = v;

                valueSerializerContext.jsonPathKey = 'value';
                valueSerializerContext.typeState = genericValueSerializerContext.typeState;
                valueSerializerContext.referenceValueSetter = (v, k) => array[valueArraySerializerContext.jsonPathKey][k] = v;
                
                const keySerializer = keySerializerContext.serializer;
                const valueSerializer = valueSerializerContext.serializer;

                let i = -1;

                for (const [mk, mv] of map.entries())
                {
                    i++;

                    keyArraySerializerContext.jsonPathKey = i;
                    valueArraySerializerContext.jsonPathKey = i;

                    array[i] = {};
                    array[i][keySerializerContext.jsonPathKey] = keySerializer.serialize(mk, keySerializerContext);
                    array[i][valueSerializerContext.jsonPathKey] = valueSerializer.serialize(mv, valueSerializerContext);
                }

                return array;
            });
        }

        serializerContext.logger.error('MapSerializer', `${serializerContext.jsonPath}: cannot serialize value as map.`, x);

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<Map<any, any>>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<Map<any, any>>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<Map<any, any>>): TypeLike<Map<any, any>>
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
                const map = new Map<any, any>();
                const genericKeySerializerContext = serializerContext.defineGenericSerializerContext(0);
                const genericValueSerializerContext = serializerContext.defineGenericSerializerContext(1);
                const keyArraySerializerContext = genericKeySerializerContext.defineChildSerializerContext();
                const valueArraySerializerContext = genericValueSerializerContext.defineChildSerializerContext();
                const keySerializerContext = keyArraySerializerContext.defineChildSerializerContext();
                const valueSerializerContext = valueArraySerializerContext.defineChildSerializerContext();

                keySerializerContext.jsonPathKey = 'key';
                keySerializerContext.typeState = genericKeySerializerContext.typeState;
                keySerializerContext.referenceValueSetter = v => map.set(v, undefined);

                valueSerializerContext.jsonPathKey = 'value';
                valueSerializerContext.typeState = genericValueSerializerContext.typeState;
                valueSerializerContext.referenceValueSetter = v => map.set(v, undefined);
                
                const keySerializer = keySerializerContext.serializer;
                const valueSerializer = valueSerializerContext.serializer;

                for (let i = 0; i < array.length; i++)
                {
                    const mk = array[i][keySerializerContext.jsonPathKey];
                    const mv = array[i][valueSerializerContext.jsonPathKey];

                    keyArraySerializerContext.jsonPathKey = i;
                    valueArraySerializerContext.jsonPathKey = i;

                    const key = keySerializer.deserialize(mk, keySerializerContext);

                    valueSerializerContext.referenceValueSetter = v => map.set(key, v);

                    const value = valueSerializer.deserialize(mv, valueSerializerContext);
                    
                    map.set(key, value);
                }

                return map;
            });
        }

        serializerContext.logger.error('MapSerializer', `${serializerContext.jsonPath}: Cannot deserialize value as map!`, x);

        return undefined;
    }
}
