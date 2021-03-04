import { Injectable, TypeArtisan } from '../src';

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
        const userServiceMetadata  = TypeArtisan.extractTypeMetadata(UserService);
        const emailServiceMetadata = TypeArtisan.extractTypeMetadata(EmailService);

        expect(userServiceMetadata.typeOptions.injectable).toBeTrue();
        expect(emailServiceMetadata.typeOptions.injectable).toBeFalse();
    });
});
