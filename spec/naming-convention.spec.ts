import { NamingConvention, Property, Type, TypeManager } from '../src';
import { CamelCaseNamingConvention } from '../src/naming-conventions';

@Type()
@NamingConvention(new CamelCaseNamingConvention())
class User
{
    @Property() @NamingConvention(new CamelCaseNamingConvention()) public name?: string;
}

describe('Naming convention decorator', () =>
{
    it('should register custom naming convention for a type', () =>
    {
        const userMetadata = TypeManager.extractTypeMetadata(User);

        expect(userMetadata.typeOptions.namingConvention).toBeInstanceOf(CamelCaseNamingConvention);
    });

    it('should register custom naming convention for a property', () =>
    {
        const userMetadata = TypeManager.extractTypeMetadata(User);
        const userNameMetadata = userMetadata.propertyMetadataMap.get('name');

        expect(userNameMetadata).toBeDefined();
        expect(userNameMetadata?.propertyOptions.namingConvention).toBeInstanceOf(CamelCaseNamingConvention);
    });
});
