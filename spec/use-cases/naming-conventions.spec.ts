import { Property, Type, TypeManager } from '../../src';
import { CamelCaseNamingConvention, SnakeCaseNamingConvention } from '../../src';
import { SnakeUpperCaseNamingConvention } from '../../src';

@Type({
    namingConvention: new SnakeCaseNamingConvention()
})
class UserStatus
{
    @Property(String) public createdAt?: string;
    @Property(String) public updatedAt?: string;
}

@Type({
    namingConvention: new SnakeUpperCaseNamingConvention()
})
class User
{
    @Property(String) public createdAt?: string;
    @Property(UserStatus, { namingConvention: new CamelCaseNamingConvention() }) public userStatus?: UserStatus;
}

describe('Naming conventions', () =>
{
    it('should properly handle names during serialization and deserialization', () =>
    {
        const userJson = { CREATED_AT: '1', userStatus: { created_at: '2', updated_at: '3' } };
        const user = TypeManager.deserialize(User, userJson);
        
        expect(user).toBeInstanceOf(User);
        expect(user.createdAt).toBe('1');
        expect(user.userStatus).toBeInstanceOf(UserStatus);
        expect(user.userStatus?.createdAt).toBe('2');
        expect(user.userStatus?.updatedAt).toBe('3');

        const object = TypeManager.serialize(User, user);

        expect(object).toBeInstanceOf(Object);
        expect(object.CREATED_AT).toBe('1');
        expect(object.userStatus).toBeInstanceOf(Object);
        expect(object.userStatus?.created_at).toBe('2');
        expect(object.userStatus?.updated_at).toBe('3');
    });
});
