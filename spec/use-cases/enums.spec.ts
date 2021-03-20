import { Property, Type, TypeManager } from '../../src';

enum UserPriorityNumeric
{
    Low,
    Medium,
    High
}

enum UserPriorityTextual
{
    Low    = 'Low',
    Medium = 'Medium',
    High   = 'High'
}

@Type()
class User
{
    @Property(Number) public userPriorityNumeric?: UserPriorityNumeric;
    @Property(String) public userPriorityTextual?: UserPriorityTextual;
}

describe('Enums', () =>
{
    it('should be properly serialized', () =>
    {
        const userManager = new TypeManager(User);
        const user        = new User();
        
        user.userPriorityNumeric = UserPriorityNumeric.High;
        user.userPriorityTextual = UserPriorityTextual.Medium;

        const result = userManager.serialize(user);

        expect(result).toBeInstanceOf(Object);
        expect(result.userPriorityNumeric).toBe(2);
        expect(result.userPriorityTextual).toBe('Medium');
    });

    it('should be properly deserialized', () =>
    {
        const userManager = new TypeManager(User);
        const user        = { userPriorityNumeric: 2, userPriorityTextual: 'Medium' };

        const result = userManager.deserialize(user);

        expect(result).toBeInstanceOf(User);
        expect(result.userPriorityNumeric).toBe(UserPriorityNumeric.High);
        expect(result.userPriorityTextual).toBe(UserPriorityTextual.Medium);
    });
});
