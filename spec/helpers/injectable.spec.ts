import { TypeArtisan } from './../../src';
import { Injectable } from './../../src/helpers';

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

describe('Injectable decorator', function () 
{
    it('should register a type as injectable', function ()
    {
        const userServiceMetadata  = TypeArtisan.extractTypeMetadata(UserService);
        const emailServiceMetadata = TypeArtisan.extractTypeMetadata(EmailService);

        expect(userServiceMetadata.typeOptions.injectable).toBeTrue();
        expect(emailServiceMetadata.typeOptions.injectable).toBeFalse();
    });
});
