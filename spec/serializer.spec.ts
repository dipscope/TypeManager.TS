import { Type, TypeArtisan, Property, Serializer } from './../src';
import { ObjectSerializer, StringSerializer } from './../src/serializers';

@Type()
@Serializer(new ObjectSerializer())
class User
{
    @Property() @Serializer(new StringSerializer()) public name?: string;
}

describe('Type serializer decorator', function () 
{
    it('should register custom serializer for a type', function ()
    {
        const userMetadata = TypeArtisan.extractTypeMetadata(User);

        expect(userMetadata.typeOptions.serializer).toBeInstanceOf(ObjectSerializer);
    });

    it('should register custom serializer for a property', function ()
    {
        const userMetadata     = TypeArtisan.extractTypeMetadata(User);
        const userNameMetadata = userMetadata.propertyMetadataMap.get('name');

        expect(userNameMetadata).toBeDefined();
        expect(userNameMetadata?.propertyOptions.serializer).toBeInstanceOf(StringSerializer);
    });
});
