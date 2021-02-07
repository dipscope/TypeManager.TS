import { Type, Property, TypeArtisan } from './../../src';
import { CustomData } from './../../src/helpers';

@Type()
@CustomData({ rank: 1 })
class User
{
    @Property() @CustomData({ priority: 10 }) public name?: string;
}

describe('Custom data decorator', function () 
{
    it('should register custom data for a type', function ()
    {
        const userMetadata = TypeArtisan.extractTypeMetadata(User);

        expect(userMetadata.typeOptions.customData?.rank).toBe(1);
    });

    it('should register custom data for a property', function ()
    {
        const userMetadata     = TypeArtisan.extractTypeMetadata(User);
        const userNameMetadata = userMetadata.propertyMetadataMap.get('name');

        expect(userNameMetadata).toBeDefined();
        expect(userNameMetadata?.propertyOptions.customData?.priority).toBe(10);
    });
});
