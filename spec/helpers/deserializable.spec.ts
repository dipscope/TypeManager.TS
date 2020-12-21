import { Type, TypeArtisan, Property, Deserializable } from './../../src';

@Type()
class X
{
    @Property() @Deserializable() public a?: string;
}

describe('Deserializable decorator', function () 
{
    it('should register property as deserializable', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);

        const aPropertyMetadata = typeMetadata.propertyMetadataMap.get('a');

        expect(aPropertyMetadata).toBeDefined();
        expect(aPropertyMetadata?.serializationConfigured).toBeTrue();
        expect(aPropertyMetadata?.deserializable).toBeTrue();
        expect(aPropertyMetadata?.serializable).not.toBeDefined();
    });
});
