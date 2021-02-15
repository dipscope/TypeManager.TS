import { Type, Property, TypeArtisan, Alias } from './../src';

@Type()
@Alias('User:Alias')
class User
{
    @Property() @Alias('username') public name?: string;
}

describe('Alias decorator', function () 
{
    it('should register alias for a type', function ()
    {
        const userMetadata = TypeArtisan.extractTypeMetadata(User);

        expect(userMetadata.typeOptions.alias).toBe('User:Alias');
    });

    it('should register alias for a property', function ()
    {
        const userMetadata     = TypeArtisan.extractTypeMetadata(User);
        const userNameMetadata = userMetadata.propertyMetadataMap.get('name');

        expect(userNameMetadata).toBeDefined();
        expect(userNameMetadata?.propertyOptions.alias).toBe('username');
    });
});
