import { Inject, Injectable, Type, TypeManager } from '../../src';

@Injectable()
class UserService
{
    public property?: string;
}

@Type()
class User
{
    public readonly userService: UserService;

    public constructor(@Inject(UserService) userService: UserService)
    {
        this.userService = userService;

        return;
    }
}

describe('Dependency injection', () =>
{
    it('should init services and provide them to types', () =>
    {
        const user = TypeManager.deserialize(User, {});
        
        expect(user).toBeInstanceOf(User);
        expect(user.userService).toBeInstanceOf(UserService);
    });
});
