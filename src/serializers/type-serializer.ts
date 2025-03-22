import { PropertyName } from '../property-name';
import { Serializer } from '../serializer';
import { SerializerContext } from '../serializer-context';
import { TypeEntry } from '../type-entry';
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
        if (x === undefined)
        {
            return serializerContext.serializedDefaultValue;
        }

        if (x === null)
        {
            return serializerContext.serializedNullValue;
        }

        if (typeof x === 'object')
        {
            return serializerContext.defineReference(x, () =>
            {
                const type = x as Record<string, any>;

                const typeSerializerContext = serializerContext.polymorphic 
                    ? serializerContext.definePolymorphicSerializerContext(x.constructor) 
                    : serializerContext;

                const propertySerializerContext = typeSerializerContext.defineChildSerializerContext();
                const typeState = typeSerializerContext.typeState;
                const object = {} as Record<string, any>;

                propertySerializerContext.referenceValueSetter = (v, k) => 
                {
                    const declaringObject = propertySerializerContext.referenceMap.get(type);
    
                    if (declaringObject !== undefined)
                    {
                        declaringObject[k] = v;
                    }
                };

                for (let i = 0; i < typeState.sortedPropertyMetadatas.length; i++)
                {
                    const propertyMetadata = typeState.sortedPropertyMetadatas[i];
                    const propertyState = propertyMetadata.propertyState;

                    if (!propertyState.serializable)
                    {
                        continue;
                    }

                    const serializedPropertyName = propertyState.serializedPropertyName;
                    const deserializedPropertyName = propertyState.deserializedPropertyName;
                    const propertyValue = type[deserializedPropertyName];

                    propertySerializerContext.jsonPathKey = serializedPropertyName;
                    propertySerializerContext.propertyState = propertyState;
                    propertySerializerContext.typeState = propertyState.typeMetadata.typeState;
                    propertySerializerContext.genericMetadatas = propertyState.genericMetadatas;

                    const serializer = propertySerializerContext.serializer;
                    const value = serializer.serialize(propertyValue, propertySerializerContext);

                    object[serializedPropertyName] = value;
                }

                if (typeState.preserveDiscriminator)
                {
                    object[typeState.discriminator] = typeState.discriminant;
                } 
                else if (object.hasOwnProperty(typeState.discriminator))
                {
                    delete object[typeState.discriminator];
                }

                return object;
            });
        }

        serializerContext.logger.error('TypeSerializer', `${serializerContext.jsonPath}: cannot serialize value as type.`, x);

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
        if (x === undefined)
        {
            return serializerContext.deserializedDefaultValue;
        }

        if (x === null)
        {
            return serializerContext.deserializedNullValue;
        }

        if (typeof x === 'object')
        {
            return serializerContext.restoreReference(x, () =>
            {
                const object = x as Record<string, any>;

                const typeSerializerContext = serializerContext.polymorphic 
                    ? serializerContext.definePolymorphicSerializerContext(x) 
                    : serializerContext;
                
                const propertySerializerContext = typeSerializerContext.defineChildSerializerContext();
                const typeState = typeSerializerContext.typeState;
                const typeEntryMap = new Map<PropertyName, TypeEntry<any, any>>();

                propertySerializerContext.referenceValueSetter = (v, k) => 
                {
                    const declaringType = propertySerializerContext.referenceMap.get(object);

                    if (declaringType !== undefined)
                    {
                        declaringType[k] = v;
                    }
                };

                for (let i = 0; i < typeState.sortedPropertyMetadatas.length; i++)
                {
                    const propertyMetadata = typeState.sortedPropertyMetadatas[i];
                    const propertyState = propertyMetadata.propertyState;

                    if (!propertyState.deserializable)
                    {
                        continue;
                    }

                    const serializedPropertyName = propertyState.serializedPropertyName;
                    const deserializedPropertyName = propertyState.deserializedPropertyName;
                    const propertyValue = object[serializedPropertyName];

                    propertySerializerContext.jsonPathKey = serializedPropertyName;
                    propertySerializerContext.propertyState = propertyState;
                    propertySerializerContext.typeState = propertyState.typeMetadata.typeState;
                    propertySerializerContext.genericMetadatas = propertyState.genericMetadatas;

                    const serializer = propertySerializerContext.serializer;
                    const value = serializer.deserialize(propertyValue, propertySerializerContext);

                    typeEntryMap.set(deserializedPropertyName, { key: deserializedPropertyName, value: value, propertyMetadata: propertyMetadata });
                    typeEntryMap.set(serializedPropertyName, { key: serializedPropertyName, value: value, propertyMetadata: propertyMetadata });
                }

                for (const propertyName in object)
                {
                    if (object.hasOwnProperty(propertyName) && !typeEntryMap.has(propertyName))
                    {
                        typeEntryMap.set(propertyName, { key: propertyName, value: object[propertyName] });
                    }
                }

                const factory = typeState.factory;
                const injector = typeState.injector;
                const type = factory.build(typeState.typeMetadata, typeEntryMap, injector);

                if (typeState.preserveDiscriminator)
                {
                    type[typeState.discriminator] = typeState.discriminant;
                }
                else if (type.hasOwnProperty(typeState.discriminator))
                {
                    delete type[typeState.discriminator];
                }

                return type;
            });
        }
        
        serializerContext.logger.error('TypeSerializer', `${serializerContext.jsonPath}: cannot deserialize value as type.`, x);

        return undefined;
    }
}
