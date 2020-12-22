import { Type, Property, TypeArtisan, DefaultValue } from './../../src';

@Type()
@DefaultValue('X')
class X
{
    @Property() @DefaultValue('s') public a?: string;
}

describe('Default value decorator', function () 
{
    it('should register default value for a type', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);

        expect(typeMetadata.defaultValue).toBe('X');
    });

    it('should register default value for a property', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);

        const aPropertyMetadata = typeMetadata.propertyMetadataMap.get('a');

        expect(aPropertyMetadata).toBeDefined();
        expect(aPropertyMetadata?.defaultValue).toBe('s');
    });
});
