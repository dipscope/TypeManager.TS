import { Alias, Type, TypeArtisan } from './../src';

@Type()
@Alias('X:Entity')
class X
{
    public a?: string;
}

describe('Type decorator', function () 
{
    it('should explicitly register type metadata', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);
        const typeCtor     = TypeArtisan.typeCtorMap.get('X:Entity');

        expect(typeMetadata.alias).toBe('X:Entity');
        expect(typeMetadata.declaredExplicitly).toBeTrue();

        expect(typeCtor).toBeDefined();
    });
});
