import { Fn, Log } from './../utils';
import { TypeLike } from './../type.like';
import { TypeSerializer } from './../type.serializer';
import { TypeSerializerContext } from './../type.serializer.context';
import { TypeContextEntry } from './../type.context.entry';
import { TypeContext } from './../type.context';

/**
 * Object serializer.
 * 
 * @type {ObjectSerializer}
 */
export class ObjectSerializer implements TypeSerializer<Record<string, any>>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<Record<string, any>>} x Some value.
     * @param {TypeSerializerContext<Record<string, any>>} typeSerializerContext Type serializer context.
     * @param {WeakMap<any, any>} objectMap Map to track object references.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(
        x: TypeLike<Record<string, any>>, 
        typeSerializerContext: TypeSerializerContext<Record<string, any>>, 
        objectMap: WeakMap<any, any> = new WeakMap<any, any>()
    ): TypeLike<any>
    {
        if (Fn.isUndefined(x))
        {
            return typeSerializerContext.defaultValue;
        }

        if (Fn.isNull(x))
        {
            return null;
        }

        if (Fn.isArray(x))
        {
            return x.map(v => this.serialize(v, typeSerializerContext, objectMap));
        }

        if (Fn.isObject(x))
        {
            const typeMetadata = typeSerializerContext.typeMetadata;

            if (Fn.isNil(typeMetadata))
            {
                Log.error(`${typeSerializerContext.path}: Cannot define type metadata during serializing value as object!`, x);

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

                const propertyName           = propertyMetadata.alias ?? propertyMetadata.name;
                const propertyValue          = type[propertyMetadata.name];
                const propertyTypeSerializer = propertyMetadata.typeSerializer;

                if (Fn.isNil(propertyTypeSerializer))
                {
                    let value = propertyValue;

                    if (Fn.isUndefined(value))
                    {
                        value = propertyMetadata.defaultValue;
                    }

                    object[propertyName] = value;

                    continue;
                }

                if (Fn.isObject(propertyValue) && propertyTypeSerializer instanceof ObjectSerializer)
                {
                    let value = objectMap.get(propertyValue);

                    if (Fn.isUndefined(value))
                    {
                        value = propertyTypeSerializer.serialize(propertyValue, propertyMetadata, objectMap);

                        objectMap.set(propertyValue, value);
                    }

                    object[propertyName] = value;

                    continue;
                }

                object[propertyName] = propertyTypeSerializer.serialize(propertyValue, propertyMetadata);
            }

            return object;
        }

        if (Log.errorEnabled)
        {
            Log.error(`${typeSerializerContext.path}: Cannot serialize value as object!`, x);
        }

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {TypeSerializerContext<Record<string, any>>} typeSerializerContext Type serializer context.
     * @param {WeakMap<any, any>} objectMap Map to track object references.
     * 
     * @returns {TypeLike<Record<string, any>>} Deserialized value.
     */
    public deserialize(
        x: TypeLike<any>, 
        typeSerializerContext: TypeSerializerContext<Record<string, any>>, 
        objectMap: WeakMap<any, any> = new WeakMap<any, any>()
    ): TypeLike<Record<string, any>>
    {
        if (Fn.isUndefined(x))
        {
            return typeSerializerContext.defaultValue;
        }

        if (Fn.isNull(x))
        {
            return null;
        }

        if (Fn.isArray(x))
        {
            return x.map(v => this.deserialize(v, typeSerializerContext, objectMap));
        }

        if (Fn.isObject(x))
        {
            const typeMetadata = typeSerializerContext.typeMetadata;
            
            if (Fn.isNil(typeMetadata))
            {
                Log.error(`${typeSerializerContext.path}: Cannot define type metadata during deserializing value as object!`, x);

                return undefined;
            }

            const object      = x;
            const typeContext = new TypeContext(typeMetadata);

            for (const propertyMetadata of typeMetadata.propertyMetadataMap.values())
            {
                const propertyName  = propertyMetadata.alias ?? propertyMetadata.name;
                const propertyValue = object[propertyName];

                if (propertyMetadata.serializationConfigured && !propertyMetadata.deserializable)
                {
                    typeContext.set(propertyName, new TypeContextEntry(propertyName, propertyValue));

                    continue;
                }

                const propertyTypeSerializer = propertyMetadata.typeSerializer;

                if (Fn.isNil(propertyTypeSerializer))
                {
                    let value = propertyValue;

                    if (Fn.isUndefined(value))
                    {
                        value = propertyMetadata.defaultValue;
                    }

                    typeContext.set(propertyName, new TypeContextEntry(propertyName, value, propertyMetadata));

                    continue;
                }

                if (Fn.isObject(propertyValue) && propertyTypeSerializer instanceof ObjectSerializer)
                {
                    let value = objectMap.get(propertyValue);

                    if (Fn.isUndefined(value))
                    {
                        value = propertyTypeSerializer.deserialize(propertyValue, propertyMetadata, objectMap);

                        objectMap.set(propertyValue, value);
                    }

                    typeContext.set(propertyName, new TypeContextEntry(propertyName, value, propertyMetadata));

                    continue;
                }

                typeContext.set(propertyName, new TypeContextEntry(
                    propertyName,
                    propertyTypeSerializer.deserialize(propertyValue, propertyMetadata), 
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

            const typeFactory  = typeSerializerContext.typeFactory ?? typeMetadata.typeFactory;
            const typeInjector = typeSerializerContext.typeInjector ?? typeMetadata.typeInjector;
            const type         = typeFactory.build(typeContext, typeInjector);

            for (const typeContextEntry of typeContext.values())
            {
                if (!Fn.isNil(typeContextEntry.propertyMetadata) && Fn.isUndefined(type[typeContextEntry.propertyMetadata.name]))
                {
                    type[typeContextEntry.propertyMetadata.name] = typeContextEntry.value;
                }
            }

            return type;
        }
        
        if (Log.errorEnabled)
        {
            Log.error(`${typeSerializerContext.path}: Cannot deserialize value as object!`, x);
        }

        return undefined;
    }
}
