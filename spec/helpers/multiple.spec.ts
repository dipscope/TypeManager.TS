import { Type, TypeArtisan, Property, Multiple } from '../../src';

@Type()
class X
{
    @Property() public a?: string[];
    @Property() @Multiple() public b?: string;
    @Property() @Multiple(false) public c?: string;
}

describe('Multiple decorator', function () 
{
    it('should register property as multiple', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);

        const aPropertyMetadata = typeMetadata.propertyMetadataMap.get('a');
        const bPropertyMetadata = typeMetadata.propertyMetadataMap.get('b');
        const cPropertyMetadata = typeMetadata.propertyMetadataMap.get('c');

        expect(aPropertyMetadata).toBeDefined();
        expect(aPropertyMetadata?.multiple).toBeFalse();

        expect(bPropertyMetadata).toBeDefined();
        expect(bPropertyMetadata?.multiple).toBeTrue();

        expect(cPropertyMetadata).toBeDefined();
        expect(cPropertyMetadata?.multiple).toBeFalse();
    });
});
