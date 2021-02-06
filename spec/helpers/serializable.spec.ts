import { Type, TypeArtisan, Property } from './../../src';
import { Serializable } from './../../src/helpers';

@Type()
class X
{
    @Property() @Serializable() public a?: string;
    @Property() @Serializable(false) public b?: string;
}

describe('Serializable decorator', function () 
{
    it('should register property as serializable', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);

        const aPropertyMetadata = typeMetadata.propertyMetadataMap.get('a');
        const bPropertyMetadata = typeMetadata.propertyMetadataMap.get('b');

        expect(aPropertyMetadata).toBeDefined();
        expect(aPropertyMetadata?.serializationConfigured).toBeTrue();
        expect(aPropertyMetadata?.propertyOptions.deserializable).toBeUndefined();
        expect(aPropertyMetadata?.propertyOptions.serializable).toBeTrue();

        expect(bPropertyMetadata).toBeDefined();
        expect(bPropertyMetadata?.serializationConfigured).toBeTrue();
        expect(bPropertyMetadata?.propertyOptions.deserializable).toBeUndefined();
        expect(bPropertyMetadata?.propertyOptions.serializable).toBeFalse();
    });
});
