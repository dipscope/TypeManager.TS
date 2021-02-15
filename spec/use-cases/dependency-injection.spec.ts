import { Type, Inject, TypeManager, Injectable } from './../../src';

@Injectable()
class UserService
{
    public prop?: string;
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

describe('Dependency injection', function () 
{
    it('should init services and provide them to the types', function ()
    {
        const userManager = new TypeManager(User);
        const user        = userManager.deserialize({});
        
        expect(user).toBeInstanceOf(User);
        expect(user.userService).toBeInstanceOf(UserService);
    });
});
