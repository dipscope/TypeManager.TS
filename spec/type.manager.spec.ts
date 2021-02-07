import { Type, Property, TypeSerializer, TypeManager } from './../src';

class MessageBodySerializer implements TypeSerializer
{
    public serialize(x: string): string
    {
        return x.split('').shift()!;
    }

    public deserialize(x: string): string
    {
        return x + x;
    }
}

@Type()
class User
{
    @Property({ alias: 'username' }) public name?: string;
    @Property() public email?: string;
    @Property({ defaultValue: 'd', useDefaultValue: true }) public status?: string;
    @Property({ defaultValue: () => 'e', useDefaultValue: true }) public login?: string;
    @Property({ useImplicitConversion: true }) public description?: string;
    @Property({ serializable: true }) public about?: string;
    @Property({ deserializable: true }) public device?: string;
}

@Type()
class Message
{
    @Property(() => String, { typeSerializer: new MessageBodySerializer() }) public body?: string;
    @Property(() => String, { alias: 'label'}) public title?: string;
    @Property(() => User) public user?: User; 
}

@Type()
class Group
{
    @Property(() => String) public title?: string;
    @Property(() => User, { defaultValue: 'x', useDefaultValue: true }) public user?: User;
}

describe('Type manager', function ()
{
    it('should deserialize type when object is provided and vice versa', function () 
    {
        const messageManager = new TypeManager(Message, { useDefaultValue: false });
        const baseObject     = { body: 'a', label: 'b', user: { username: 'a', email: 'b', description: null, about: 'g', device: 'h' } };
        const baseObjects    = [baseObject, baseObject];
        const entity         = messageManager.deserialize(baseObject);
        const entities       = messageManager.deserialize(baseObjects);
        const nullEntity     = messageManager.deserialize(null);

        expect(entity).toBeInstanceOf(Message);
        expect(entity.body).toBe('aa');
        expect(entity.title).toBe('b');
        expect(entity.user).toBeInstanceOf(User);
        expect(entity.user.name).toBe('a');
        expect(entity.user.email).toBe('b');
        expect(entity.user.status).toBe('d');
        expect(entity.user.login).toBe('e');
        expect(entity.user.description).toBeNull();
        expect(entity.user.about).toBeUndefined(); 
        expect(entity.user.device).toBe('h');

        expect(entities).toBeInstanceOf(Array);
        expect(entities[0]).toEqual(entities[1]);

        entities.forEach((e: any) => 
        {
            expect(e).toBeInstanceOf(Message);
            expect(e.body).toBe('aa');
            expect(e.title).toBe('b');
            expect(e.user).toBeInstanceOf(User);
            expect(e.user.name).toBe('a');
            expect(e.user.email).toBe('b');
            expect(e.user.status).toBe('d');
            expect(e.user.login).toBe('e');
            expect(e.user.description).toBeNull();
            expect(e.user.about).toBeUndefined(); 
            expect(e.user.device).toBe('h');
        });

        expect(nullEntity).toBeNull();

        entity.user.about      = 'g';
        entities[0].user.about = 'g';
        entities[1].user.about = 'g';

        const object     = messageManager.serialize(entity);
        const objects    = messageManager.serialize(entities);
        const nullObject = messageManager.serialize(null);

        expect(object).toBeInstanceOf(Object);
        expect(object.body).toBe('a');
        expect(object.label).toBe('b');
        expect(object.user).toBeInstanceOf(Object);
        expect(object.user.username).toBe('a');
        expect(object.user.email).toBe('b');
        expect(object.user.status).toBe('d');
        expect(object.user.login).toBe('e');
        expect(object.user.description).toBeNull();
        expect(object.user.about).toBe('g');
        expect(object.user.device).toBeUndefined();

        expect(objects).toBeInstanceOf(Array);
        expect(objects[0]).toEqual(objects[1]);

        objects.forEach((o: any) => 
        {
            expect(o).toBeInstanceOf(Object);
            expect(o.body).toBe('a');
            expect(o.label).toBe('b');
            expect(o.user).toBeInstanceOf(Object);
            expect(o.user.username).toBe('a');
            expect(o.user.email).toBe('b');
            expect(o.user.status).toBe('d');
            expect(o.user.login).toBe('e');
            expect(o.user.description).toBeNull();
            expect(o.user.about).toBe('g');
            expect(o.user.device).toBeUndefined();
        });

        expect(nullObject).toBeNull();
    });

    it('should use base type default value when it is enabled', function ()
    {
        const groupManager = new TypeManager(Group);
        const baseObject   = { title: 'a' };
        const entity       = groupManager.deserialize(baseObject);

        expect(entity).toBeInstanceOf(Group);
        expect(entity.title).toBe('a');
        expect(entity.user).toBe('x');

        entity.user = undefined;

        const object = groupManager.serialize(entity);

        expect(object).toBeInstanceOf(Object);
        expect(object.title).toBe('a');
        expect(object.user).toBe('x');
    });
});
