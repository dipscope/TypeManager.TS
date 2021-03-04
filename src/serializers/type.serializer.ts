import { Fn } from '../core/fn';
import { Serializer } from '../core/serializer';
import { SerializerContext } from '../core/serializer-context';
import { TypeContext } from '../core/type-context';
import { TypeContextEntry } from '../core/type-context-entry';
import { TypeLike } from '../core/type-like';

/**
 * Type serializer.
 * 
 * @type {TypeSerializer}
 */
export class TypeSerializer implements Serializer<Record<string, any>>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<Record<string, any>>} x Some value.
     * @param {SerializerContext<Record<string, any>>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<Record<string, any>>, serializerContext: SerializerContext<Record<string, any>>): TypeLike<any>
    {
        if (Fn.isUndefined(x))
        {
            return serializerContext.defaultValue;
        }

        if (Fn.isNull(x))
        {
            return null;
        }

        if (Fn.isObject(x))
        {
            return serializerContext.defineReference(x, () =>
            {
                const type         = x;
                const typeMetadata = serializerContext.typeMetadata;
                const object       = {} as Record<string, any>;
                
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

                    const propertySerializerContext = serializerContext.defineChildSerializerContext({
                        propertyMetadata: propertyMetadata,
                        typeMetadata:     propertyMetadata.typeMetadata,
                        genericArguments: propertyMetadata.genericArguments,
                        path:             `${serializerContext.path}['${propertyName}']`
                    });
    
                    const value = propertySerializerContext.serialize(propertyValue);

                    if (Fn.isFunction(value))
                    {
                        propertySerializerContext.pushReferenceCallback(propertyValue, () =>
                        {
                            const declaringObject = propertySerializerContext.referenceMap.get(type);
        
                            if (!Fn.isNil(declaringObject))
                            {
                                declaringObject[propertyName] = value();
                            }
                        });
        
                        continue;
                    }
    
                    object[propertyName] = value;
                }

                return object;
            });
        }

        if (serializerContext.log.errorEnabled)
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot serialize value as type!`, x);
        }

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<Record<string, any>>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<Record<string, any>>} Deserialized value or undefined.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<Record<string, any>>): TypeLike<Record<string, any>>
    {
        if (Fn.isUndefined(x))
        {
            return serializerContext.defaultValue;
        }

        if (Fn.isNull(x))
        {
            return null;
        }

        if (Fn.isObject(x))
        {
            return serializerContext.restoreReference(x, () =>
            {
                const object       = x;
                const typeMetadata = serializerContext.typeMetadata;
                const typeContext  = new TypeContext(typeMetadata);

                for (const propertyMetadata of typeMetadata.propertyMetadataMap.values())
                {
                    if (propertyMetadata.serializationConfigured && !propertyMetadata.deserializable)
                    {
                        continue;
                    }

                    const namingConvention         = propertyMetadata.namingConvention ?? typeMetadata.namingConvention;
                    const propertyNameByConvention = namingConvention ? namingConvention.convert(propertyMetadata.name) : propertyMetadata.name;
                    const propertyName             = propertyMetadata.alias ?? propertyNameByConvention;
                    const propertyValue            = object[propertyName];

                    const propertySerializerContext = serializerContext.defineChildSerializerContext({
                        propertyMetadata: propertyMetadata,
                        typeMetadata:     propertyMetadata.typeMetadata,
                        genericArguments: propertyMetadata.genericArguments,
                        path:             `${serializerContext.path}['${propertyName}']`
                    });
    
                    const value = propertySerializerContext.deserialize(propertyValue);

                    if (Fn.isFunction(value))
                    {
                        propertySerializerContext.pushReferenceCallback(propertyValue, () =>
                        {
                            const declaringType = propertySerializerContext.referenceMap.get(object);
        
                            if (!Fn.isNil(declaringType))
                            {
                                declaringType[propertyName] = value();
                            }
                        });
        
                        continue;
                    }

                    typeContext.set(propertyMetadata.name, new TypeContextEntry(propertyMetadata.name, value, propertyMetadata));
                    typeContext.set(propertyName, new TypeContextEntry(propertyName, value, propertyMetadata));
                }

                for (const propertyName in object)
                {
                    if (object.hasOwnProperty(propertyName))
                    {
                        typeContext.set(propertyName, new TypeContextEntry(propertyName, object[propertyName]));
                    }
                }
                
                const factory  = serializerContext.factory;
                const injector = serializerContext.injector;
                const type     = factory.build(typeContext, injector);

                return type;
            });
        }
        
        if (serializerContext.log.errorEnabled)
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot deserialize value as type!`, x);
        }

        return undefined;
    }
}
