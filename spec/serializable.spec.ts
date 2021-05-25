import { Property, Serializable, Type, TypeManager } from '../src';

@Type()
class User
{
    @Property() @Serializable() public name?: string;
    @Property() @Serializable(false) public email?: string;
}

describe('Serializable decorator', () =>
{
    it('should register property as serializable', () =>
    {
        const userMetadata = TypeManager.extractTypeMetadata(User);
        const userNameMetadata = userMetadata.propertyMetadataMap.get('name');
        const userEmailMetadata = userMetadata.propertyMetadataMap.get('email');

        expect(userNameMetadata).toBeDefined();
        expect(userNameMetadata?.serializationConfigured).toBeTrue();
        expect(userNameMetadata?.propertyOptions.deserializable).toBeUndefined();
        expect(userNameMetadata?.propertyOptions.serializable).toBeTrue();

        expect(userEmailMetadata).toBeDefined();
        expect(userEmailMetadata?.serializationConfigured).toBeTrue();
        expect(userEmailMetadata?.propertyOptions.deserializable).toBeUndefined();
        expect(userEmailMetadata?.propertyOptions.serializable).toBeFalse();
    });
});
