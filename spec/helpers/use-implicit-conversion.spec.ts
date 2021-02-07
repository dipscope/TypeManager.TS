import { Type, Property, TypeArtisan  } from './../../src';
import { UseImplicitConversion } from './../../src/helpers';

@Type()
@UseImplicitConversion()
class User
{
    @Property() @UseImplicitConversion() public name?: string;
}

describe('Use implicit conversion decorator', function () 
{
    it('should enable use of implicit conversion for a type', function ()
    {
        const userMetadata = TypeArtisan.extractTypeMetadata(User);

        expect(userMetadata.typeOptions.useImplicitConversion).toBeTrue();
    });

    it('should enable use of implicit conversion for a property', function ()
    {
        const userMetadata     = TypeArtisan.extractTypeMetadata(User);
        const userNameMetadata = userMetadata.propertyMetadataMap.get('name');

        expect(userNameMetadata).toBeDefined();
        expect(userNameMetadata?.propertyOptions.useImplicitConversion).toBeTrue();
    });
});
