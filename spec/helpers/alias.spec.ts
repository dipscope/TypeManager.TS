import { Type, Alias, Property, TypeArtisan } from './../../src';

@Type()
@Alias('X:Alias')
class X
{
    @Property() @Alias('b') public a?: string;
}

describe('Alias decorator', function () 
{
    it('should register alias for a type', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);

        expect(typeMetadata.alias).toBe('X:Alias');
    });

    it('should register alias for a property', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);

        const aPropertyMetadata = typeMetadata.propertyMetadataMap.get('a');

        expect(aPropertyMetadata).toBeDefined();
        expect(aPropertyMetadata?.alias).toBe('b');
    });
});
