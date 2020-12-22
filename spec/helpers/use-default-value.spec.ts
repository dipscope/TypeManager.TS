import { Type, Property, TypeArtisan, UseDefaultValue } from './../../src';

@Type()
@UseDefaultValue()
class X
{
    @Property() @UseDefaultValue() public a?: string;
}

describe('Use default value decorator', function () 
{
    it('should enable use of default value for a type', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);

        expect(typeMetadata.useDefaultValue).toBeTrue();
    });

    it('should enable use of default value for a property', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);

        const aPropertyMetadata = typeMetadata.propertyMetadataMap.get('a');

        expect(aPropertyMetadata).toBeDefined();
        expect(aPropertyMetadata?.useDefaultValue).toBeTrue();
    });
});
