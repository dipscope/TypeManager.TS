import { Property, Type, TypeManager } from '../../src';

enum UserPriorityNumeric
{
    Low,
    Medium,
    High
}

enum UserPriorityTextual
{
    Low = 'Low',
    Medium = 'Medium',
    High = 'High'
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
        const user = new User();
        
        user.userPriorityNumeric = UserPriorityNumeric.High;
        user.userPriorityTextual = UserPriorityTextual.Medium;

        const result = TypeManager.serialize(User, user);

        expect(result).toBeInstanceOf(Object);
        expect(result.userPriorityNumeric).toBe(2);
        expect(result.userPriorityTextual).toBe('Medium');
    });

    it('should be properly deserialized', () =>
    {
        const user = {} as Record<string, any>;

        user.userPriorityNumeric = 2; 
        user.userPriorityTextual = 'Medium';

        const result = TypeManager.deserialize(User, user);

        expect(result).toBeInstanceOf(User);
        expect(result.userPriorityNumeric).toBe(UserPriorityNumeric.High);
        expect(result.userPriorityTextual).toBe(UserPriorityTextual.Medium);
    });
});
