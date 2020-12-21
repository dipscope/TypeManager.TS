import { Type, TypeArtisan, Property, Serializable } from './../../src';

@Type()
class X
{
    @Property() @Serializable() public a?: string;
}

describe('Serializable decorator', function () 
{
    it('should register property as serializable', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);

        const aPropertyMetadata = typeMetadata.propertyMetadataMap.get('a');

        expect(aPropertyMetadata).toBeDefined();
        expect(aPropertyMetadata?.serializationConfigured).toBeTrue();
        expect(aPropertyMetadata?.serializable).toBeTrue();
        expect(aPropertyMetadata?.deserializable).not.toBeDefined();
    });
});
