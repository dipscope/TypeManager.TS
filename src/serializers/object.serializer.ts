import { Fn, Log } from './../utils';
import { TypeSerializer } from './../type.serializer';
import { TypeCtor } from './../type.ctor';
import { TypeMetadataResolver } from './../type.metadata.resolver';

/**
 * Object serializer.
 * 
 * @type {ObjectSerializer}
 */
export class ObjectSerializer extends TypeSerializer
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
        super();

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

                const objectPropertyName   = propertyMetadata.alias ?? propertyMetadata.name;
                const objectPropertyValue  = type[propertyMetadata.name];
                const propertyTypeCtor     = propertyMetadata.typeResolver();
                const propertyTypeMetadata = Fn.isNil(propertyTypeCtor) ? null : this.typeMetadataResolver(propertyTypeCtor);
                
                if (Fn.isUndefined(objectPropertyValue))
                {
                    const useDefaultValue = propertyMetadata.useDefaultValue ?? propertyTypeMetadata?.useDefaultValue;
                    const defaultValue    = propertyMetadata.defaultValue ?? propertyTypeMetadata?.defaultValue;

                    if (useDefaultValue)
                    {
                        object[objectPropertyName] = Fn.isFunction(defaultValue) ? defaultValue() : defaultValue;
                    }

                    continue;
                }

                const propertyTypeSerializer = Fn.isNil(propertyTypeMetadata) ? null : propertyTypeMetadata.typeSerializer;
                const propertySerializer     = propertyMetadata.typeSerializer ?? propertyTypeSerializer;

                if (Fn.isNil(propertySerializer))
                {
                    object[objectPropertyName] = objectPropertyValue;

                    continue;
                }

                const useImplicitConversion  = propertyMetadata.useImplicitConversion ?? propertyTypeMetadata?.useImplicitConversion;
                const convertedPropertyValue = useImplicitConversion ? propertySerializer.convert(objectPropertyValue) : objectPropertyValue;

                if (Fn.isObject(convertedPropertyValue) && propertySerializer instanceof ObjectSerializer)
                {
                    let relationObject = relationObjectMap.get(convertedPropertyValue);

                    if (!relationObject)
                    {
                        relationObject = propertySerializer.serialize(convertedPropertyValue, relationObjectMap);
                        relationObjectMap.set(convertedPropertyValue, relationObject);
                    }

                    object[objectPropertyName] = relationObject;

                    continue;
                }
                
                object[objectPropertyName] = propertySerializer.serialize(convertedPropertyValue);
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

                const typePropertyName     = propertyMetadata.name;
                const typePropertyValue    = object[propertyMetadata.alias ?? propertyMetadata.name];
                const propertyTypeCtor     = propertyMetadata.typeResolver();
                const propertyTypeMetadata = Fn.isNil(propertyTypeCtor) ? null : this.typeMetadataResolver(propertyTypeCtor);
                
                if (Fn.isUndefined(typePropertyValue))
                {
                    const useDefaultValue = propertyMetadata.useDefaultValue ?? propertyTypeMetadata?.useDefaultValue;
                    const defaultValue    = propertyMetadata.defaultValue ?? propertyTypeMetadata?.defaultValue;

                    if (useDefaultValue)
                    {
                        type[typePropertyName] = Fn.isFunction(defaultValue) ? defaultValue() : defaultValue;
                    }

                    continue;
                }
                
                const propertyTypeSerializer = Fn.isNil(propertyTypeMetadata) ? null : propertyTypeMetadata.typeSerializer;
                const propertySerializer     = propertyMetadata.typeSerializer ?? propertyTypeSerializer;

                if (Fn.isNil(propertySerializer)) 
                {
                    type[typePropertyName] = typePropertyValue;

                    continue;
                }

                const useImplicitConversion  = propertyMetadata.useImplicitConversion ?? propertyTypeMetadata?.useImplicitConversion;
                const convertedPropertyValue = useImplicitConversion ? propertySerializer.convert(typePropertyValue) : typePropertyValue;

                if (Fn.isObject(convertedPropertyValue) && propertySerializer instanceof ObjectSerializer)
                {
                    let relationType = relationTypeMap.get(convertedPropertyValue);

                    if (!relationType)
                    {
                        relationType = propertySerializer.deserialize(convertedPropertyValue, relationTypeMap);
                        relationTypeMap.set(convertedPropertyValue, relationType);
                    }

                    type[typePropertyName] = relationType;

                    continue;
                }
                
                type[typePropertyName] = propertySerializer.deserialize(convertedPropertyValue);
            }

            return type;
        }
        
        if (Log.warnEnabled)
        {
            Log.warn('Deserializing non object value as type!', x);
        }

        return null;
    }

    /**
     * TODO: Implement implicit conversion.
     * 
     * Converts provided value to the target type value.
     * 
     * @param {any} x Some value.
     * 
     * @returns {any} Converted value or original value.
     */
    public convert(x: any): any
    {
        return x;
    }
}
