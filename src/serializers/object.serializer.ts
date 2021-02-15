import { Fn } from './../core/fn';
import { TypeLike } from './../core/type-like';
import { TypeContext } from './../core/type-context';
import { TypeContextEntry } from './../core/type-context-entry';
import { Serializer } from './../core/serializer';
import { SerializerContext } from './../core/serializer-context';

/**
 * Object serializer.
 * 
 * @type {ObjectSerializer}
 */
export class ObjectSerializer implements Serializer<Record<string, any>>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<Record<string, any>>} x Some value.
     * @param {SerializerContext<Record<string, any>>} serializerContext Type serializer context.
     * @param {WeakMap<any, any>} objectMap Map to track object references.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(
        x: TypeLike<Record<string, any>>, 
        serializerContext: SerializerContext<Record<string, any>>, 
        objectMap: WeakMap<any, any> = new WeakMap<any, any>()
    ): TypeLike<any>
    {
        if (Fn.isUndefined(x))
        {
            return serializerContext.defaultValue;
        }

        if (Fn.isNull(x))
        {
            return null;
        }

        if (Fn.isArray(x))
        {
            return x.map(v => this.serialize(v, serializerContext, objectMap));
        }

        if (Fn.isObject(x))
        {
            const typeMetadata = serializerContext.typeMetadata;

            if (Fn.isNil(typeMetadata))
            {
                if (serializerContext.log.errorEnabled)
                {
                    serializerContext.log.error(`${serializerContext.path}: Cannot define type metadata during serializing value as object!`, x);
                }

                return undefined;
            }

            const type   = x;
            const object = {} as Record<string, any>;

            for (const propertyMetadata of typeMetadata.propertyMetadataMap.values())
            {
                if (propertyMetadata.serializationConfigured && !propertyMetadata.serializable)
                {
                    continue;
                }

                const namingConvention         = propertyMetadata.namingConvention ?? typeMetadata.namingConvention;
                const propertyNameByConvention = namingConvention ? namingConvention.convert(propertyMetadata.name) : propertyMetadata.name;
                const propertyName             = propertyMetadata.alias ?? propertyNameByConvention;
                const propertyValue            = type[propertyMetadata.name];
                const propertySerializer       = propertyMetadata.serializer;

                if (Fn.isNil(propertySerializer))
                {
                    let value = propertyValue;

                    if (Fn.isUndefined(value))
                    {
                        value = propertyMetadata.defaultValue;
                    }

                    object[propertyName] = value;

                    continue;
                }

                if (Fn.isObject(propertyValue) && propertySerializer instanceof ObjectSerializer)
                {
                    let value = objectMap.get(propertyValue);

                    if (Fn.isUndefined(value))
                    {
                        value = propertySerializer.serialize(propertyValue, propertyMetadata, objectMap);

                        objectMap.set(propertyValue, value);
                    }

                    object[propertyName] = value;

                    continue;
                }

                object[propertyName] = propertySerializer.serialize(propertyValue, propertyMetadata);
            }

            return object;
        }

        if (serializerContext.log.errorEnabled)
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot serialize value as object!`, x);
        }

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<Record<string, any>>} serializerContext Serializer context.
     * @param {WeakMap<any, any>} objectMap Map to track object references.
     * 
     * @returns {TypeLike<Record<string, any>>} Deserialized value.
     */
    public deserialize(
        x: TypeLike<any>, 
        serializerContext: SerializerContext<Record<string, any>>, 
        objectMap: WeakMap<any, any> = new WeakMap<any, any>()
    ): TypeLike<Record<string, any>>
    {
        if (Fn.isUndefined(x))
        {
            return serializerContext.defaultValue;
        }

        if (Fn.isNull(x))
        {
            return null;
        }

        if (Fn.isArray(x))
        {
            return x.map(v => this.deserialize(v, serializerContext, objectMap));
        }

        if (Fn.isObject(x))
        {
            const typeMetadata = serializerContext.typeMetadata;
            
            if (Fn.isNil(typeMetadata))
            {
                if (serializerContext.log.errorEnabled)
                {
                    serializerContext.log.error(`${serializerContext.path}: Cannot define type metadata during deserializing value as object!`, x);
                }

                return undefined;
            }

            const object      = x;
            const typeContext = new TypeContext(typeMetadata);

            for (const propertyMetadata of typeMetadata.propertyMetadataMap.values())
            {
                const namingConvention         = propertyMetadata.namingConvention ?? typeMetadata.namingConvention;
                const propertyNameByConvention = namingConvention ? namingConvention.convert(propertyMetadata.name) : propertyMetadata.name;
                const propertyName             = propertyMetadata.alias ?? propertyNameByConvention;
                const propertyValue            = object[propertyName];

                if (propertyMetadata.serializationConfigured && !propertyMetadata.deserializable)
                {
                    typeContext.set(propertyName, new TypeContextEntry(propertyName, propertyValue));

                    continue;
                }

                const propertySerializer = propertyMetadata.serializer;

                if (Fn.isNil(propertySerializer))
                {
                    let value = propertyValue;

                    if (Fn.isUndefined(value))
                    {
                        value = propertyMetadata.defaultValue;
                    }

                    typeContext.set(propertyName, new TypeContextEntry(propertyName, value, propertyMetadata));

                    continue;
                }

                if (Fn.isObject(propertyValue) && propertySerializer instanceof ObjectSerializer)
                {
                    let value = objectMap.get(propertyValue);

                    if (Fn.isUndefined(value))
                    {
                        value = propertySerializer.deserialize(propertyValue, propertyMetadata, objectMap);

                        objectMap.set(propertyValue, value);
                    }

                    typeContext.set(propertyName, new TypeContextEntry(propertyName, value, propertyMetadata));

                    continue;
                }

                typeContext.set(propertyName, new TypeContextEntry(
                    propertyName,
                    propertySerializer.deserialize(propertyValue, propertyMetadata), 
                    propertyMetadata
                ));
            }

            for (const propertyName in object) 
            {
                if (object.hasOwnProperty(propertyName) && !typeContext.has(propertyName))
                {
                    typeContext.set(propertyName, new TypeContextEntry(propertyName, object[propertyName]));
                }
            }

            const factory  = serializerContext.factory ?? typeMetadata.factory;
            const injector = serializerContext.injector ?? typeMetadata.injector;
            const type     = factory.build(typeContext, injector);

            for (const typeContextEntry of typeContext.values())
            {
                if (!Fn.isNil(typeContextEntry.propertyMetadata) && Fn.isUndefined(type[typeContextEntry.propertyMetadata.name]))
                {
                    type[typeContextEntry.propertyMetadata.name] = typeContextEntry.value;
                }
            }

            return type;
        }
        
        if (serializerContext.log.errorEnabled)
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot deserialize value as object!`, x);
        }

        return undefined;
    }
}
