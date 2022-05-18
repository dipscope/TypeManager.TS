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

        expect(userMetadata.typeOptions.serializedDefaultValue).toBeDefined();
        expect(userMetadata.typeOptions.serializedDefaultValue()).toBeInstanceOf(User);
        expect(userMetadata.typeOptions.deserializedDefaultValue).toBeDefined();
        expect(userMetadata.typeOptions.deserializedDefaultValue()).toBeInstanceOf(User);
    });

    it('should register default value for a property', () =>
    {
        const userMetadata = TypeManager.extractTypeMetadata(User);
        const userNameMetadata = userMetadata.propertyMetadataMap.get('name');

        expect(userNameMetadata).toBeDefined();
        expect(userNameMetadata?.propertyOptions.serializedDefaultValue).toBeDefined();
        expect(userNameMetadata?.propertyOptions.serializedDefaultValue).toBe('BestName');
        expect(userNameMetadata?.propertyOptions.deserializedDefaultValue).toBeDefined();
        expect(userNameMetadata?.propertyOptions.deserializedDefaultValue).toBe('BestName');
    });
});
