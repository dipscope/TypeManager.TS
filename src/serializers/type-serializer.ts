import isFunction from 'lodash/isFunction';
import isNil from 'lodash/isNil';
import isNull from 'lodash/isNull';
import isObject from 'lodash/isObject';
import isUndefined from 'lodash/isUndefined';

import { Serializer } from '../serializer';
import { SerializerContext } from '../serializer-context';
import { TypeContext } from '../type-context';
import { TypeContextEntry } from '../type-context-entry';
import { TypeLike } from '../type-like';

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
        if (isUndefined(x))
        {
            return serializerContext.serializedDefaultValue;
        }

        if (isNull(x))
        {
            return null;
        }

        if (isObject(x))
        {
            return serializerContext.defineReference(x, () =>
            {
                const type = x as Record<string, any>;
                const typeSerializerContext = serializerContext.polymorphic ? serializerContext.definePolymorphicSerializerContext(x.constructor) : serializerContext;
                const typeMetadata = typeSerializerContext.typeMetadata;
                const object = {} as Record<string, any>;

                for (const propertyMetadata of typeMetadata.propertyMetadataMap.values())
                {
                    if (propertyMetadata.serializationConfigured && !propertyMetadata.serializable)
                    {
                        continue;
                    }

                    const serializedPropertyName = propertyMetadata.serializedPropertyName;
                    const deserializedPropertyName = propertyMetadata.deserializedPropertyName;
                    const propertyValue = type[deserializedPropertyName];

                    const propertySerializerContext = typeSerializerContext.defineChildSerializerContext({
                        propertyMetadata: propertyMetadata,
                        typeMetadata: propertyMetadata.typeMetadata,
                        genericArguments: propertyMetadata.genericArguments,
                        path: `${typeSerializerContext.path}['${deserializedPropertyName}']`
                    });
    
                    const value = propertySerializerContext.serialize(propertyValue);

                    if (isFunction(value))
                    {
                        propertySerializerContext.pushReferenceCallback(propertyValue, () =>
                        {
                            const declaringObject = propertySerializerContext.referenceMap.get(type);
        
                            if (!isNil(declaringObject))
                            {
                                declaringObject[serializedPropertyName] = value();
                            }
                        });
        
                        continue;
                    }
    
                    object[serializedPropertyName] = value;
                }

                if (typeSerializerContext.preserveDiscriminator)
                {
                    object[typeSerializerContext.discriminator] = typeSerializerContext.discriminant;
                } 
                else if (object.hasOwnProperty(typeSerializerContext.discriminator))
                {
                    delete object[typeSerializerContext.discriminator];
                }

                return object;
            });
        }

        if (serializerContext.log.errorEnabled)
        {
            serializerContext.log.error(`${serializerContext.path}: cannot serialize value as type.`, x);
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
        if (isUndefined(x))
        {
            return serializerContext.deserializedDefaultValue;
        }

        if (isNull(x))
        {
            return null;
        }

        if (isObject(x))
        {
            return serializerContext.restoreReference(x, () =>
            {
                const object = x as Record<string, any>;
                const typeSerializerContext = serializerContext.polymorphic ? serializerContext.definePolymorphicSerializerContext(x) : serializerContext;
                const typeMetadata = typeSerializerContext.typeMetadata;
                const typeContext = new TypeContext(typeMetadata);

                for (const propertyMetadata of typeMetadata.propertyMetadataMap.values())
                {
                    if (propertyMetadata.serializationConfigured && !propertyMetadata.deserializable)
                    {
                        continue;
                    }

                    const serializedPropertyName = propertyMetadata.serializedPropertyName;
                    const deserializedPropertyName = propertyMetadata.deserializedPropertyName;
                    const propertyValue = object[serializedPropertyName];

                    const propertySerializerContext = typeSerializerContext.defineChildSerializerContext({
                        propertyMetadata: propertyMetadata,
                        typeMetadata: propertyMetadata.typeMetadata,
                        genericArguments: propertyMetadata.genericArguments,
                        path: `${typeSerializerContext.path}['${deserializedPropertyName}']`
                    });
    
                    const value = propertySerializerContext.deserialize(propertyValue);

                    if (isFunction(value))
                    {
                        propertySerializerContext.pushReferenceCallback(propertyValue, () =>
                        {
                            const declaringType = propertySerializerContext.referenceMap.get(object);
        
                            if (!isNil(declaringType))
                            {
                                declaringType[deserializedPropertyName] = value();
                            }
                        });
        
                        continue;
                    }

                    typeContext.set(deserializedPropertyName, new TypeContextEntry(deserializedPropertyName, value, propertyMetadata));
                    typeContext.set(serializedPropertyName, new TypeContextEntry(serializedPropertyName, value, propertyMetadata));
                }

                for (const propertyName in object)
                {
                    if (object.hasOwnProperty(propertyName))
                    {
                        typeContext.set(propertyName, new TypeContextEntry(propertyName, object[propertyName]));
                    }
                }
                
                const factory = typeSerializerContext.factory;
                const injector = typeSerializerContext.injector;
                const type = factory.build(typeContext, injector);

                if (typeSerializerContext.preserveDiscriminator)
                {
                    type[typeSerializerContext.discriminator] = typeSerializerContext.discriminant;
                }
                else if (type.hasOwnProperty(typeSerializerContext.discriminator))
                {
                    delete type[typeSerializerContext.discriminator];
                }

                return type;
            });
        }
        
        if (serializerContext.log.errorEnabled)
        {
            serializerContext.log.error(`${serializerContext.path}: cannot deserialize value as type.`, x);
        }

        return undefined;
    }
}
