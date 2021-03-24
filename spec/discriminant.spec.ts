import { Discriminant, Property, Type, TypeManager } from '../src';

@Type()
@Discriminant('UserDiscriminant')
class User
{
    @Property() public name?: string;
}

describe('Discriminant decorator', () =>
{
    it('should register custom discriminant for a type', () =>
    {
        const userMetadata = TypeManager.extractTypeMetadata(User);

        expect(userMetadata.typeOptions.discriminant).toBe('UserDiscriminant');
    });
});
