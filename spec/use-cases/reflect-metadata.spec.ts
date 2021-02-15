import 'reflect-metadata';
import { Type, TypeManager, Property, Injectable } from './../../src';
import { Fn } from './../../src/core';

@Injectable()
class UserService
{
    public prop?: string;
}

@Type()
class UserStatus
{
    @Property() public name?: string;
    @Property() public title?: string;
}

@Type()
class User
{
    @Property() public name?: string;
    @Property() public userStatus?: UserStatus;

    public constructor(public userService: UserService)
    {
        return;
    }
}

describe('Reflect metadata', function () 
{
    it('should implicitly register property and constructor argument types', function ()
    {
        const userManager  = new TypeManager(User);
        const userMetadata = userManager.typeMetadata;
        
        expect(userMetadata.propertyMetadataMap.get('name')!.typeResolver()).toBe(String);
        expect(userMetadata.propertyMetadataMap.get('userStatus')!.typeResolver()).toBe(UserStatus);
        expect(userMetadata.injectMetadataMap.get(0)!.typeCtor).toBe(UserService);

        const userJson = { name: 'Dmitry', userStatus: { name: 'Active', title: 'Active user status' } };
        const user     = userManager.deserialize(userJson);

        expect(user).toBeInstanceOf(User);
        expect(user.name).toBe('Dmitry');
        expect(user.userStatus).toBeInstanceOf(UserStatus);
        expect(user.userStatus?.name).toBe('Active');
        expect(user.userStatus?.title).toBe('Active user status');
        expect(user.userService).toBeInstanceOf(UserService);
    });
});
