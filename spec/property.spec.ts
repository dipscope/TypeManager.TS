import 'reflect-metadata';
import { Alias, Property, Serializable, Deserializable, TypeArtisan, DefaultValue, UseDefaultValue, UseImplicitConversion } from './../src';

class X
{
    @Property() public a?: string;
    @Property('String') @Alias('e') public b?: string;
    @Property(() => String) @Serializable() public c?: string;
    @Property() @Deserializable() public d?: number;
    @Property('Number') @DefaultValue(1) public e?: number;
    @Property(() => Number) @UseDefaultValue() public f?: number;
    @Property() @UseImplicitConversion() public g?: boolean;
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
        const ePropertyMetadata = typeMetadata.propertyMetadataMap.get('e');
        const fPropertyMetadata = typeMetadata.propertyMetadataMap.get('f');
        const gPropertyMetadata = typeMetadata.propertyMetadataMap.get('g');

        expect(aPropertyMetadata).toBeDefined();
        expect(aPropertyMetadata?.name).toBe('a');
        expect(aPropertyMetadata?.alias).not.toBeDefined();
        expect(aPropertyMetadata?.serializable).not.toBeDefined();
        expect(aPropertyMetadata?.deserializable).not.toBeDefined();
        expect(aPropertyMetadata?.defaultValue).not.toBeDefined();
        expect(aPropertyMetadata?.useDefaultValue).not.toBeDefined();
        expect(aPropertyMetadata?.useImplicitConversion).not.toBeDefined();
        expect(aPropertyMetadata?.typeResolver).toBeUndefined();
        expect(aPropertyMetadata?.reflectTypeResolver).toBeDefined();
        expect(aPropertyMetadata?.reflectTypeResolver()).toBe(String);

        expect(bPropertyMetadata).toBeDefined();
        expect(bPropertyMetadata?.name).toBe('b');
        expect(bPropertyMetadata?.alias).toBe('e');
        expect(bPropertyMetadata?.serializable).not.toBeDefined();
        expect(bPropertyMetadata?.deserializable).not.toBeDefined();
        expect(bPropertyMetadata?.defaultValue).not.toBeDefined();
        expect(bPropertyMetadata?.useDefaultValue).not.toBeDefined();
        expect(bPropertyMetadata?.useImplicitConversion).not.toBeDefined();
        expect(bPropertyMetadata?.typeResolver).toBeDefined();
        expect(bPropertyMetadata?.reflectTypeResolver).toBeDefined();
        expect(bPropertyMetadata?.reflectTypeResolver()).toBe(String);

        expect(cPropertyMetadata).toBeDefined();
        expect(cPropertyMetadata?.name).toBe('c');
        expect(cPropertyMetadata?.alias).not.toBeDefined();
        expect(cPropertyMetadata?.serializable).toBeTrue();
        expect(cPropertyMetadata?.deserializable).not.toBeDefined();
        expect(cPropertyMetadata?.defaultValue).not.toBeDefined();
        expect(cPropertyMetadata?.useDefaultValue).not.toBeDefined();
        expect(cPropertyMetadata?.useImplicitConversion).not.toBeDefined();
        expect(cPropertyMetadata?.typeResolver).toBeDefined();
        expect(cPropertyMetadata?.reflectTypeResolver).toBeDefined();
        expect(cPropertyMetadata?.reflectTypeResolver()).toBe(String);

        expect(dPropertyMetadata).toBeDefined();
        expect(dPropertyMetadata?.name).toBe('d');
        expect(dPropertyMetadata?.alias).not.toBeDefined();
        expect(dPropertyMetadata?.serializable).not.toBeDefined();
        expect(dPropertyMetadata?.deserializable).toBeTrue();
        expect(dPropertyMetadata?.defaultValue).not.toBeDefined();
        expect(dPropertyMetadata?.useDefaultValue).not.toBeDefined();
        expect(dPropertyMetadata?.useImplicitConversion).not.toBeDefined();
        expect(dPropertyMetadata?.typeResolver).toBeUndefined();
        expect(dPropertyMetadata?.reflectTypeResolver).toBeDefined();
        expect(dPropertyMetadata?.reflectTypeResolver()).toBe(Number);

        expect(ePropertyMetadata).toBeDefined();
        expect(ePropertyMetadata?.name).toBe('e');
        expect(ePropertyMetadata?.alias).not.toBeDefined();
        expect(ePropertyMetadata?.serializable).not.toBeDefined();
        expect(ePropertyMetadata?.deserializable).not.toBeDefined();
        expect(ePropertyMetadata?.defaultValue).toBe(1);
        expect(ePropertyMetadata?.useDefaultValue).not.toBeDefined();
        expect(ePropertyMetadata?.useImplicitConversion).not.toBeDefined();
        expect(ePropertyMetadata?.typeResolver).toBeDefined();
        expect(ePropertyMetadata?.reflectTypeResolver).toBeDefined();
        expect(ePropertyMetadata?.reflectTypeResolver()).toBe(Number);

        expect(fPropertyMetadata).toBeDefined();
        expect(fPropertyMetadata?.name).toBe('f');
        expect(fPropertyMetadata?.alias).not.toBeDefined();
        expect(fPropertyMetadata?.serializable).not.toBeDefined();
        expect(fPropertyMetadata?.deserializable).not.toBeDefined();
        expect(fPropertyMetadata?.defaultValue).not.toBeDefined();
        expect(fPropertyMetadata?.useDefaultValue).toBeTrue();
        expect(fPropertyMetadata?.useImplicitConversion).not.toBeDefined();
        expect(fPropertyMetadata?.typeResolver).toBeDefined();
        expect(fPropertyMetadata?.reflectTypeResolver).toBeDefined();
        expect(fPropertyMetadata?.reflectTypeResolver()).toBe(Number);

        expect(gPropertyMetadata).toBeDefined();
        expect(gPropertyMetadata?.name).toBe('g');
        expect(gPropertyMetadata?.alias).not.toBeDefined();
        expect(gPropertyMetadata?.serializable).not.toBeDefined();
        expect(gPropertyMetadata?.deserializable).not.toBeDefined();
        expect(gPropertyMetadata?.defaultValue).not.toBeDefined();
        expect(gPropertyMetadata?.useDefaultValue).not.toBeDefined();
        expect(gPropertyMetadata?.useImplicitConversion).toBeTrue();
        expect(gPropertyMetadata?.typeResolver).toBeUndefined();
        expect(gPropertyMetadata?.reflectTypeResolver).toBeDefined();
        expect(gPropertyMetadata?.reflectTypeResolver()).toBe(Boolean);
    });
});
