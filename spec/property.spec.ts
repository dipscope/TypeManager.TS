import { Alias, Property, Serializable, Deserializable, TypeArtisan } from './../src';

class X
{
    @Property() public a?: string;
    @Property() @Alias('e') public b?: string;
    @Property() @Serializable() public c?: string;
    @Property() @Deserializable() public d?: string;
}

describe('Property decorator', function () 
{
    it('should implicitly register type metadata', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);

        expect(typeMetadata.declaredImplicitly).toBeTrue();
    });

    it('should explicitly register property metadata', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);

        const aPropertyMetadata = typeMetadata.propertyMetadataMap.get('a');
        const bPropertyMetadata = typeMetadata.propertyMetadataMap.get('b');
        const cPropertyMetadata = typeMetadata.propertyMetadataMap.get('c');
        const dPropertyMetadata = typeMetadata.propertyMetadataMap.get('d');

        expect(aPropertyMetadata).toBeDefined();
        expect(aPropertyMetadata?.name).toBe('a');
        expect(aPropertyMetadata?.alias).not.toBeDefined();
        expect(aPropertyMetadata?.serializable).not.toBeDefined();
        expect(aPropertyMetadata?.deserializable).not.toBeDefined();

        expect(bPropertyMetadata).toBeDefined();
        expect(bPropertyMetadata?.name).toBe('b');
        expect(bPropertyMetadata?.alias).toBe('e');
        expect(bPropertyMetadata?.serializable).not.toBeDefined();
        expect(bPropertyMetadata?.deserializable).not.toBeDefined();

        expect(cPropertyMetadata).toBeDefined();
        expect(cPropertyMetadata?.name).toBe('c');
        expect(cPropertyMetadata?.alias).not.toBeDefined();
        expect(cPropertyMetadata?.serializable).toBeTrue();
        expect(cPropertyMetadata?.deserializable).not.toBeDefined();

        expect(dPropertyMetadata).toBeDefined();
        expect(dPropertyMetadata?.name).toBe('d');
        expect(dPropertyMetadata?.alias).not.toBeDefined();
        expect(dPropertyMetadata?.serializable).not.toBeDefined();
        expect(dPropertyMetadata?.deserializable).toBeTrue();
    });
});
