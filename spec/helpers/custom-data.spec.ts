import { Type, Property, TypeArtisan } from './../../src';
import { CustomData } from './../../src/helpers';

@Type()
@CustomData({ data: 1 })
class X
{
    @Property() @CustomData({ data: 2 }) public a?: string;
}

describe('Custom data decorator', function () 
{
    it('should register custom data for a type', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);

        expect(typeMetadata.typeOptions.customData?.data).toBe(1);
    });

    it('should register custom data for a property', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);

        const aPropertyMetadata = typeMetadata.propertyMetadataMap.get('a');

        expect(aPropertyMetadata).toBeDefined();
        expect(aPropertyMetadata?.propertyOptions.customData?.data).toBe(2);
    });
});
