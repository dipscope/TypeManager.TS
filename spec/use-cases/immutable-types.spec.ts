import { Property, Type, Inject, TypeManager } from './../../src';
import { Alias } from './../../src/helpers';

@Type()
class UserStatus
{
    @Property(() => String) public readonly name: string;
    @Property(() => String) @Alias('label') public readonly title: string;

    public constructor(@Inject('name') name: string, @Inject('label') title: string)
    {
        this.name  = name;
        this.title = title;

        return;
    }
}

@Type()
class User
{
    @Property(() => String) public readonly name: string;
    @Property(() => UserStatus) public readonly userStatus: UserStatus;

    public constructor(@Inject('name') name: string, @Inject('userStatus') userStatus: UserStatus)
    {
        this.name       = name;
        this.userStatus = userStatus;

        return;
    }
}

describe('Immutable type', function () 
{
    it('should inject data from JSON context', function ()
    {
        const userStatusManager = new TypeManager(UserStatus);
        const userStatusJson    = { name: 'Active', label: 'Active user status' };
        const userStatus        = userStatusManager.deserialize(userStatusJson);
        
        expect(userStatus).toBeInstanceOf(UserStatus);
        expect(userStatus.name).toBe('Active');
        expect(userStatus.title).toBe('Active user status');
    });

    it('should inject deserialized JSON data when property metadata is known', function ()
    {
        const userManager = new TypeManager(User);
        const userJson    = { name: 'Dmitry', userStatus: { name: 'Active', label: 'Active user status' } };
        const user        = userManager.deserialize(userJson);

        expect(user).toBeInstanceOf(User);
        expect(user.name).toBe('Dmitry');
        expect(user.userStatus).toBeInstanceOf(UserStatus);
        expect(user.userStatus.name).toBe('Active');
        expect(user.userStatus.title).toBe('Active user status');
    });
});
