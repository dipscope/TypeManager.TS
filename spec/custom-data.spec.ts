import { CustomData, Property, Type, TypeManager } from '../src';

@Type()
@CustomData({ rank: 1 })
@CustomData({ status: 1 })
class User
{
    @Property() @CustomData({ priority: 10 }) @CustomData({ status: 1 }) public name?: string;
}

describe('Custom data decorator', () =>
{
    it('should register custom data for a type', () =>
    {
        const userMetadata = TypeManager.extractTypeMetadata(User);

        expect(userMetadata.typeOptions.customData?.rank).toBe(1);
        expect(userMetadata.typeOptions.customData?.status).toBe(1);
    });

    it('should register custom data for a property', () =>
    {
        const userMetadata = TypeManager.extractTypeMetadata(User);
        const userNameMetadata = userMetadata.propertyMetadataMap.get('name');

        expect(userNameMetadata).toBeDefined();
        expect(userNameMetadata?.propertyOptions.customData?.priority).toBe(10);
        expect(userNameMetadata?.propertyOptions.customData?.status).toBe(1);
    });
});
