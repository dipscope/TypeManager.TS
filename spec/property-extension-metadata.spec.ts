import { isUndefined } from 'lodash';
import { CustomKey, Inject, Property, PropertyExtensionMetadata, PropertyMetadata, Type, TypeManager } from '../src';

const customPropertyKey: CustomKey<string> = new CustomKey<string>('$customPropertyKey');

type CustomPropertyOptions = { customProperty?: string };

class CustomPropertyMetadata<TDeclaringType, TType> extends PropertyExtensionMetadata<TDeclaringType, TType, CustomPropertyOptions>
{
    public constructor(propertyMetadata: PropertyMetadata<TDeclaringType, TType>, customPropertyOptions: CustomPropertyOptions)
    {
        super(propertyMetadata, customPropertyOptions);

        return;
    }

    public get customProperty(): string
    {
        return this.propertyMetadata.extractCustomOption(customPropertyKey);
    }

    public hasCustomProperty(customProperty: string): this
    {
        this.propertyMetadata.hasCustomOption(customPropertyKey, customProperty);

        return this;
    }

    public configure(propertyExtensionOptions: CustomPropertyOptions): this 
    {
        if (!isUndefined(propertyExtensionOptions.customProperty)) 
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
