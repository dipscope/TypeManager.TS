import { Property, Type, TypeManager, UseDefaultValue } from '../src';

@Type()
@UseDefaultValue()
class User
{
    @Property() @UseDefaultValue() public name?: string;
}

describe('Use default value decorator', () =>
{
    it('should enable use of default value for a type', () =>
    {
        const userMetadata = TypeManager.extractTypeMetadata(User);

        expect(userMetadata.typeOptions.useDefaultValue).toBeTrue();
    });

    it('should enable use of default value for a property', () =>
    {
        const userMetadata = TypeManager.extractTypeMetadata(User);
        const userNameMetadata = userMetadata.propertyMetadataMap.get('name');

        expect(userNameMetadata).toBeDefined();
        expect(userNameMetadata?.propertyOptions.useDefaultValue).toBeTrue();
    });
});
