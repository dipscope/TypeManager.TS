import { Type, Property, TypeArtisan  } from './../../src';
import { UseImplicitConversion } from './../../src/helpers';

@Type()
@UseImplicitConversion()
class X
{
    @Property() @UseImplicitConversion() public a?: string;
}

describe('Use implicit conversion decorator', function () 
{
    it('should enable use of implicit conversion for a type', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);

        expect(typeMetadata.typeOptions.useImplicitConversion).toBeTrue();
    });

    it('should enable use of implicit conversion for a property', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);

        const aPropertyMetadata = typeMetadata.propertyMetadataMap.get('a');

        expect(aPropertyMetadata).toBeDefined();
        expect(aPropertyMetadata?.propertyOptions.useImplicitConversion).toBeTrue();
    });
});
