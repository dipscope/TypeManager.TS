import { Injectable, TypeManager } from '../src';

@Injectable()
class UserService
{
    public prop?: string;
}

@Injectable(false)
class EmailService
{
    public prop?: string;
}

describe('Injectable decorator', () =>
{
    it('should register a type as injectable', () =>
    {
        const userServiceMetadata  = TypeManager.extractTypeMetadata(UserService);
        const emailServiceMetadata = TypeManager.extractTypeMetadata(EmailService);

        expect(userServiceMetadata.typeOptions.injectable).toBeTrue();
        expect(emailServiceMetadata.typeOptions.injectable).toBeFalse();
    });
});
