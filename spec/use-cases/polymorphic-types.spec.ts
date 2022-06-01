import { Property, Type, TypeManager } from '../../src';

@Type()
abstract class UserStatus
{
    @Property(String) public title?: string;
}

@Type()
class DefaultActiveUserStatus extends UserStatus
{
    @Property(Boolean) public active?: boolean;
}

@Type()
class DefaultInactiveUserStatus extends UserStatus
{
    @Property(Boolean) public inactive?: boolean;
}

@Type()
class DefaultBlokedUserStatus extends UserStatus
{
    @Property(Boolean) public blocked?: boolean;
}

@Type({
    discriminator: '__typename__',
    discriminant: 'CustomActiveUS'
})
class CustomActiveUserStatus extends UserStatus
{
    @Property(Boolean) public active?: boolean;
}

@Type({
    discriminator: '__typename__',
    discriminant: 'CustomInactiveUS'
})
class CustomInactiveUserStatus extends UserStatus
{
    @Property(Boolean) public inactive?: boolean;
}

@Type({
    discriminator: '__typename__',
    discriminant: 'CustomBlokedUS'
})
class CustomBlokedUserStatus extends UserStatus
{
    @Property(Boolean) public blocked?: boolean;
}

@Type()
class User
{
    @Property(Array, [UserStatus]) public defaultUserStatuses: UserStatus[] = [];
    @Property(Array, [UserStatus]) public customUserStatuses: UserStatus[] = [];
}

describe('Polymorphic types', () =>
{
    afterEach(() =>
    {
        TypeManager.configureTypeOptionsBase({ 
            preserveDiscriminator: false 
        });
    });

    it('should be properly serialized', () =>
    {
        TypeManager.configureTypeOptionsBase({ 
            preserveDiscriminator: true 
        });

        const user = new User();
        const defaultActiveUserStatus = new DefaultActiveUserStatus();
        const defaultInactiveUserStatus = new DefaultInactiveUserStatus();
        const defaultBlokedUserStatus = new DefaultBlokedUserStatus();
        const customActiveUserStatus = new CustomActiveUserStatus();
        const customInactiveUserStatus = new CustomInactiveUserStatus();
        const customBlokedUserStatus = new CustomBlokedUserStatus();

        user.defaultUserStatuses.push(defaultActiveUserStatus);
        user.defaultUserStatuses.push(defaultInactiveUserStatus);
        user.defaultUserStatuses.push(defaultBlokedUserStatus);
        user.customUserStatuses.push(customActiveUserStatus);
        user.customUserStatuses.push(customInactiveUserStatus);
        user.customUserStatuses.push(customBlokedUserStatus);

        const result = TypeManager.serialize(User, user);

        expect(result).toBeInstanceOf(Object);
        expect(result.$type).toBe('User');
        expect(result.defaultUserStatuses[0].$type).toBe('DefaultActiveUserStatus');
        expect(result.defaultUserStatuses[1].$type).toBe('DefaultInactiveUserStatus');
        expect(result.defaultUserStatuses[2].$type).toBe('DefaultBlokedUserStatus');
        expect(result.customUserStatuses[0].__typename__).toBe('CustomActiveUS');
        expect(result.customUserStatuses[1].__typename__).toBe('CustomInactiveUS');
        expect(result.customUserStatuses[2].__typename__).toBe('CustomBlokedUS');
    });

    it('should be properly deserialized', () =>
    {
        TypeManager.configureTypeOptionsBase({ 
            preserveDiscriminator: true 
        });

        const user = { $type: 'User', defaultUserStatuses: [] as Record<string, any>[], customUserStatuses: [] as Record<string, any>[] };
        const defaultActiveUserStatus = { $type: 'DefaultActiveUserStatus' };
        const defaultInactiveUserStatus = { $type: 'DefaultInactiveUserStatus' };
        const defaultBlokedUserStatus = { $type: 'DefaultBlokedUserStatus' };
        const customActiveUserStatus = { __typename__: 'CustomActiveUS' };
        const customInactiveUserStatus = { __typename__: 'CustomInactiveUS' };
        const customBlokedUserStatus = { __typename__: 'CustomBlokedUS' };

        user.defaultUserStatuses.push(defaultActiveUserStatus);
        user.defaultUserStatuses.push(defaultInactiveUserStatus);
        user.defaultUserStatuses.push(defaultBlokedUserStatus);
        user.customUserStatuses.push(customActiveUserStatus);
        user.customUserStatuses.push(customInactiveUserStatus);
        user.customUserStatuses.push(customBlokedUserStatus);

        const result = TypeManager.deserialize(User, user);

        expect(result).toBeInstanceOf(User);
        expect(result.defaultUserStatuses[0]).toBeInstanceOf(DefaultActiveUserStatus);
        expect(result.defaultUserStatuses[1]).toBeInstanceOf(DefaultInactiveUserStatus);
        expect(result.defaultUserStatuses[2]).toBeInstanceOf(DefaultBlokedUserStatus);
        expect(result.customUserStatuses[0]).toBeInstanceOf(CustomActiveUserStatus);
        expect(result.customUserStatuses[1]).toBeInstanceOf(CustomInactiveUserStatus);
        expect(result.customUserStatuses[2]).toBeInstanceOf(CustomBlokedUserStatus);
    });
});
