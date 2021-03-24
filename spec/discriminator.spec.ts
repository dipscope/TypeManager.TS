import { Discriminator, Property, Type, TypeManager } from '../src';

@Type()
@Discriminator('UserDiscriminator')
class User
{
    @Property() public name?: string;
}

describe('Discriminator decorator', () =>
{
    it('should register custom discriminator for a type', () =>
    {
        const userMetadata = TypeManager.extractTypeMetadata(User);

        expect(userMetadata.typeOptions.discriminator).toBe('UserDiscriminator');
    });
});
