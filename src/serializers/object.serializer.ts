import { Fn, Log } from './../utils';
import { TypeSerializer } from './../type.serializer';
import { TypeMetadata } from './../type.metadata';
import { PropertyMetadata } from './../property.metadata';
import { TypeContextEntry } from './../type.context.entry';
import { TypeContext } from './../type.context';

/**
 * Object serializer.
 * 
 * @type {ObjectSerializer}
 */
export class ObjectSerializer implements TypeSerializer
{
    /**
     * Serializes provided value.
     * 
     * @param {any} x Some value.
     * @param {TypeMetadata} typeMetadata Type metadata when it is known.
     * @param {PropertyMetadata} propertyMetadata Property metadata when serialization is performed on a property level.
     * @param {WeakMap<any, any>} objectMap Object map to handle circular references.
     * 
     * @returns {any} Serialized value.
     */
    public serialize(x: any, typeMetadata?: TypeMetadata, propertyMetadata?: PropertyMetadata, objectMap: WeakMap<any, any> = new WeakMap<any, any>()): any
    {
        if (Fn.isUndefined(x))
        {
            return propertyMetadata?.defaultValue ?? typeMetadata?.defaultValue;
        }

        if (Fn.isNull(x))
        {
            return null;
        }

        if (Fn.isArray(x))
        {
            return x.map(v => this.serialize(v, typeMetadata, propertyMetadata, objectMap));
        }

        if (Fn.isObject(x) && !Fn.isNil(typeMetadata))
        {
            const type   = x;
            const object = {} as any;

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

                const propertyTypeMetadata = propertyMetadata.typeMetadata;

                if (Fn.isObject(propertyValue) && propertyTypeSerializer instanceof ObjectSerializer)
                {
                    let value = objectMap.get(propertyValue);

                    if (Fn.isUndefined(value))
                    {
                        value = propertyTypeSerializer.serialize(propertyValue, propertyTypeMetadata, propertyMetadata, objectMap);

                        objectMap.set(propertyValue, value);
                    }

                    object[propertyName] = value;

                    continue;
                }

                object[propertyName] = propertyTypeSerializer.serialize(propertyValue, propertyTypeMetadata, propertyMetadata);
            }

            return object;
        }

        if (Log.errorEnabled)
        {
            Log.error('Cannot serialize value as object!', x);
        }

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {any} x Some value.
     * @param {TypeMetadata} typeMetadata Type metadata when it is known.
     * @param {PropertyMetadata} propertyMetadata Property metadata when serialization is performed on a property level.
     * @param {WeakMap<any, any>} objectMap Object map to handle circular references.
     * 
     * @returns {any} Deserialized value.
     */
    public deserialize(x: any, typeMetadata?: TypeMetadata, propertyMetadata?: PropertyMetadata, objectMap: WeakMap<any, any> = new WeakMap<any, any>()): any
    {
        if (Fn.isUndefined(x))
        {
            return propertyMetadata?.defaultValue ?? typeMetadata?.defaultValue;
        }

        if (Fn.isNull(x))
        {
            return null;
        }

        if (Fn.isArray(x))
        {
            return x.map(v => this.deserialize(v, typeMetadata, propertyMetadata, objectMap));
        }

        if (Fn.isObject(x) && !Fn.isNil(typeMetadata))
        {
            const object                 = x;
            const parentPropertyMetadata = propertyMetadata;
            const typeContext            = new TypeContext();

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

                const propertyTypeMetadata = propertyMetadata.typeMetadata;

                if (Fn.isObject(propertyValue) && propertyTypeSerializer instanceof ObjectSerializer)
                {
                    let value = objectMap.get(propertyValue);

                    if (Fn.isUndefined(value))
                    {
                        value = propertyTypeSerializer.deserialize(propertyValue, propertyTypeMetadata, propertyMetadata, objectMap);

                        objectMap.set(propertyValue, value);
                    }

                    typeContext.set(propertyName, new TypeContextEntry(propertyName, value, propertyMetadata));

                    continue;
                }

                typeContext.set(propertyName, new TypeContextEntry(
                    propertyName,
                    propertyTypeSerializer.deserialize(propertyValue, propertyTypeMetadata, propertyMetadata), 
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

            const typeFactory  = parentPropertyMetadata?.typeFactory ?? typeMetadata.typeFactory;
            const typeInjector = parentPropertyMetadata?.typeInjector ?? typeMetadata.typeInjector;
            const type         = typeFactory.build(typeMetadata, typeContext, typeInjector);

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
            Log.error('Cannot deserialize value as object!', x);
        }

        return undefined;
    }
}
