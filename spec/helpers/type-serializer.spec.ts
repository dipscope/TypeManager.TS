import { Type, TypeArtisan, Property } from './../../src';
import { ObjectSerializer, StringSerializer } from './../../src/serializers';
import { TypeSerializer } from './../../src/helpers';

@Type()
@TypeSerializer(new ObjectSerializer())
class X
{
    @Property() @TypeSerializer(new StringSerializer()) public a?: string;
}

describe('Type serializer decorator', function () 
{
    it('should register custom serializer for a type', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);

        expect(typeMetadata.typeOptions.typeSerializer).toBeInstanceOf(ObjectSerializer);
    });

    it('should register custom serializer for a property', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);

        const aPropertyMetadata = typeMetadata.propertyMetadataMap.get('a');

        expect(aPropertyMetadata).toBeDefined();
        expect(aPropertyMetadata?.propertyOptions.typeSerializer).toBeInstanceOf(StringSerializer);
    });
});
