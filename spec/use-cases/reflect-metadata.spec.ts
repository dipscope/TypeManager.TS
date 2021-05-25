import 'reflect-metadata';

import { Injectable, Property, Type, TypeManager } from '../../src';

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

@Injectable()
class UserService
{
    public property?: string;
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
    private _email?: string;
    
    @Property() public name?: string;
    @Property() public userPriorityNumeric?: UserPriorityNumeric;
    @Property() public userPriorityTextual?: UserPriorityTextual;
    @Property([UserStatus]) public userStatuses?: UserStatus[];

    public constructor(public userService: UserService)
    {
        return;
    }

    @Property() public get email(): string
    {
        return this._email!;
    }

    public set email(email: string)
    {
        this._email = email;

        return;
    }
}

describe('Reflect metadata', () =>
{
    it('should implicitly register property and constructor argument types', () =>
    {
        const userMetadata = TypeManager.extractTypeMetadata(User);
        
        expect(userMetadata.propertyMetadataMap.get('name')!.typeMetadata!.typeFn).toBe(String);
        expect(userMetadata.propertyMetadataMap.get('email')!.typeMetadata!.typeFn).toBe(String);
        expect(userMetadata.propertyMetadataMap.get('userPriorityNumeric')!.typeMetadata!.typeFn).toBe(Number);
        expect(userMetadata.propertyMetadataMap.get('userPriorityTextual')!.typeMetadata!.typeFn).toBe(String);
        expect(userMetadata.propertyMetadataMap.get('userStatuses')!.typeMetadata!.typeFn).toBe(Array);
        expect(userMetadata.propertyMetadataMap.get('userStatuses')!.genericArguments![0] as any).toBe(UserStatus);
        expect(userMetadata.injectMetadataMap.get(0)!.typeFn).toBe(UserService);

        const userJson = { 
            name: 'Dmitry',
            email: 'dmitry@mail.com',
            userPriorityNumeric: 2,
            userPriorityTextual: 'Medium',
            userStatuses: [{ name: 'Active', title: 'Active user status' }]
        };

        const user = TypeManager.deserialize(User, userJson);

        expect(user).toBeInstanceOf(User);
        expect(user.name).toBe('Dmitry');
        expect(user.email).toBe('dmitry@mail.com');
        expect(user.userPriorityNumeric).toBe(UserPriorityNumeric.High);
        expect(user.userPriorityTextual).toBe(UserPriorityTextual.Medium);
        expect(user.userStatuses).toBeInstanceOf(Array);
        expect(user.userStatuses![0]).toBeInstanceOf(UserStatus);
        expect(user.userStatuses![0].name).toBe('Active');
        expect(user.userStatuses![0].title).toBe('Active user status');
        expect(user.userService).toBeInstanceOf(UserService);
    });
});
