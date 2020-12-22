import { Type, Property, TypeArtisan, UseImplicitConversion } from '../../src';

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

        expect(typeMetadata.useImplicitConversion).toBeTrue();
    });

    it('should enable use of implicit conversion for a property', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);

        const aPropertyMetadata = typeMetadata.propertyMetadataMap.get('a');

        expect(aPropertyMetadata).toBeDefined();
        expect(aPropertyMetadata?.useImplicitConversion).toBeTrue();
    });
});
