import { Fn } from '../core/fn';
import { Serializer } from '../core/serializer';
import { SerializerContext } from '../core/serializer-context';
import { TypeLike } from '../core/type-like';

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
        if (Fn.isUndefined(x))
        {
            return serializerContext.defaultValue;
        }

        if (Fn.isNull(x))
        {
            return x;
        }

        if (Fn.isMap(x))
        {
            return serializerContext.defineReference(x, () =>
            {
                const map = x;
                const array = new Array<any>();
                const genericKeySerializerContext = serializerContext.defineGenericSerializerContext(0);
                const genericValueSerializerContext = serializerContext.defineGenericSerializerContext(1);
                
                let i = -1;

                for (const [k, v] of map.entries())
                {
                    i++;

                    array[i] = {};

                    const keySerializerContext = genericKeySerializerContext.defineChildSerializerContext({ 
                        path: `${genericKeySerializerContext.path}[${i}]['key']`
                    });

                    const valueSerializerContext = genericValueSerializerContext.defineChildSerializerContext({
                        path: `${genericValueSerializerContext.path}[${i}]['value']`
                    });

                    const key = keySerializerContext.serialize(k);
                    const value = valueSerializerContext.serialize(v);
                
                    if (!Fn.isFunction(key) && !Fn.isFunction(value))
                    {
                        array[i]['key']   = key;
                        array[i]['value'] = value;

                        continue;
                    }

                    if (Fn.isFunction(key) && Fn.isFunction(value))
                    {
                        keySerializerContext.pushReferenceCallback(k, () =>
                        {
                            array[i]['key'] = key();
                        });

                        valueSerializerContext.pushReferenceCallback(v, () =>
                        {
                            array[i]['value'] = value();
                        });

                        continue;
                    }

                    if (Fn.isFunction(key) && !Fn.isFunction(value))
                    {
                        keySerializerContext.pushReferenceCallback(k, () =>
                        {
                            array[i]['key']   = key();
                            array[i]['value'] = value;
                        });

                        continue;
                    }

                    if (!Fn.isFunction(key) && Fn.isFunction(value))
                    {
                        valueSerializerContext.pushReferenceCallback(v, () =>
                        {
                            array[i]['key']   = key;
                            array[i]['value'] = value();
                        });

                        continue;
                    }
                }

                return array;
            });
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot serialize value as map!`, x);
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
                const array = x;
                const map = new Map<any, any>();
                const genericKeySerializerContext = serializerContext.defineGenericSerializerContext(0);
                const genericValueSerializerContext = serializerContext.defineGenericSerializerContext(1);
                
                for (let i = 0; i < array.length; i++)
                {
                    const keySerializerContext = genericKeySerializerContext.defineChildSerializerContext({
                        path: `${genericKeySerializerContext.path}[${i}]['key']` 
                    });

                    const valueSerializerContext = genericValueSerializerContext.defineChildSerializerContext({
                        path: `${genericValueSerializerContext.path}[${i}]['value']`
                    });

                    const k = array[i]['key'];
                    const v = array[i]['value'];
                    const key = keySerializerContext.deserialize(k);
                    const value = valueSerializerContext.deserialize(v);
                    
                    if (!Fn.isFunction(key) && !Fn.isFunction(value))
                    {
                        map.set(key, value);

                        continue;
                    }

                    if (Fn.isFunction(key) && Fn.isFunction(value))
                    {
                        keySerializerContext.pushReferenceCallback(k, () =>
                        {
                            map.set(key(), value());
                        });

                        valueSerializerContext.pushReferenceCallback(v, () =>
                        {
                            map.set(key(), value());
                        });

                        continue;
                    }

                    if (Fn.isFunction(key) && !Fn.isFunction(value))
                    {
                        keySerializerContext.pushReferenceCallback(k, () =>
                        {
                            map.set(key(), value);
                        });

                        continue;
                    }

                    if (!Fn.isFunction(key) && Fn.isFunction(value))
                    {
                        valueSerializerContext.pushReferenceCallback(v, () =>
                        {
                            map.set(key, value());
                        });

                        continue;
                    }
                }

                return map;
            });
        }

        if (serializerContext.log.errorEnabled)
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot deserialize value as map!`, x);
        }

        return undefined;
    }
}
