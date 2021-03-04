import { Property, ReferenceHandler, Type, TypeManager } from '../../src';
import { DirectReferenceHandler } from '../../src/reference-handlers';

@Type()
@ReferenceHandler(new DirectReferenceHandler())
class User
{
    @Property(() => Company) public company?: Company;
}

@Type()
@ReferenceHandler(new DirectReferenceHandler())
class Company
{
    @Property(() => User) public user?: User;
    @Property(() => Message) public message?: Message;
}

@Type()
@ReferenceHandler(new DirectReferenceHandler())
class Message
{
    @Property(() => User) public user?: User;
}

describe('Direct reference handler', () =>
{
    it('should map circular types to circular objects', () =>
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
        expect(result.company.message.user).toBeInstanceOf(Object);
        expect(result.company.message.user).toBe(result);
    });

    it('should map circular objects to circular types', () =>
    {
        const typeManager = new TypeManager(User);
        const value       = { company: { message: { user: {} } } };

        value.company.message.user = value;

        const result = typeManager.deserialize(value);
        
        expect(result).toBeInstanceOf(User);
        expect(result?.company).toBeInstanceOf(Company);
        expect(result?.company?.message).toBeInstanceOf(Message);
        expect(result?.company?.message?.user).toBeInstanceOf(User);
        expect(result?.company?.message?.user).toBe(result);
    });

    it('should map circular type array to circular object array', () =>
    {
        const typeManager = new TypeManager(User);

        const user  = new User();
        const array = [] as any[];

        array[0] = user;
        array[1] = array;
        
        const result = typeManager.serialize(array);

        expect(result[0]).toBeInstanceOf(Object);
        expect(result[1]).toBeInstanceOf(Object);
        expect(result[1]).toBe(result);
    });

    it('should map circular object array to circular type array', () =>
    {
        const typeManager = new TypeManager(User);
        const value       = [{}];

        value[1] = value;

        const result = typeManager.deserialize(value) as any[];
        
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBeInstanceOf(User);
        expect(result[1]).toBeInstanceOf(Array);
        expect(result[1]).toBe(result);
    });
});
