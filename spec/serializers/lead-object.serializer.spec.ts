import { LeadObjectSerializer } from './../../src/serializers';
import { TypeManager, Type, Property, Serializer } from './../../src';

@Type()
@Serializer(new LeadObjectSerializer())
class User
{
    @Property(() => Company) public company?: Company;
}

@Type()
@Serializer(new LeadObjectSerializer())
class Company
{
    @Property(() => User) public user?: User;
    @Property(() => Message) public message?: Message;
}

@Type()
@Serializer(new LeadObjectSerializer())
class Message
{
    @Property(() => User) public user?: User;
}

describe('Lead object serializer', function () 
{
    it('should serialize undefined to undefined', function ()
    {
        const typeManager = new TypeManager(User);
        const value       = undefined;
        const result      = typeManager.serialize(value);
        
        expect(result).toBeUndefined();
    });

    it('should deserialize undefined to undefined', function ()
    {
        const typeManager = new TypeManager(User);
        const value       = undefined;
        const result      = typeManager.deserialize(value);
        
        expect(result).toBeUndefined();
    });

    it('should serialize null to null', function ()
    {
        const typeManager = new TypeManager(User);
        const value       = null;
        const result      = typeManager.serialize(value);
        
        expect(result).toBeNull();
    });

    it('should deserialize null to null', function ()
    {
        const typeManager = new TypeManager(User);
        const value       = null;
        const result      = typeManager.deserialize(value);
        
        expect(result).toBeNull();
    });

    it('should serialize circular types to undefined', function ()
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

    it('should serialize circular type array to undefined', function ()
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
