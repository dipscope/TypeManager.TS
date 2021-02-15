import { Type, TypeArtisan, Property, Deserializable } from './../src';

@Type()
class User
{
    @Property() @Deserializable() public name?: string;
    @Property() @Deserializable(false) public email?: string;
}

describe('Deserializable decorator', function () 
{
    it('should register property as deserializable', function ()
    {
        const userMetadata      = TypeArtisan.extractTypeMetadata(User);
        const userNameMetadata  = userMetadata.propertyMetadataMap.get('name');
        const userEmailMetadata = userMetadata.propertyMetadataMap.get('email');

        expect(userNameMetadata).toBeDefined();
        expect(userNameMetadata?.serializationConfigured).toBeTrue();
        expect(userNameMetadata?.propertyOptions.deserializable).toBeTrue();
        expect(userNameMetadata?.propertyOptions.serializable).toBeUndefined();

        expect(userEmailMetadata).toBeDefined();
        expect(userEmailMetadata?.serializationConfigured).toBeTrue();
        expect(userEmailMetadata?.propertyOptions.deserializable).toBeFalse();
        expect(userEmailMetadata?.propertyOptions.serializable).toBeUndefined();
    });
});
