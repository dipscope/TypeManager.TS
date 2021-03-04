import { Property, Type, TypeArtisan, UseImplicitConversion } from '../src';

@Type()
@UseImplicitConversion()
class User
{
    @Property() @UseImplicitConversion() public name?: string;
}

describe('Use implicit conversion decorator', () =>
{
    it('should enable use of implicit conversion for a type', () =>
    {
        const userMetadata = TypeArtisan.extractTypeMetadata(User);

        expect(userMetadata.typeOptions.useImplicitConversion).toBeTrue();
    });

    it('should enable use of implicit conversion for a property', () =>
    {
        const userMetadata     = TypeArtisan.extractTypeMetadata(User);
        const userNameMetadata = userMetadata.propertyMetadataMap.get('name');

        expect(userNameMetadata).toBeDefined();
        expect(userNameMetadata?.propertyOptions.useImplicitConversion).toBeTrue();
    });
});
