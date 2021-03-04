import { Property, ReferenceHandler, Type, TypeManager } from '../../src';
import { LeadReferenceHandler } from '../../src/reference-handlers';

@Type()
@ReferenceHandler(new LeadReferenceHandler())
class User
{
    @Property(() => Company) public company?: Company;
}

@Type()
@ReferenceHandler(new LeadReferenceHandler())
class Company
{
    @Property(() => User) public user?: User;
    @Property(() => Message) public message?: Message;
}

@Type()
@ReferenceHandler(new LeadReferenceHandler())
class Message
{
    @Property(() => User) public user?: User;
}

describe('Lead reference handler', () =>
{
    it('should map circular types to undefined', () =>
    {
        const typeManager = new TypeManager(User);
        const user        = new User();
        const company     = new Company();
        const message     = new Message();

        user.company    = company;
        company.message = message;
        message.user    = user;

        const result = typeManager.serialize(user);
        
        expect(result).toBeInstanceOf(Object);
        expect(result.company).toBeInstanceOf(Object);
        expect(result.company.message).toBeInstanceOf(Object);
        expect(result.company.message.user).toBeUndefined()
    });

    it('should map circular type array to undefined', () =>
    {
        const typeManager = new TypeManager(User);

        const user  = new User();
        const array = [] as any[];

        array[0] = user;
        array[1] = array;
        
        const result = typeManager.serialize(array);

        expect(result[0]).toBeInstanceOf(Object);
        expect(result[1]).toBeUndefined();
    });
});
