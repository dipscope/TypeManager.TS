import { Property, Type, TypeManager, TypeSerializer } from '../../src';

@Type({
    serializer: new TypeSerializer(),
    beforeSerializeCallback: 'beforeSerialize',
    afterDeserializeCallback: 'afterDeserialize'
})
class User
{
    @Property(() => Company) public company?: Company;
    @Property(String) public beforeSerialized?: string;
    @Property(String) public afterDeserialized?: string;

    public beforeSerialize(): void
    {
        this.beforeSerialized = 'I am inited!';

        return;
    }

    public afterDeserialize(): void
    {
        this.afterDeserialized = 'I am inited!';

        return;
    }
}

@Type({
    serializer: new TypeSerializer(),
    beforeSerializeCallback: (company: Company) => 
    {
        company.beforeSerialized = 'I am inited!'
    },
    afterDeserializeCallback: (company: Company) => 
    {
        company.afterDeserialized = 'I am inited!'
    }
})
class Company
{
    @Property(() => User) public user?: User;
    @Property(() => Message) public message?: Message;
    @Property(String) public beforeSerialized?: string;
    @Property(String) public afterDeserialized?: string;
}

@Type({
    serializer: new TypeSerializer()
})
class Message
{
    @Property(() => User) public user?: User;
}

describe('Type serializer', () =>
{
    afterEach(() =>
    {
        TypeManager.applyTypeOptionsBase({
            useDefaultValue: false,
            useImplicitConversion: false
        });
    });

    it('should serialize undefined to undefined', () =>
    {
        const value = undefined;
        const result = TypeManager.serialize(User, value);
        
        expect(result).toBeUndefined();
    });

    it('should deserialize undefined to undefined', () =>
    {
        const value = undefined;
        const result = TypeManager.deserialize(User, value);
        
        expect(result).toBeUndefined();
    });

    it('should serialize null to null', () =>
    {
        const value = null;
        const result = TypeManager.serialize(User, value);
        
        expect(result).toBeNull();
    });

    it('should deserialize null to null', () =>
    {
        const value = null;
        const result = TypeManager.deserialize(User, value);
        
        expect(result).toBeNull();
    });

    it('should serialize circular types to circular objects', () =>
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
        expect(result.company.message.user).toBe(result);
    });

    it('should deserialize circular objects to circular types', () =>
    {
        const value = { company: { message: { user: {} } } };

        value.company.message.user = value;

        const result = TypeManager.deserialize(User, value);
        
        expect(result).toBeInstanceOf(User);
        expect(result?.company).toBeInstanceOf(Company);
        expect(result?.company?.message).toBeInstanceOf(Message);
        expect(result?.company?.message?.user).toBeInstanceOf(User);
        expect(result?.company?.message?.user).toBe(result);
    });

    it('should serialize circular type array to circular object array', () =>
    {
        const user = new User();
        const array = [] as any[];

        array[0] = user;
        array[1] = array;
        
        const result = TypeManager.serialize(User, array);

        expect(result[0]).toBeInstanceOf(Object);
        expect(result[1]).toBeInstanceOf(Object);
        expect(result[1]).toBe(result);
    });

    it('should deserialize circular object array to circular type array', () =>
    {
        const value = [{}];

        value[1] = value;

        const result = TypeManager.deserialize(User, value) as Record<string, any>[];
        
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBeInstanceOf(User);
        expect(result[1]).toBeInstanceOf(Array);
        expect(result[1]).toBe(result);
    });

    it('should invoke before serialize callback', () =>
    {
        const user = new User();
        const userResult = TypeManager.serialize(User, user);
        
        expect(userResult).toBeInstanceOf(Object);
        expect(user.beforeSerialized).toBe('I am inited!');

        const company = new Company();
        const companyResult = TypeManager.serialize(Company, company);
        
        expect(companyResult).toBeInstanceOf(Object);
        expect(company.beforeSerialized).toBe('I am inited!');
    });

    it('should invoke after deserialize callback', () =>
    {
        const user = { company: {} };
        const userResult = TypeManager.deserialize(User, user);
        
        expect(userResult).toBeInstanceOf(User);
        expect(userResult?.company).toBeInstanceOf(Company);
        expect(userResult.afterDeserialized).toBe('I am inited!');

        const company = { user: {} };
        const companyResult = TypeManager.deserialize(Company, company);
        
        expect(companyResult).toBeInstanceOf(Company);
        expect(companyResult?.user).toBeInstanceOf(User);
        expect(companyResult.afterDeserialized).toBe('I am inited!');
    });
});
