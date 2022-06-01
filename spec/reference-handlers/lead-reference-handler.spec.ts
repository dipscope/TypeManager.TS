import { LeadReferenceHandler, Property, Type, TypeManager } from '../../src';

@Type({
    referenceHandler: new LeadReferenceHandler()
})
class User
{
    @Property(() => Company) public company?: Company;
}

@Type({
    referenceHandler: new LeadReferenceHandler()
})
class Company
{
    @Property(() => User) public user?: User;
    @Property(() => Message) public message?: Message;
}

@Type({
    referenceHandler: new LeadReferenceHandler()
})
class Message
{
    @Property(() => User) public user?: User;
}

describe('Lead reference handler', () =>
{
    it('should map circular types to undefined', () =>
    {
        const user = new User();
        const company = new Company();
        const message = new Message();

        user.company = company;
        company.message = message;
        message.user = user;

        const result = TypeManager.serialize(User, user);
        
        expect(result).toBeInstanceOf(Object);
        expect(result.company).toBeInstanceOf(Object);
        expect(result.company.message).toBeInstanceOf(Object);
        expect(result.company.message.user).toBeUndefined()
    });

    it('should map circular type array to undefined', () =>
    {
        const user = new User();
        const array = [] as any[];

        array[0] = user;
        array[1] = array;

        const result = TypeManager.serialize(User, array);

        expect(result[0]).toBeInstanceOf(Object);
        expect(result[1]).toBeUndefined();
    });
});
