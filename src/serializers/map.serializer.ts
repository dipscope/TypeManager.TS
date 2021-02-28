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
            const keyTypeMetadata        = serializerContext.genericTypeMetadataMap.get(0);
            const keySerializerContext   = serializerContext.genericSerializerContextMap.get(0);
            const valueTypeMetadata      = serializerContext.genericTypeMetadataMap.get(1);
            const valueSerializerContext = serializerContext.genericSerializerContextMap.get(1);

            if (Fn.isNil(keyTypeMetadata) || Fn.isNil(valueTypeMetadata) || Fn.isNil(keySerializerContext) || Fn.isNil(valueSerializerContext))
            {
                if (serializerContext.log.errorEnabled)
                {
                    serializerContext.log.error(`${serializerContext.path}: Cannot define type metadata during serializing value as map!`, x);
                }

                return undefined;
            }

            if (Fn.isNil(keyTypeMetadata.serializer) || Fn.isNil(valueTypeMetadata.serializer))
            {
                if (serializerContext.log.errorEnabled)
                {
                    serializerContext.log.error(`${serializerContext.path}: Cannot define type metadata serializers during serializing value as map!`, x);
                }

                return undefined;
            }

            const mapArray = [] as Record<string, any>[];
            
            for (const [key, value] of x.entries())
            {
                mapArray.push({
                    key:   keyTypeMetadata.serializer.serialize(key, keySerializerContext),
                    value: valueTypeMetadata.serializer.serialize(value, valueSerializerContext)
                });
            }

            return mapArray;
        }

        if (Fn.isArray(x))
        {
            return x.map(v => this.serialize(v, serializerContext));
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot serialize value as number!`, x);
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

        if (Fn.isArray(x) && x.every(v => Fn.isObject(v) && !Fn.isArray(v)))
        {
            const keyTypeMetadata        = serializerContext.genericTypeMetadataMap.get(0);
            const keySerializerContext   = serializerContext.genericSerializerContextMap.get(0);
            const valueTypeMetadata      = serializerContext.genericTypeMetadataMap.get(1);
            const valueSerializerContext = serializerContext.genericSerializerContextMap.get(1);

            if (Fn.isNil(keyTypeMetadata) || Fn.isNil(valueTypeMetadata) || Fn.isNil(keySerializerContext) || Fn.isNil(valueSerializerContext))
            {
                if (serializerContext.log.errorEnabled)
                {
                    serializerContext.log.error(`${serializerContext.path}: Cannot define type metadata during deserializing value as map!`, x);
                }

                return undefined;
            }

            if (Fn.isNil(keyTypeMetadata.serializer) || Fn.isNil(valueTypeMetadata.serializer))
            {
                if (serializerContext.log.errorEnabled)
                {
                    serializerContext.log.error(`${serializerContext.path}: Cannot define type metadata serializers during deserializing value as map!`, x);
                }

                return undefined;
            }

            const mapArray = x;
            const map      = new Map<any, any>();
            
            for (const entry of mapArray)
            {
                map.set(
                    keyTypeMetadata.serializer.deserialize(entry.key, keySerializerContext), 
                    valueTypeMetadata.serializer.deserialize(entry.value, valueSerializerContext)
                );
            }

            return map;
        }

        if (Fn.isArray(x) && x.every(v => Fn.isArray(v)))
        {
            return x.map(v => this.deserialize(v, serializerContext));
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot deserialize value as number!`, x);
        }

        return undefined;
    }
}
