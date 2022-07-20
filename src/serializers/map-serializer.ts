import isArray from 'lodash/isArray';
import isMap from 'lodash/isMap';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
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
     * Map serializer key.
     * 
     * @type {string}
     */
    public static readonly key: string = 'key';

    /**
     * Map serializer value.
     * 
     * @type {string}
     */
    public static readonly value: string = 'value';

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
        if (isUndefined(x))
        {
            return serializerContext.serializedDefaultValue;
        }

        if (isNull(x))
        {
            return serializerContext.serializedNullValue;
        }

        if (isMap(x))
        {
            return serializerContext.defineReference(x, () =>
            {
                const map = x;
                const array = new Array<any>(x.keys.length);
                const genericKeySerializerContext = serializerContext.defineGenericSerializerContext(0);
                const genericValueSerializerContext = serializerContext.defineGenericSerializerContext(1);
                
                let i = -1;

                for (const [k, v] of map.entries())
                {
                    i++;

                    array[i] = {};

                    const keySerializerContext = genericKeySerializerContext.defineChildSerializerContext({
                        jsonPathKey: i
                    }).defineChildSerializerContext({
                        jsonPathKey: MapSerializer.key,
                        referenceValueSetter: v => array[i][MapSerializer.key] = v
                    });

                    const valueSerializerContext = genericValueSerializerContext.defineChildSerializerContext({
                        jsonPathKey: i
                    }).defineChildSerializerContext({
                        jsonPathKey: MapSerializer.value,
                        referenceValueSetter: v => array[i][MapSerializer.value] = v
                    });

                    array[i][MapSerializer.key] = keySerializerContext.serialize(k);
                    array[i][MapSerializer.value] = valueSerializerContext.serialize(v);
                }

                return array;
            });
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.jsonPath}: cannot serialize value as map.`, x);
        }

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
                const array = x;
                const map = new Map<any, any>();
                const genericKeySerializerContext = serializerContext.defineGenericSerializerContext(0);
                const genericValueSerializerContext = serializerContext.defineGenericSerializerContext(1);
                
                for (let i = 0; i < array.length; i++)
                {
                    const k = array[i][MapSerializer.key];
                    const v = array[i][MapSerializer.value];

                    const keySerializerContext = genericKeySerializerContext.defineChildSerializerContext({
                        jsonPathKey: i
                    }).defineChildSerializerContext({
                        jsonPathKey: MapSerializer.key,
                        referenceValueSetter: v => map.set(v, undefined)
                    });

                    const key = keySerializerContext.deserialize(k);

                    const valueSerializerContext = genericValueSerializerContext.defineChildSerializerContext({
                        jsonPathKey: i
                    }).defineChildSerializerContext({
                        jsonPathKey: MapSerializer.value,
                        referenceValueSetter: v => map.set(key, v)
                    });
                    
                    const value = valueSerializerContext.deserialize(v);
                    
                    map.set(key, value);
                }

                return map;
            });
        }

        if (serializerContext.log.errorEnabled)
        {
            serializerContext.log.error(`${serializerContext.jsonPath}: Cannot deserialize value as map!`, x);
        }

        return undefined;
    }
}
