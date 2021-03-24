import { PreserveDiscriminator, Property, Type, TypeManager } from '../src';

@Type()
@PreserveDiscriminator()
class User
{
    @Property() public name?: string;
}

describe('Preserve discriminator decorator', () =>
{
    it('should enable use of discriminator for a type', () =>
    {
        const userMetadata = TypeManager.extractTypeMetadata(User);

        expect(userMetadata.typeOptions.preserveDiscriminator).toBeTrue();
    });
});
