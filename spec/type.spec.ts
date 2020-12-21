import { Alias, Type, TypeArtisan } from './../src';

@Type()
@Alias('X:Type')
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

        expect(typeCtor).toBeDefined();
    });
});
