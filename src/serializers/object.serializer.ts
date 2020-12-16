import { Fn, Log } from './../utils';
import { TypeSerializer } from './../type.serializer';
import { TypeCtor } from './../type.ctor';
import { TypeMetadataResolver } from './../type.metadata.resolver';

/**
 * Object serializer.
 * 
 * @type {ObjectSerializer}
 */
export class ObjectSerializer implements TypeSerializer
{
    /**
     * Type constructor function.
     * 
     * @type {TypeCtor}
     */
    private readonly typeCtor: TypeCtor;

    /**
     * Type metadata resolver.
     * 
     * @type {TypeMetadataResolver}
     */
    private readonly typeMetadataResolver: TypeMetadataResolver;

    /**
     * Constructor.
     * 
     * @param {TypeCtor} typeCtor Type constructor function.
     * @param {TypeMetadataResolver} typeMetadataResolver Type metadata resolver.
     */
    public constructor(typeCtor: TypeCtor, typeMetadataResolver: TypeMetadataResolver)
    {
        this.typeCtor             = typeCtor;
        this.typeMetadataResolver = typeMetadataResolver;

        return;
    }

    /**
     * Serializes provided value.
     * 
     * @param {any} x Some value.
     * 
     * @returns {any} Serialized value.
     */
    public serialize(x: any, relationObjectMap: WeakMap<any, any> = new WeakMap<any, any>()): any
    {
        if (Fn.isNil(x))
        {
            return null;
        }

        if (Fn.isArray(x))
        {
            return x.map(v => this.serialize(v, relationObjectMap));
        }

        if (Fn.isObject(x))
        {
            const typeMetadata = this.typeMetadataResolver(this.typeCtor);

            if (typeMetadata.declaredImplicitly)
            {
                if (Log.errorEnabled)
                {
                    Log.error(`${typeMetadata.name}: cannot serialize implicitly declared type! Declare a type using decorator or configure function!`, x);
                }

                return null;
            }

            const type   = x;
            const object = {} as any;

            for (const propertyMetadata of typeMetadata.propertyMetadataMap.values()) 
            {
                if (propertyMetadata.serializationConfigured && !propertyMetadata.serializable)
                {
                    continue;
                }

                const objectPropertyName  = propertyMetadata.alias ?? propertyMetadata.name;
                const objectPropertyValue = type[propertyMetadata.name];

                if (Fn.isUndefined(objectPropertyValue) && !propertyMetadata.emitDefaultValue)
                {
                    continue;
                }

                const propertyTypeCtor     = propertyMetadata.typeResolver();
                const propertyTypeMetadata = Fn.isNil(propertyTypeCtor) ? null : this.typeMetadataResolver(propertyTypeCtor);
                
                if (Fn.isUndefined(objectPropertyValue) && propertyMetadata.emitDefaultValue && propertyTypeMetadata && !Fn.isUndefined(propertyTypeMetadata.defaultValue))
                {
                    object[objectPropertyName] = propertyTypeMetadata.defaultValue;

                    continue;
                }

                if (Fn.isUndefined(objectPropertyValue))
                {
                    continue;
                }
                
                const propertyTypeSerializer = Fn.isNil(propertyTypeMetadata) ? null : propertyTypeMetadata.typeSerializer;
                const propertySerializer     = propertyMetadata.typeSerializer ?? propertyTypeSerializer;

                if (Fn.isNil(propertySerializer)) 
                {
                    object[objectPropertyName] = objectPropertyValue;

                    continue;
                }

                if (Fn.isObject(objectPropertyValue) && propertySerializer instanceof ObjectSerializer)
                {
                    let relationObject = relationObjectMap.get(objectPropertyValue);

                    if (!relationObject)
                    {
                        relationObject = propertySerializer.serialize(objectPropertyValue, relationObjectMap);
                        relationObjectMap.set(objectPropertyValue, relationObject);
                    }

                    object[objectPropertyName] = relationObject;

                    continue;
                }
                
                object[objectPropertyName] = propertySerializer.serialize(objectPropertyValue);
            }

            return object;
        }

        if (Log.warnEnabled)
        {
            Log.warn('Serializing non type value as object!', x);
        }

        return null;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {any} x Some value.
     * 
     * @returns {any} Deserialized value.
     */
    public deserialize(x: any, relationTypeMap: WeakMap<any, any> = new WeakMap<any, any>()): any
    {
        if (Fn.isNil(x))
        {
            return null;
        }

        if (Fn.isArray(x))
        {
            return x.map(v => this.deserialize(v, relationTypeMap));
        }

        if (Fn.isObject(x))
        {
            const typeMetadata = this.typeMetadataResolver(this.typeCtor);

            if (typeMetadata.declaredImplicitly)
            {
                if (Log.errorEnabled)
                {
                    Log.error(`${typeMetadata.name}: cannot deserialize implicitly declared type! Declare a type using decorator or configure function!`, x);
                }

                return null;
            }

            const object = x;
            const type   = new typeMetadata.typeCtor();

            for (const propertyMetadata of typeMetadata.propertyMetadataMap.values()) 
            {
                if (propertyMetadata.serializationConfigured && !propertyMetadata.serializable)
                {
                    continue;
                }

                const typePropertyName  = propertyMetadata.name;
                const typePropertyValue = object[propertyMetadata.alias ?? propertyMetadata.name];

                if (Fn.isUndefined(typePropertyValue) && !propertyMetadata.emitDefaultValue)
                {
                    continue;
                }

                const propertyTypeCtor     = propertyMetadata.typeResolver();
                const propertyTypeMetadata = Fn.isNil(propertyTypeCtor) ? null : this.typeMetadataResolver(propertyTypeCtor);
                
                if (Fn.isUndefined(typePropertyValue) && propertyMetadata.emitDefaultValue && propertyTypeMetadata && !Fn.isUndefined(propertyTypeMetadata.defaultValue))
                {
                    type[typePropertyName] = propertyTypeMetadata.defaultValue;

                    continue;
                }

                if (Fn.isUndefined(typePropertyValue))
                {
                    continue;
                }
                
                const propertyTypeSerializer = Fn.isNil(propertyTypeMetadata) ? null : propertyTypeMetadata.typeSerializer;
                const propertySerializer     = propertyMetadata.typeSerializer ?? propertyTypeSerializer;

                if (Fn.isNil(propertySerializer)) 
                {
                    type[typePropertyName] = typePropertyValue;

                    continue;
                }

                if (Fn.isObject(typePropertyValue) && propertySerializer instanceof ObjectSerializer)
                {
                    let relationType = relationTypeMap.get(typePropertyValue);

                    if (!relationType)
                    {
                        relationType = propertySerializer.deserialize(typePropertyValue, relationTypeMap);
                        relationTypeMap.set(typePropertyValue, relationType);
                    }

                    type[typePropertyName] = relationType;

                    continue;
                }
                
                type[typePropertyName] = propertySerializer.deserialize(typePropertyValue);
            }

            return type;
        }
        
        if (Log.warnEnabled)
        {
            Log.warn('Deserializing non object value as type!', x);
        }

        return null;
    }
}
