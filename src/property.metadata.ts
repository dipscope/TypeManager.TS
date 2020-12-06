import { Serializer } from './serializer';
import { TypeResolver } from './type.resolver';
import { Fn } from './fn';
import { PropertyOptions } from './property.options';

export class PropertyMetadata
{
    public name: string;

    public typeResolver: TypeResolver;

    public alias?: string;

    public serializable?: boolean;

    public deserializable?: boolean;

    public serializer?: Serializer<any, any>;

    public emitDefaultValue?: boolean;

    public constructor(name: string)
    {
        this.name         = name;
        this.typeResolver = () => null;

        return;
    }

    public get serializationConfigured(): boolean
    {
        return !!this.serializable || !!this.deserializable;
    }

    public configure(propertyOptions: PropertyOptions): PropertyMetadata
    {
        if (!Fn.isNil(propertyOptions.typeResolver)) 
        {
            this.typeResolver = propertyOptions.typeResolver;
        }

        if (!Fn.isNil(propertyOptions.alias)) 
        {
            this.alias = propertyOptions.alias;
        }

        if (!Fn.isNil(propertyOptions.serializable)) 
        {
            this.serializable = propertyOptions.serializable;
        }

        if (!Fn.isNil(propertyOptions.deserializable))
        {
            this.deserializable = propertyOptions.deserializable;
        }

        if (!Fn.isNil(propertyOptions.serializer)) 
        {
            this.serializer = propertyOptions.serializer;
        }

        if (!Fn.isNil(propertyOptions.emitDefaultValue)) 
        {
            this.emitDefaultValue = propertyOptions.emitDefaultValue;
        }

        return this;
    }
}
