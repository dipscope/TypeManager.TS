import { Property, TypeArtisan } from './../src';
import { ObjectSerializer } from './../src/serializers';
import { ObjectFactory } from './../src/factories';
import { SingletonInjector } from './../src/injectors';

class X
{
    @Property() public a?: string;
    @Property('String', { alias: 'e', typeFactory: new ObjectFactory() }) public b?: string;
    @Property(() => String, { serializable: true, typeInjector: new SingletonInjector() }) public c?: string;
    @Property({ deserializable: true }) public d?: number;
    @Property('Number', { defaultValue: 1 }) public e?: number;
    @Property(() => Number, { useDefaultValue: true }) public f?: number;
    @Property({ useImplicitConversion: true, typeSerializer: new ObjectSerializer() }) public g?: boolean;
}

describe('Property decorator', function () 
{
    it('should register type metadata', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);

        expect(typeMetadata).toBeDefined();
    });

    it('should register property metadata', function ()
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
        expect(aPropertyMetadata?.propertyOptions.alias).toBeUndefined();
        expect(aPropertyMetadata?.propertyOptions.serializable).toBeUndefined();
        expect(aPropertyMetadata?.propertyOptions.deserializable).toBeUndefined();
        expect(aPropertyMetadata?.propertyOptions.defaultValue).toBeUndefined();
        expect(aPropertyMetadata?.propertyOptions.useDefaultValue).toBeUndefined();
        expect(aPropertyMetadata?.propertyOptions.useImplicitConversion).toBeUndefined();
        expect(aPropertyMetadata?.propertyOptions.typeResolver).toBeUndefined();
        expect(aPropertyMetadata?.propertyOptions.typeFactory).toBeUndefined();
        expect(aPropertyMetadata?.propertyOptions.typeInjector).toBeUndefined();
        expect(aPropertyMetadata?.propertyOptions.typeSerializer).toBeUndefined();

        expect(bPropertyMetadata).toBeDefined();
        expect(bPropertyMetadata?.name).toBe('b');
        expect(bPropertyMetadata?.propertyOptions.alias).toBe('e');
        expect(bPropertyMetadata?.propertyOptions.serializable).toBeUndefined();
        expect(bPropertyMetadata?.propertyOptions.deserializable).toBeUndefined();
        expect(bPropertyMetadata?.propertyOptions.defaultValue).toBeUndefined();
        expect(bPropertyMetadata?.propertyOptions.useDefaultValue).toBeUndefined();
        expect(bPropertyMetadata?.propertyOptions.useImplicitConversion).toBeUndefined();
        expect(bPropertyMetadata?.propertyOptions.typeResolver).toBeDefined();
        expect(bPropertyMetadata?.propertyOptions.typeFactory).toBeInstanceOf(ObjectFactory);
        expect(bPropertyMetadata?.propertyOptions.typeInjector).toBeUndefined();
        expect(bPropertyMetadata?.propertyOptions.typeSerializer).toBeUndefined();

        expect(cPropertyMetadata).toBeDefined();
        expect(cPropertyMetadata?.name).toBe('c');
        expect(cPropertyMetadata?.propertyOptions.alias).toBeUndefined();
        expect(cPropertyMetadata?.propertyOptions.serializable).toBeTrue();
        expect(cPropertyMetadata?.propertyOptions.deserializable).toBeUndefined();
        expect(cPropertyMetadata?.propertyOptions.defaultValue).toBeUndefined();
        expect(cPropertyMetadata?.propertyOptions.useDefaultValue).toBeUndefined();
        expect(cPropertyMetadata?.propertyOptions.useImplicitConversion).toBeUndefined();
        expect(cPropertyMetadata?.propertyOptions.typeResolver).toBeDefined();
        expect(cPropertyMetadata?.propertyOptions.typeFactory).toBeUndefined();
        expect(cPropertyMetadata?.propertyOptions.typeInjector).toBeInstanceOf(SingletonInjector);
        expect(cPropertyMetadata?.propertyOptions.typeSerializer).toBeUndefined();

        expect(dPropertyMetadata).toBeDefined();
        expect(dPropertyMetadata?.name).toBe('d');
        expect(dPropertyMetadata?.propertyOptions.alias).toBeUndefined();
        expect(dPropertyMetadata?.propertyOptions.serializable).toBeUndefined();
        expect(dPropertyMetadata?.propertyOptions.deserializable).toBeTrue();
        expect(dPropertyMetadata?.propertyOptions.defaultValue).toBeUndefined();
        expect(dPropertyMetadata?.propertyOptions.useDefaultValue).toBeUndefined();
        expect(dPropertyMetadata?.propertyOptions.useImplicitConversion).toBeUndefined();
        expect(dPropertyMetadata?.propertyOptions.typeResolver).toBeUndefined();
        expect(dPropertyMetadata?.propertyOptions.typeFactory).toBeUndefined();
        expect(dPropertyMetadata?.propertyOptions.typeInjector).toBeUndefined();
        expect(dPropertyMetadata?.propertyOptions.typeSerializer).toBeUndefined();

        expect(ePropertyMetadata).toBeDefined();
        expect(ePropertyMetadata?.name).toBe('e');
        expect(ePropertyMetadata?.propertyOptions.alias).toBeUndefined();
        expect(ePropertyMetadata?.propertyOptions.serializable).toBeUndefined();
        expect(ePropertyMetadata?.propertyOptions.deserializable).toBeUndefined();
        expect(ePropertyMetadata?.propertyOptions.defaultValue).toBe(1);
        expect(ePropertyMetadata?.propertyOptions.useDefaultValue).toBeUndefined();
        expect(ePropertyMetadata?.propertyOptions.useImplicitConversion).toBeUndefined();
        expect(ePropertyMetadata?.propertyOptions.typeResolver).toBeDefined();
        expect(ePropertyMetadata?.propertyOptions.typeFactory).toBeUndefined();
        expect(ePropertyMetadata?.propertyOptions.typeInjector).toBeUndefined();
        expect(ePropertyMetadata?.propertyOptions.typeSerializer).toBeUndefined();

        expect(fPropertyMetadata).toBeDefined();
        expect(fPropertyMetadata?.name).toBe('f');
        expect(fPropertyMetadata?.propertyOptions.alias).toBeUndefined();
        expect(fPropertyMetadata?.propertyOptions.serializable).toBeUndefined();
        expect(fPropertyMetadata?.propertyOptions.deserializable).toBeUndefined();
        expect(fPropertyMetadata?.propertyOptions.defaultValue).toBeUndefined();
        expect(fPropertyMetadata?.propertyOptions.useDefaultValue).toBeTrue();
        expect(fPropertyMetadata?.propertyOptions.useImplicitConversion).toBeUndefined();
        expect(fPropertyMetadata?.propertyOptions.typeResolver).toBeDefined();
        expect(fPropertyMetadata?.propertyOptions.typeFactory).toBeUndefined();
        expect(fPropertyMetadata?.propertyOptions.typeInjector).toBeUndefined();
        expect(fPropertyMetadata?.propertyOptions.typeSerializer).toBeUndefined();

        expect(gPropertyMetadata).toBeDefined();
        expect(gPropertyMetadata?.name).toBe('g');
        expect(gPropertyMetadata?.propertyOptions.alias).toBeUndefined();
        expect(gPropertyMetadata?.propertyOptions.serializable).toBeUndefined();
        expect(gPropertyMetadata?.propertyOptions.deserializable).toBeUndefined();
        expect(gPropertyMetadata?.propertyOptions.defaultValue).toBeUndefined();
        expect(gPropertyMetadata?.propertyOptions.useDefaultValue).toBeUndefined();
        expect(gPropertyMetadata?.propertyOptions.useImplicitConversion).toBeTrue();
        expect(gPropertyMetadata?.propertyOptions.typeResolver).toBeUndefined();
        expect(gPropertyMetadata?.propertyOptions.typeFactory).toBeUndefined();
        expect(gPropertyMetadata?.propertyOptions.typeInjector).toBeUndefined();
        expect(gPropertyMetadata?.propertyOptions.typeSerializer).toBeInstanceOf(ObjectSerializer);
    });
});
