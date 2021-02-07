import { Type, TypeArtisan, Property } from './../../src';
import { ObjectSerializer, StringSerializer } from './../../src/serializers';
import { TypeSerializer } from './../../src/helpers';

@Type()
@TypeSerializer(new ObjectSerializer())
class User
{
    @Property() @TypeSerializer(new StringSerializer()) public name?: string;
}

describe('Type serializer decorator', function () 
{
    it('should register custom serializer for a type', function ()
    {
        const userMetadata = TypeArtisan.extractTypeMetadata(User);

        expect(userMetadata.typeOptions.typeSerializer).toBeInstanceOf(ObjectSerializer);
    });

    it('should register custom serializer for a property', function ()
    {
        const userMetadata     = TypeArtisan.extractTypeMetadata(User);
        const userNameMetadata = userMetadata.propertyMetadataMap.get('name');

        expect(userNameMetadata).toBeDefined();
        expect(userNameMetadata?.propertyOptions.typeSerializer).toBeInstanceOf(StringSerializer);
    });
});
