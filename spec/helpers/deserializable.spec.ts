import { Type, TypeArtisan, Property } from './../../src';
import { Deserializable } from './../../src/helpers';

@Type()
class X
{
    @Property() @Deserializable() public a?: string;
    @Property() @Deserializable(false) public b?: string;
}

describe('Deserializable decorator', function () 
{
    it('should register property as deserializable', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);

        const aPropertyMetadata = typeMetadata.propertyMetadataMap.get('a');
        const bPropertyMetadata = typeMetadata.propertyMetadataMap.get('b');

        expect(aPropertyMetadata).toBeDefined();
        expect(aPropertyMetadata?.serializationConfigured).toBeTrue();
        expect(aPropertyMetadata?.propertyOptions.deserializable).toBeTrue();
        expect(aPropertyMetadata?.propertyOptions.serializable).toBeUndefined();

        expect(bPropertyMetadata).toBeDefined();
        expect(bPropertyMetadata?.serializationConfigured).toBeTrue();
        expect(bPropertyMetadata?.propertyOptions.deserializable).toBeFalse();
        expect(bPropertyMetadata?.propertyOptions.serializable).toBeUndefined();
    });
});
