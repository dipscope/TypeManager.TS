import { Alias, Property, Type, TypeArtisan } from '../src';

@Type()
@Alias('User:Alias')
class User
{
    @Property() @Alias('username') public name?: string;
}

describe('Alias decorator', () =>
{
    it('should register alias for a type', () =>
    {
        const userMetadata = TypeArtisan.extractTypeMetadata(User);

        expect(userMetadata.typeOptions.alias).toBe('User:Alias');
    });

    it('should register alias for a property', () =>
    {
        const userMetadata     = TypeArtisan.extractTypeMetadata(User);
        const userNameMetadata = userMetadata.propertyMetadataMap.get('name');

        expect(userNameMetadata).toBeDefined();
        expect(userNameMetadata?.propertyOptions.alias).toBe('username');
    });
});
