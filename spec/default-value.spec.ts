import { DefaultValue, Property, Type, TypeManager } from '../src';

@Type()
@DefaultValue(() => new User())
class User
{
    @Property() @DefaultValue('BestName') public name?: string;
}

describe('Default value decorator', () =>
{
    it('should register default value for a type', () =>
    {
        const userMetadata = TypeManager.extractTypeMetadata(User);

        expect(userMetadata.typeOptions.defaultValue).toBeDefined();
        expect(userMetadata.typeOptions.defaultValue()).toBeInstanceOf(User);
    });

    it('should register default value for a property', () =>
    {
        const userMetadata     = TypeManager.extractTypeMetadata(User);
        const userNameMetadata = userMetadata.propertyMetadataMap.get('name');

        expect(userNameMetadata).toBeDefined();
        expect(userNameMetadata?.propertyOptions.defaultValue).toBeDefined();
        expect(userNameMetadata?.propertyOptions.defaultValue).toBe('BestName');
    });
});
