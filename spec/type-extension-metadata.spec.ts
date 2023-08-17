import { isUndefined } from 'lodash';
import { CustomKey, Inject, Property, Type, TypeExtensionMetadata, TypeManager, TypeMetadata } from '../src';

const customPropertyKey: CustomKey<string> = new CustomKey<string>('$customPropertyKey');

type CustomTypeOptions = { customProperty?: string };

class CustomTypeMetadata<TType> extends TypeExtensionMetadata<TType, CustomTypeOptions>
{
    public constructor(typeMetadata: TypeMetadata<TType>, customTypeOptions: CustomTypeOptions)
    {
        super(typeMetadata, customTypeOptions);

        return;
    }

    public get customProperty(): string
    {
        return this.typeMetadata.extractCustomOption(customPropertyKey);
    }

    public hasCustomProperty(customProperty: string): this
    {
        this.typeMetadata.hasCustomOption(customPropertyKey, customProperty);

        return this;
    }

    public configure(customTypeOptions: CustomTypeOptions): this 
    {
        if (!isUndefined(customTypeOptions.customProperty)) 
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

describe('Type extension metadata', () =>
{
    it('should register and extract custom options', () =>
    {
        const userMetadata = TypeManager.extractTypeMetadata(User);

        userMetadata.configureTypeExtensionMetadata(CustomTypeMetadata).hasCustomProperty('test');
        
        const customProperty = userMetadata.extractTypeExtensionMetadata(CustomTypeMetadata).customProperty;

        expect(customProperty).toBe('test');
    });
});
