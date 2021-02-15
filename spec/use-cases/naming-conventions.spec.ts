import { Type, TypeManager, NamingConvention, Property } from './../../src';
import { SnakeCaseNamingConvention, SnakeUpperCaseNamingConvention, CamelCaseNamingConvention } from './../../src/naming-conventions';

@Type()
@NamingConvention(new SnakeCaseNamingConvention())
class UserStatus
{
    @Property(() => String) public createdAt?: string;
    @Property(() => String) public updatedAt?: string;
}

@Type()
@NamingConvention(new SnakeUpperCaseNamingConvention())
class User
{
    @Property(() => String) public createdAt?: string;
    @Property(() => UserStatus) @NamingConvention(new CamelCaseNamingConvention()) public userStatus?: UserStatus;
}

describe('Naming conventions', function () 
{
    it('should properly handle names during serialization and deserialization', function ()
    {
        const userManager = new TypeManager(User);
        const user        = userManager.deserialize({ CREATED_AT: '1', userStatus: { created_at: '2', updated_at: '3' }})
        
        expect(user).toBeInstanceOf(User);
        expect(user.createdAt).toBe('1');
        expect(user.userStatus).toBeInstanceOf(UserStatus);
        expect(user.userStatus?.createdAt).toBe('2');
        expect(user.userStatus?.updatedAt).toBe('3');

        const object = userManager.serialize(user);

        expect(object).toBeInstanceOf(Object);
        expect(object.CREATED_AT).toBe('1');
        expect(object.userStatus).toBeInstanceOf(Object);
        expect(object.userStatus?.created_at).toBe('2');
        expect(object.userStatus?.updated_at).toBe('3');
    });
});
