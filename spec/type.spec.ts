import { Alias, DefaultValue, Type, TypeArtisan, UseDefaultValue, UseImplicitConversion } from './../src';

@Type()
@Alias('X:Type')
@DefaultValue(() => new X())
@UseDefaultValue()
@UseImplicitConversion()
class X
{
    public a?: string;
}

describe('Type decorator', function () 
{
    it('should explicitly register type metadata', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);
        const typeCtor     = TypeArtisan.typeCtorMap.get('X:Type');

        expect(typeMetadata.alias).toBe('X:Type');
        expect(typeMetadata.declaredExplicitly).toBeTrue();
        expect(typeMetadata.defaultValue).toBeDefined();
        expect(typeMetadata.defaultValue()).toBeInstanceOf(X);
        expect(typeMetadata.useDefaultValue).toBeTrue();
        expect(typeMetadata.useImplicitConversion).toBeTrue();

        expect(typeCtor).toBeDefined();
    });
});
