import { CustomKey, Inject, Property, Type, TypeExtensionMetadata, TypeManager, TypeMetadata } from '../src';

const customPropertyKey: CustomKey<string> = new CustomKey<string>('$customPropertyKey');

type CustomTypeOptions = { customProperty?: string };

class CustomTypeMetadata<TObject> extends TypeExtensionMetadata<TObject, CustomTypeOptions>
{
    public constructor(typeMetadata: TypeMetadata<TObject>, customTypeOptions: CustomTypeOptions)
    {
        super(typeMetadata, customTypeOptions);

        return;
    }

    public get customProperty(): string
    {
        return this.typeMetadata.extractCustomValue(customPropertyKey);
    }

    public hasCustomProperty(customProperty: string): this
    {
        this.typeMetadata.hasCustomValue(customPropertyKey, customProperty);

        return this;
    }

    public configure(customTypeOptions: CustomTypeOptions): this 
    {
        if (customTypeOptions.customProperty !== undefined) 
        {
            this.hasCustomProperty(customTypeOptions.customProperty);
        }

        return this;
    }
}

@Type()
class User
{
    @Property(String) public name: string;

    public constructor(@Inject('name') name: string)
    {
        this.name = name;

        return;
    }
}

@Type()
class Company
{
    @Property(String) public name: string;

    public constructor(@Inject('name') name: string)
    {
        this.name = name;

        return;
    }
}

describe('Type extension metadata', () =>
{
    it('should register and extract custom options', () =>
    {
        const userMetadata = TypeManager.extractTypeMetadata(User);

        userMetadata.configureTypeExtensionMetadata(CustomTypeMetadata).hasCustomProperty('test');
        
        const customTypeMetadata = userMetadata.extractTypeExtensionMetadata(CustomTypeMetadata);

        expect(customTypeMetadata).toBeDefined();
        expect(customTypeMetadata?.customProperty).toBe('test');
    });

    it('should not extract custom options when they were not defined', () =>
    {
        const userMetadata = TypeManager.extractTypeMetadata(Company);
        const customTypeMetadata = userMetadata.extractTypeExtensionMetadata(CustomTypeMetadata);

        expect(customTypeMetadata).toBeUndefined();
    });
});
