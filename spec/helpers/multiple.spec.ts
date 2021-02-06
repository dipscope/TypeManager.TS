import { Type, TypeArtisan, Property } from '../../src';
import { Multiple } from '../../src/helpers';

@Type()
class X
{
    @Property() @Multiple() public a?: string;
    @Property() @Multiple(false) public b?: string;
}

describe('Multiple decorator', function () 
{
    it('should register property as multiple', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);

        const aPropertyMetadata = typeMetadata.propertyMetadataMap.get('a');
        const bPropertyMetadata = typeMetadata.propertyMetadataMap.get('b');

        expect(aPropertyMetadata).toBeDefined();
        expect(aPropertyMetadata?.propertyOptions.multiple).toBeTrue();

        expect(bPropertyMetadata).toBeDefined();
        expect(bPropertyMetadata?.propertyOptions.multiple).toBeFalse();
    });
});
