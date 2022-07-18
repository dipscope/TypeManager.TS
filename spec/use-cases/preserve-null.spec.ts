import { Property, Type, TypeManager } from '../../src';

@Type({
    preserveNull: true
})
class UserStatus
{
    @Property(String) public createdAt?: string;
    @Property(String, { defaultValue: 'default' }) public updatedAt?: string;
}

@Type({
    preserveNull: false
})
class User
{
    @Property(String, { defaultValue: 'default', preserveNull: false, useDefaultValue: true }) public createdAt?: string;
    @Property(UserStatus, { preserveNull: true }) public userStatus?: UserStatus;
}

describe('Preserve null', () =>
{
    it('should be properly applied on type level', () =>
    {
        const userJson = { createdAt: '1', userStatus: { createdAt: null, updatedAt: null } };
        const user = TypeManager.deserialize(User, userJson);
        
        expect(user).toBeInstanceOf(User);
        expect(user.createdAt).toBe('1');
        expect(user.userStatus).toBeInstanceOf(UserStatus);
        expect(user.userStatus?.createdAt).toBeNull();
        expect(user.userStatus?.updatedAt).toBeNull();

        const object = TypeManager.serialize(User, user);

        expect(object).toBeInstanceOf(Object);
        expect(object.createdAt).toBe('1');
        expect(object.userStatus).toBeInstanceOf(Object);
        expect(object.userStatus?.createdAt).toBeNull();
        expect(object.userStatus?.createdAt).toBeNull();
    });

    it('should be properly applied on property level', () =>
    {
        const userJson = { createdAt: null, userStatus: null };
        const user = TypeManager.deserialize(User, userJson);
        
        expect(user).toBeInstanceOf(User);
        expect(user.createdAt).toBe('default');
        expect(user.userStatus).toBeNull();

        const object = TypeManager.serialize(User, user);

        expect(object).toBeInstanceOf(Object);
        expect(object.createdAt).toBe('default');
        expect(object.userStatus).toBeNull();
    });
});
