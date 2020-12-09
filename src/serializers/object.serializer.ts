import { Fn, Log } from './../utils';
import { TypeSerializer } from './../type.serializer';
import { TypeCtor } from './../type.ctor';
import { TypeMetadataResolver } from './../type.metadata.resolver';

/**
 * Object serializer.
 * 
 * @type {ObjectSerializer}
 */
export class ObjectSerializer implements TypeSerializer<any, any>
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
     * Converts data from type to object.
     * 
     * @param {any} input Input data.
     * 
     * @returns {any} Output data.
     */
    public serialize(input: any, relationObjectMap: WeakMap<object, any> = new WeakMap<object, any>()): any
    {
        if (Fn.isNil(input))
        {
            return null;
        }

        if (Fn.isArray(input))
        {
            return input.map(i => this.serialize(i, relationObjectMap));
        }

        if (Fn.isObject(input))
        {
            const typeMetadata = this.typeMetadataResolver(this.typeCtor);

            if (typeMetadata.declaredImplicitly)
            {
                if (Log.errorEnabled)
                {
                    Log.error(`${typeMetadata.name}: cannot serialize implicitly declared type! Declare a type using decorator or configure function!`, input);
                }

                return null;
            }

            const type   = input;
            const object = {} as any;

            for (let propertyMetadata of typeMetadata.propertyMetadataMap.values()) 
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
            Log.warn('Serializing non type value as object!', input);
        }

        return null;
    }

    /**
     * Converts data from object to type.
     * 
     * @param {any} output Output data.
     * 
     * @returns {any} Input data.
     */
    public deserialize(output: any, relationTypeMap: WeakMap<object, any> = new WeakMap<object, any>()): any
    {
        if (Fn.isNil(output))
        {
            return null;
        }

        if (Fn.isArray(output))
        {
            return output.map(o => this.deserialize(o, relationTypeMap));
        }

        if (Fn.isObject(output))
        {
            const typeMetadata = this.typeMetadataResolver(this.typeCtor);

            if (typeMetadata.declaredImplicitly)
            {
                if (Log.errorEnabled)
                {
                    Log.error(`${typeMetadata.name}: cannot deserialize implicitly declared type! Declare a type using decorator or configure function!`, output);
                }

                return null;
            }

            const object = output;
            const type   = new typeMetadata.typeCtor();

            for (let propertyMetadata of typeMetadata.propertyMetadataMap.values()) 
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
            Log.warn('Deserializing non object value as type!', output);
        }

        return null;
    }
}
