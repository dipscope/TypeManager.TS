import { DefaultValue, Property, Type, TypeArtisan } from '../src';

@Type()
@DefaultValue(() => new User())
class User
{
    @Property() @DefaultValue('BestName') public name?: string;
}

describe('Default value decorator', () =>
{
    it('should register default value for a type', () =>
    {
        const userMetadata = TypeArtisan.extractTypeMetadata(User);

        expect(userMetadata.typeOptions.defaultValue).toBeDefined();
        expect(userMetadata.typeOptions.defaultValue()).toBeInstanceOf(User);
    });

    it('should register default value for a property', () =>
    {
        const userMetadata     = TypeArtisan.extractTypeMetadata(User);
        const userNameMetadata = userMetadata.propertyMetadataMap.get('name');

        expect(userNameMetadata).toBeDefined();
        expect(userNameMetadata?.propertyOptions.defaultValue).toBeDefined();
        expect(userNameMetadata?.propertyOptions.defaultValue).toBe('BestName');
    });
});
