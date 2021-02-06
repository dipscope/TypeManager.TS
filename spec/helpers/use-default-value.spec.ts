import { Type, Property, TypeArtisan } from './../../src';
import { UseDefaultValue } from './../../src/helpers';

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

        expect(typeMetadata.typeOptions.useDefaultValue).toBeTrue();
    });

    it('should enable use of default value for a property', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);

        const aPropertyMetadata = typeMetadata.propertyMetadataMap.get('a');

        expect(aPropertyMetadata).toBeDefined();
        expect(aPropertyMetadata?.propertyOptions.useDefaultValue).toBeTrue();
    });
});
