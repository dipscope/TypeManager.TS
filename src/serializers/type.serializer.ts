import { TypeCtor } from '../type.ctor';
import { TypeDecorator } from '../type.decorator';
import { Serializer } from '../serializer';
import { TypeBuilder } from '../type.builder';
import { Fn } from '../fn';
import { DirectSerializer } from './direct.serializer';

export class TypeSerializer implements Serializer<any | any[] | null, any | any[] | null>
{
    private typeCtor: TypeCtor;
    private serializer: Serializer<any, any>;


    public constructor(typeCtor: TypeCtor)
    {
        this.typeCtor = typeCtor;
        this.serializer = new DirectSerializer();

        return;
    }

    public serialize(input: any | any[] | null, relationObjectMap: WeakMap<any, any> = new WeakMap<any, any>()): any | any[] | null
    {
        const typeMetadata = TypeDecorator.extractTypeMetadata(this.typeCtor);

        if (Fn.isNil(typeMetadata) || Fn.isNil(input) || !Fn.isObject(input))
        {
            return null;
        }

        const objects  = [];
        const types    = Array.isArray(input) ? input : [input];
        const multiple = Array.isArray(input);

        for (let type of types)
        {
            const object = {} as any;

            for (let propertyMetadata of typeMetadata.propertyMetadataMap.values()) 
            {
                if (propertyMetadata.serializationConfigured && !propertyMetadata.serializable)
                {
                    continue;
                }

                const objectPropertyName  = propertyMetadata.alias ?? propertyMetadata.name;
                const objectPropertyValue = type[propertyMetadata.name];

                if (!Fn.isNil(propertyMetadata.serializer)) 
                {
                    object[objectPropertyName] = propertyMetadata.serializer.serialize(objectPropertyValue);

                    continue;
                }

                const propertyTypeCtor     = propertyMetadata.typeResolver();
                const propertyTypeMetadata = Fn.isNil(propertyTypeCtor) ? null : TypeDecorator.extractTypeMetadata(propertyTypeCtor);
                const propertySerializer   = Fn.isNil(propertyTypeMetadata) ? this.serializer : propertyTypeMetadata.serializer;

                // TODO: ????
                if (Fn.isNil(propertySerializer))
                {
                    object[objectPropertyName] = objectPropertyValue;

                    continue;
                }

                if (propertySerializer instanceof TypeSerializer)
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

            objects.push(object);
        }

        return multiple ? objects : (objects.length > 0 ? objects.shift() : null);
    }

    public deserialize(output: any | any[] | null, relationTypeMap: WeakMap<any, any> = new WeakMap<any, any>()): any | any[] | null
    {
        const typeMetadata = TypeBuilder.typeMetadataCtorMap.get(this.ctor);

        if (!typeMetadata || !output) 
        {
            return null;
        }

        const objectOutput = typeof output === typeof {};

        if (!objectOutput) 
        {
            return null;
        }

        const types    = [];
        const objects  = Array.isArray(output) ? output : [output];
        const multiple = Array.isArray(output);
        
        for (let object of objects) 
        {
            const type = new typeMetadata.ctor();

            for (let objectPropertyName in object) 
            {
                const propertyDescriptor = typeMetadata.propertyDescriptorObjectMap.get(objectPropertyName);

                if (!propertyDescriptor || (propertyDescriptor.serializationConfigured && !propertyDescriptor.deserializable)) 
                {
                    continue;
                }

                const typePropertyName  = propertyDescriptor.alias || propertyDescriptor.name;
                const typePropertyValue = object[objectPropertyName];
                
                if (propertyDescriptor.serializer instanceof ClassSerializer) 
                {
                    let relationType = relationTypeMap.get(typePropertyValue);

                    if (!relationType)
                    {
                        relationType = propertyDescriptor.serializer.deserialize(typePropertyValue, relationTypeMap);
                        relationTypeMap.set(typePropertyValue, relationType);
                    }

                    type[typePropertyName] = relationType;
                }
                else
                {
                    type[typePropertyName] = propertyDescriptor.serializer.deserialize(typePropertyValue);
                }
            }

            types.push(type);
        }
        
        return multiple ? types : (types.length > 0 ? types.shift() : null);
    }
}
