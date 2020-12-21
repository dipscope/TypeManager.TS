import { Type, TypeArtisan, Property, Serializer, TypeSerializer } from './../../src';

class XSerializer extends TypeSerializer
{
    public serialize(x: any): any
    {
        return x;
    }

    public deserialize(x: any): any
    {
        return x;
    }
}

class ASerializer extends TypeSerializer
{
    public serialize(x: any): any
    {
        return x;
    }

    public deserialize(x: any): any
    {
        return x;
    }
}

@Type()
@Serializer(new XSerializer())
class X
{
    @Property() @Serializer(new ASerializer()) public a?: string;
}

describe('Serializer decorator', function () 
{
    it('should register custom serializer for a type', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);

        expect(typeMetadata.typeSerializer).toBeInstanceOf(XSerializer);
    });

    it('should register custom serializer for a property', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);

        const aPropertyMetadata = typeMetadata.propertyMetadataMap.get('a');

        expect(aPropertyMetadata).toBeDefined();
        expect(aPropertyMetadata?.typeSerializer).toBeInstanceOf(ASerializer);
    });
});
