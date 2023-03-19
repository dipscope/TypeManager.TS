import { TypeConfiguration, TypeManager, TypeMetadata } from '../../src';

class User
{
    public title: string;
    public name: string;
    public status: string;
    
    public constructor(name: string, status: string, title: string)
    {
        this.name = name;
        this.status = status;
        this.title = title;

        return;
    }
}

class UserConfiguration implements TypeConfiguration<User>
{
    public configure(typeMetadata: TypeMetadata<User>): void 
    {
        typeMetadata.hasAlias('User:Type')
            .shouldPreserveNull()
            .shouldUseImplicitConversion();

        typeMetadata.configurePropertyMetadata('title')
            .isSerializable()
            .isDeserializable(false);

        typeMetadata.configurePropertyMetadata('name')
            .hasAlias('username');

        typeMetadata.configurePropertyMetadata('status')
            .hasAlias('mystatus');

        typeMetadata.configureInjectMetadata(0)
            .hasKey('name');

        typeMetadata.configureInjectMetadata(1)
            .hasKey('status');

        typeMetadata.configureInjectMetadata(2)
            .hasKey('title');

        return;    
    }
}

describe('Declarative configuration', () =>
{
    it('should be properly applied', () =>
    {
        const typeManager = new TypeManager();
        const userMetadata = typeManager.extractTypeMetadata(User);

        typeManager.applyTypeConfiguration(User, new UserConfiguration());

        const titlePropertyMetadata = userMetadata.propertyMetadataMap.get('title');
        const namePropertyMetadata = userMetadata.propertyMetadataMap.get('name');
        const statusPropertyMetadata = userMetadata.propertyMetadataMap.get('status');

        expect(userMetadata.alias).toBe('User:Type');
        expect(userMetadata.preserveNull).toBeTrue();
        expect(userMetadata.useImplicitConversion).toBeTrue();

        expect(titlePropertyMetadata).toBeDefined();
        expect(titlePropertyMetadata?.serializable).toBeTrue();
        expect(titlePropertyMetadata?.deserializable).toBeFalse();

        expect(namePropertyMetadata).toBeDefined();
        expect(namePropertyMetadata?.alias).toBe('username');

        expect(statusPropertyMetadata).toBeDefined();
        expect(statusPropertyMetadata?.alias).toBe('mystatus');

        const titleInjectMetadata = userMetadata.injectMetadataMap.get(2);
        const nameInjectMetadata = userMetadata.injectMetadataMap.get(0);
        const statusInjectMetadata = userMetadata.injectMetadataMap.get(1);

        expect(titleInjectMetadata).toBeDefined();
        expect(titleInjectMetadata?.key).toBe('title');

        expect(nameInjectMetadata).toBeDefined();
        expect(nameInjectMetadata?.key).toBe('name');

        expect(statusInjectMetadata).toBeDefined();
        expect(statusInjectMetadata?.key).toBe('status');
    });
});
