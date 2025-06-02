import { Property, Serializer, Type, TypeManager } from '../src';

class MessageBodySerializer implements Serializer<string>
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
    @Property(() => String, { alias: 'username' }) public name?: string;
    @Property(() => String) public email?: string;
    @Property(() => String, { deserializedDefaultValue: 'd', useDefaultValue: true }) public status?: string;
    @Property(() => String, { defaultValue: () => 'e', useDefaultValue: true }) public login?: string;
    @Property(() => String, { useImplicitConversion: true }) public description?: string;
    @Property(() => String, { serializable: true }) public about?: string;
    @Property(() => String, { deserializable: true }) public device?: string;
}

@Type()
class Message
{
    @Property(() => String, { serializer: new MessageBodySerializer() }) public body?: string;
    @Property(() => String, { alias: 'label'}) public title?: string;
    @Property(() => User) public user?: User; 
    @Property(() => Array, [() => Group]) public groups?: Group[];
}

@Type()
class Group
{
    @Property(() => String) public title?: string;
    @Property(() => User, { deserializedDefaultValue: () => new User(), useDefaultValue: true }) public user?: User;
}

describe('Type manager', () =>
{
    afterEach(() =>
    {
        TypeManager.applyTypeOptionsBase({
            preserveDiscriminator: false,
            useDefaultValue: false,
            useImplicitConversion: false,
            discriminator: '$type'
        });
    });

    it('should deserialize type when object is provided and vice versa', () =>
    {
        const messageManager = TypeManager.clone();
        const baseObject = { body: 'a', label: 'b', user: { username: 'a', email: 'b', description: null, about: 'g', device: 'h' }, groups: [{ title: 'a' }, { title: 'a' }] };
        const baseObjects = [baseObject, baseObject];
        const entity = messageManager.deserialize(Message, baseObject);
        const entities = messageManager.deserialize(Message, baseObjects);
        const nullEntity = messageManager.deserialize(Message, null);

        expect(entity).toBeInstanceOf(Message);
        expect(entity.body).toBe('aa');
        expect(entity.title).toBe('b');
        expect(entity.user).toBeInstanceOf(User);
        expect(entity.user?.name).toBe('a');
        expect(entity.user?.email).toBe('b');
        expect(entity.user?.status).toBe('d');
        expect(entity.user?.login).toBe('e');
        expect(entity.user?.description).toBeNull();
        expect(entity.user?.about).toBeUndefined(); 
        expect(entity.user?.device).toBe('h');
        expect(entity.groups).toBeInstanceOf(Array);
        expect(entity.groups?.length).toBeGreaterThan(0);

        entity.groups?.forEach(e => 
        {
            expect(e).toBeInstanceOf(Group);
            expect(e.title).toBe('a');
        });

        expect(entities).toBeInstanceOf(Array);
        expect(entities[0]).toEqual(entities[1]);

        entities.forEach(e => 
        {
            expect(e).toBeInstanceOf(Message);
            expect(e.body).toBe('aa');
            expect(e.title).toBe('b');
            expect(e.user).toBeInstanceOf(User);
            expect(e.user?.name).toBe('a');
            expect(e.user?.email).toBe('b');
            expect(e.user?.status).toBe('d');
            expect(e.user?.login).toBe('e');
            expect(e.user?.description).toBeNull();
            expect(e.user?.about).toBeUndefined(); 
            expect(e.user?.device).toBe('h');
        });

        expect(nullEntity).toBeNull();

        entity.user!.about = 'g';
        entities[0]!.user!.about = 'g';
        entities[1]!.user!.about = 'g';

        const object = messageManager.serialize(Message, entity);
        const objects = messageManager.serialize(Message, entities);
        const nullObject = messageManager.serialize(Message, null);

        expect(object).toBeInstanceOf(Object);
        expect(object.body).toBe('a');
        expect(object.label).toBe('b');
        expect(object.user).toBeInstanceOf(Object);
        expect(object.user?.username).toBe('a');
        expect(object.user?.email).toBe('b');
        expect(object.user?.status).toBe('d');
        expect(object.user?.login).toBe('e');
        expect(object.user?.description).toBeNull();
        expect(object.user?.about).toBe('g');
        expect(object.user?.device).toBeUndefined();
        expect(object.groups).toBeInstanceOf(Array);
        expect(object.groups?.length).toBeGreaterThan(0);

        entity.groups?.forEach(e => 
        {
            expect(e).toBeInstanceOf(Object);
            expect(e.title).toBe('a');
        });

        expect(objects).toBeInstanceOf(Array);
        expect(objects[0]).toEqual(objects[1]);

        objects.forEach(o => 
        {
            expect(o).toBeInstanceOf(Object);
            expect(o.body).toBe('a');
            expect(o.label).toBe('b');
            expect(o.user).toBeInstanceOf(Object);
            expect(o.user?.username).toBe('a');
            expect(o.user?.email).toBe('b');
            expect(o.user?.status).toBe('d');
            expect(o.user?.login).toBe('e');
            expect(o.user?.description).toBeNull();
            expect(o.user?.about).toBe('g');
            expect(o.user?.device).toBeUndefined();
        });

        expect(nullObject).toBeNull();
    });

    it('should use base type default value when it is enabled', () =>
    {
        const groupManager = TypeManager.clone();
        const baseObject = { title: 'a' };
        const entity = groupManager.deserialize(Group, baseObject);

        expect(entity).toBeInstanceOf(Group);
        expect(entity.title).toBe('a');
        expect(entity.user).toBeInstanceOf(User);

        entity.user = undefined;

        const object = groupManager.serialize(Group, entity);

        expect(object).toBeInstanceOf(Object);
        expect(object.title).toBe('a');
        expect(object.user).toBeUndefined();
    });

    it('should produce the same result for serialization functions', () =>
    {
        const groupManager = TypeManager.clone();
        const baseObject = { title: 'a' };
        const entityA = groupManager.deserialize(Group, baseObject);
        const entityB = groupManager.parse(Group, groupManager.stringify(Group, baseObject)) as Group;
        const entityC = TypeManager.deserialize(Group, baseObject);
        const entityD = TypeManager.parse(Group, TypeManager.stringify(Group, baseObject)) as Group;

        expect(entityA).toBeInstanceOf(Group);
        expect(entityA.title).toBe('a');
        expect(entityA.user).toBeInstanceOf(User);

        expect(entityB).toBeInstanceOf(Group);
        expect(entityB.title).toBe('a');
        expect(entityB.user).toBeInstanceOf(User);

        expect(entityC).toBeInstanceOf(Group);
        expect(entityC.title).toBe('a');
        expect(entityC.user).toBeInstanceOf(User);

        expect(entityD).toBeInstanceOf(Group);
        expect(entityD.title).toBe('a');
        expect(entityD.user).toBeInstanceOf(User);

        const objectA = groupManager.serialize(Group, entityA);
        const objectB = groupManager.stringify(Group, entityB);
        const objectC = TypeManager.serialize(Group, entityC);
        const objectD = TypeManager.stringify(Group, entityD);

        expect(objectA).toBeInstanceOf(Object);
        expect(objectA.title).toBe('a');
        expect(objectA.user).toBeInstanceOf(Object);

        expect(objectB).toBeInstanceOf(String);
        expect(objectB).toBe(objectD);

        expect(objectC).toBeInstanceOf(Object);
        expect(objectC.title).toBe('a');
        expect(objectC.user).toBeInstanceOf(Object);

        expect(objectD).toBeInstanceOf(String);
        expect(objectD).toBe(objectB);
    });

    it('should preserve provided configuration', () =>
    {
        const groupManager = TypeManager.clone();

        groupManager.applyTypeOptionsBase({
            preserveDiscriminator: true,
            useImplicitConversion: true,
            discriminator: '__typename__'
        });

        groupManager.applyTypeOptions(Group, {
            deserializedDefaultValue: () => new Group()
        });

        TypeManager.applyTypeOptionsBase({
            preserveDiscriminator: true,
            discriminator: '__typestatic__'
        });

        const group = new Group();

        group.title = 'a';

        const objectA = groupManager.serialize(Group, group);
        const objectB = TypeManager.serialize(Group, group);

        expect(objectA).toBeInstanceOf(Object);
        expect(objectA.__typename__).toBeDefined();
        expect(objectA.title).toBe('a');

        expect(objectB).toBeInstanceOf(Object);
        expect(objectB.__typestatic__).toBeDefined();
        expect(objectB.title).toBe('a');
    });

    it('should not override static configuration', () =>
    {
        const groupManager = TypeManager.clone();
        const groupMetadata = TypeManager.extractTypeMetadata(Group);
        const instanceGroupMetadata = groupManager.extractTypeMetadata(Group);

        groupManager.applyTypeOptionsBase({
            useDefaultValue: true,
            preserveDiscriminator: true,
            useImplicitConversion: true,
            discriminator: '__typename__'
        });

        groupManager.applyTypeOptions(Group, {
            deserializedDefaultValue: () => new Group()
        });

        expect(groupManager.typeOptionsBase.preserveDiscriminator).toBeTrue();
        expect(groupManager.typeOptionsBase.useImplicitConversion).toBeTrue();
        expect(groupManager.typeOptionsBase.discriminator).toBe('__typename__');
        expect(instanceGroupMetadata.deserializedDefaultValue).toBeDefined();

        expect(TypeManager.typeOptionsBase.preserveDiscriminator).toBeFalse();
        expect(TypeManager.typeOptionsBase.useImplicitConversion).toBeFalse();
        expect(TypeManager.typeOptionsBase.discriminator).toBe('$type');
        expect(groupMetadata.deserializedDefaultValue).toBeUndefined();
    });

    it('should clear prototype registrations', () =>
    {
        const groupManager = TypeManager.clone();
        const groupMetadata = TypeManager.extractTypeMetadata(Group);

        expect(groupMetadata.typeFn.prototype[TypeManager.symbol]).toBeDefined();
        expect(groupMetadata.typeFn.prototype[groupManager.symbol]).toBeDefined();
        expect(TypeManager.typeOptionsMap.size).toBeGreaterThan(0);
        expect(groupManager.typeOptionsMap.size).toBeGreaterThan(0);
        expect(groupManager.typeOptionsMap.size).toBe(TypeManager.typeOptionsMap.size);

        groupManager.clear();

        expect(groupMetadata.typeFn.prototype[TypeManager.symbol]).toBeDefined();
        expect(groupMetadata.typeFn.prototype[groupManager.symbol]).toBeUndefined();
        expect(TypeManager.typeOptionsMap.size).toBeGreaterThan(0);
        expect(groupManager.typeOptionsMap.size).toBeGreaterThan(0);
        expect(groupManager.typeOptionsMap.size).toBe(TypeManager.typeOptionsMap.size);
    });
});
