import { Property, ReferenceHandler, Type, TypeManager } from '../../src';
import { PathReferenceHandler } from '../../src/reference-handlers';

@Type()
@ReferenceHandler(new PathReferenceHandler())
class User
{
    @Property(() => Company) public company?: Company;
    @Property(Array, [() => Company]) public companies?: Company[];
}

@Type()
@ReferenceHandler(new PathReferenceHandler())
class Company
{
    @Property(() => User) public user?: User;
    @Property(() => Message) public message?: Message;
}

@Type()
@ReferenceHandler(new PathReferenceHandler())
class Message
{
    @Property(() => User) public user?: User;
    @Property(() => Company) public company?: Company;
}

describe('Path reference handler', () =>
{
    it('should map circular types to reference objects', () =>
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
        expect(result.company.message.user).toBeInstanceOf(Object);
        expect(result.company.message.user.$ref).toBe('$');
    });

    it('should map reference objects to circular types', () =>
    {
        const value = { company: { message: { user: { $ref: '$' } } } };
        const result = TypeManager.deserialize(User, value);
        
        expect(result).toBeInstanceOf(User);
        expect(result?.company).toBeInstanceOf(Company);
        expect(result?.company?.message).toBeInstanceOf(Message);
        expect(result?.company?.message?.user).toBeInstanceOf(User);
        expect(result?.company?.message?.user).toBe(result);
    });

    it('should preserve object references', () =>
    {
        const value = { company: { message: { company: { $ref: '$[\'company\']' } } } };
        const result = TypeManager.deserialize(User, value);
        
        expect(result).toBeInstanceOf(User);
        expect(result?.company).toBeInstanceOf(Company);
        expect(result?.company?.message).toBeInstanceOf(Message);
        expect(result?.company?.message?.company).toBeInstanceOf(Company);
        expect(result?.company?.message?.company).toBe(result.company);
    });

    it('should preserve array references', () =>
    {
        const value = { companies: [{ message: { company: { $ref: '$.companies[0]' } } }] };
        const result = TypeManager.deserialize(User, value);
        
        expect(result).toBeInstanceOf(User);
        expect(result?.companies).toBeInstanceOf(Array);
        expect(result?.companies![0]).toBeInstanceOf(Company);
        expect(result?.companies![0].message).toBeInstanceOf(Message);
        expect(result?.companies![0].message?.company).toBeInstanceOf(Company);
        expect(result?.companies![0].message?.company).toBe(result?.companies![0]);
    });
});
