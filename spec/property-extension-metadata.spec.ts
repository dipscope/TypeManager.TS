import { CustomKey, Inject, Property, PropertyExtensionMetadata, PropertyMetadata, Type, TypeManager } from '../src';

const customPropertyKey: CustomKey<string> = new CustomKey<string>('$customPropertyKey');

type CustomPropertyOptions = { customProperty?: string };

class CustomPropertyMetadata<TDeclaringObject, TObject> extends PropertyExtensionMetadata<TDeclaringObject, TObject, CustomPropertyOptions>
{
    public constructor(propertyMetadata: PropertyMetadata<TDeclaringObject, TObject>, customPropertyOptions: CustomPropertyOptions)
    {
        super(propertyMetadata, customPropertyOptions);

        return;
    }

    public get customProperty(): string
    {
        return this.propertyMetadata.extractCustomValue(customPropertyKey);
    }

    public hasCustomProperty(customProperty: string): this
    {
        this.propertyMetadata.hasCustomValue(customPropertyKey, customProperty);

        return this;
    }

    public configure(propertyExtensionOptions: CustomPropertyOptions): this 
    {
        if (propertyExtensionOptions.customProperty !== undefined) 
        {
            this.hasCustomProperty(propertyExtensionOptions.customProperty);
        }

        return this;
    }
}

@Type()
class User
{
    @Property(String) public name: string;
    @Property(String) public rank: string;

    public constructor(@Inject('name') name: string, @Inject('rank') rank: string)
    {
        this.name = name;
        this.rank = rank;

        return;
    }
}

describe('Property extension metadata', () =>
{
    it('should register and extract custom options', () =>
    {
        const userMetadata = TypeManager.extractTypeMetadata(User);
        const nameMetadata = userMetadata.configurePropertyMetadata('name');

        nameMetadata.configurePropertyExtensionMetadata(CustomPropertyMetadata).hasCustomProperty('test');

        const customPropertyMetadata = nameMetadata.extractPropertyExtensionMetadata(CustomPropertyMetadata);

        expect(customPropertyMetadata).toBeDefined();
        expect(customPropertyMetadata?.customProperty).toBe('test');
    });

    it('should not extract custom options when they were not defined', () =>
    {
        const userMetadata = TypeManager.extractTypeMetadata(User);
        const nameMetadata = userMetadata.configurePropertyMetadata('rank');
        const customPropertyMetadata = nameMetadata.extractPropertyExtensionMetadata(CustomPropertyMetadata);

        expect(customPropertyMetadata).toBeUndefined();
    });
});
