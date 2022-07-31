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
                const keyArraySerializerContext = genericKeySerializerContext.defineChildSerializerContext({ jsonPathKey: genericKeySerializerContext.jsonPathKey });
                const valueArraySerializerContext = genericValueSerializerContext.defineChildSerializerContext({ jsonPathKey: genericValueSerializerContext.jsonPathKey });

                const keySerializerContext = keyArraySerializerContext.defineChildSerializerContext({
                    jsonPathKey: 'key',
                    typeMetadata: genericKeySerializerContext.typeMetadata
                });

                const valueSerializerContext = valueArraySerializerContext.defineChildSerializerContext({
                    jsonPathKey: 'value',
                    typeMetadata: genericValueSerializerContext.typeMetadata
                });
                
                let i = -1;

                for (const [mk, mv] of map.entries())
                {
                    i++;

                    keyArraySerializerContext.configureJsonPathKey(i);
                    valueArraySerializerContext.configureJsonPathKey(i);
                    keySerializerContext.configureReferenceValueSetter(v => array[i][keySerializerContext.jsonPathKey] = v);
                    valueSerializerContext.configureReferenceValueSetter(v => array[i][valueSerializerContext.jsonPathKey] = v);

                    array[i] = {};
                    array[i][keySerializerContext.jsonPathKey] = keySerializerContext.serialize(mk);
                    array[i][valueSerializerContext.jsonPathKey] = valueSerializerContext.serialize(mv);
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
                const keyArraySerializerContext = genericKeySerializerContext.defineChildSerializerContext({ jsonPathKey: genericKeySerializerContext.jsonPathKey });
                const valueArraySerializerContext = genericValueSerializerContext.defineChildSerializerContext({ jsonPathKey: genericValueSerializerContext.jsonPathKey });

                const keySerializerContext = keyArraySerializerContext.defineChildSerializerContext({
                    jsonPathKey: 'key',
                    typeMetadata: genericKeySerializerContext.typeMetadata
                });

                const valueSerializerContext = valueArraySerializerContext.defineChildSerializerContext({
                    jsonPathKey: 'value',
                    typeMetadata: genericValueSerializerContext.typeMetadata
                });

                for (let i = 0; i < array.length; i++)
                {
                    const mk = array[i][keySerializerContext.jsonPathKey];
                    const mv = array[i][valueSerializerContext.jsonPathKey];

                    keyArraySerializerContext.configureJsonPathKey(i);
                    valueArraySerializerContext.configureJsonPathKey(i);

                    keySerializerContext.configureReferenceValueSetter(v => map.set(v, undefined));

                    const key = keySerializerContext.deserialize(mk);

                    valueSerializerContext.configureReferenceValueSetter(v => map.set(key, v));
                    
                    const value = valueSerializerContext.deserialize(mv);
                    
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
