import { Type, Property, TypeArtisan } from './../../src';
import { DefaultValue } from './../../src/helpers';

@Type()
@DefaultValue('X')
class X
{
    @Property() @DefaultValue('a') public a?: string;
}

@Type()
@DefaultValue('Y')
class Y
{
    @Property() @DefaultValue('b') public b?: string;
}

describe('Default value decorator', function () 
{
    it('should register default value for a type', function ()
    {
        const xTypeMetadata = TypeArtisan.extractTypeMetadata(X);
        const yTypeMetadata = TypeArtisan.extractTypeMetadata(Y);

        expect(xTypeMetadata.typeOptions.defaultValue).toBe('X');
        expect(yTypeMetadata.typeOptions.defaultValue).toBe('Y');
    });

    it('should register default value for a property', function ()
    {
        const xTypeMetadata = TypeArtisan.extractTypeMetadata(X);
        const yTypeMetadata = TypeArtisan.extractTypeMetadata(Y);

        const aPropertyMetadata = xTypeMetadata.propertyMetadataMap.get('a');
        const bPropertyMetadata = yTypeMetadata.propertyMetadataMap.get('b');

        expect(aPropertyMetadata).toBeDefined();
        expect(aPropertyMetadata?.propertyOptions?.defaultValue).toBe('a');

        expect(bPropertyMetadata).toBeDefined();
        expect(bPropertyMetadata?.propertyOptions?.defaultValue).toBe('b');
    });
});
