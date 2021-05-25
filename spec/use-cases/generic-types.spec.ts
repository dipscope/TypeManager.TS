import { Alias, Property, Type, TypeManager } from '../../src';

@Type()
@Alias('Group:Generics')
class Group
{
    @Property(String) public title?: string;
    @Property(Array, [() => User]) public users?: User[];
}

@Type()
class Message
{
    @Property(String) public title?: string;
    @Property(Array, ['Group:Generics']) public groups?: Group[];
    @Property(Map, [Number, [Map, [String, Boolean]]]) public map?: Map<number, Map<string, boolean>>;
}

@Type()
class User
{
    @Property(() => String) public name?: string;
    @Property(() => Array, [Message]) public messages?: Message[];
}

describe('Generic types', () =>
{
    it('should be properly serialized', () =>
    {
        const userX = new User();
        const userY = new User();
        const messageX = new Message();
        const messageY = new Message();
        const groupX = new Group();
        const groupY = new Group();
        const map = new Map<number, Map<string, boolean>>();

        userX.name = 'userX';
        userY.name = 'userY';
        messageX.title = 'messageX',
        messageY.title = 'messageY';
        groupX.title = 'groupX';
        groupY.title = 'groupY';

        userX.messages = [];
        userY.messages = [];
        messageX.groups = [];
        messageY.groups = [];
        groupX.users = [];
        groupY.users = [];
        
        userX.messages.push(messageX);
        userX.messages.push(messageY);
        userY.messages.push(messageX);
        messageX.groups.push(groupX);
        messageY.groups.push(groupY);
        groupX.users.push(userX);
        groupX.users.push(userY);
        groupY.users.push(userX);
        groupY.users.push(userY);

        map.set(0, new Map<string, boolean>([['x', true], ['y', false]]));
        map.set(1, new Map<string, boolean>([['x', false], ['y', true]]));

        messageY.map = map;

        const result = TypeManager.serialize(User, userX);
        
        expect(result).toBeInstanceOf(Object);
        expect(result.name).toBe('userX');
        expect(result.messages).toBeInstanceOf(Array);
        expect(result.messages[0]).toBeInstanceOf(Object);
        expect(result.messages[0].title).toBe('messageX');
        expect(result.messages[0].groups).toBeInstanceOf(Array);
        expect(result.messages[0].groups[0]).toBeInstanceOf(Object);
        expect(result.messages[0].groups[0].title).toBe('groupX');
        expect(result.messages[0].groups[0].users).toBeInstanceOf(Array);
        expect(result.messages[0].groups[0].users[0]).toBeInstanceOf(Object);
        expect(result.messages[0].groups[0].users[0]).toBe(result);
        expect(result.messages[0].groups[0].users[1]).toBeInstanceOf(Object);
        expect(result.messages[0].groups[0].users[1].name).toBe('userY');
        expect(result.messages[1]).toBeInstanceOf(Object);
        expect(result.messages[1].title).toBe('messageY');
        expect(result.messages[1].groups).toBeInstanceOf(Array);
        expect(result.messages[1].groups[0]).toBeInstanceOf(Object);
        expect(result.messages[1].groups[0].title).toBe('groupY');
        expect(result.messages[1].groups[0].users).toBeInstanceOf(Array);
        expect(result.messages[1].groups[0].users[0]).toBeInstanceOf(Object);
        expect(result.messages[1].groups[0].users[0]).toBe(result);
        expect(result.messages[1].groups[0].users[1]).toBeInstanceOf(Object);
        expect(result.messages[1].groups[0].users[1].name).toBe('userY');
        expect(result.messages[1].map).toBeInstanceOf(Array);
        expect(result.messages[1].map[0]).toBeInstanceOf(Object);
        expect(result.messages[1].map[0].key).toBe(0);
        expect(result.messages[1].map[0].value).toBeInstanceOf(Array);
        expect(result.messages[1].map[0].value[0]).toBeInstanceOf(Object);
        expect(result.messages[1].map[0].value[0].key).toBe('x');
        expect(result.messages[1].map[0].value[0].value).toBeTrue();
        expect(result.messages[1].map[0].value[1]).toBeInstanceOf(Object);
        expect(result.messages[1].map[0].value[1].key).toBe('y');
        expect(result.messages[1].map[0].value[1].value).toBeFalse();
        expect(result.messages[1].map[1]).toBeInstanceOf(Object);
        expect(result.messages[1].map[1].key).toBe(1);
        expect(result.messages[1].map[1].value).toBeInstanceOf(Array);
        expect(result.messages[1].map[1].value[0]).toBeInstanceOf(Object);
        expect(result.messages[1].map[1].value[0].key).toBe('x');
        expect(result.messages[1].map[1].value[0].value).toBeFalse();
        expect(result.messages[1].map[1].value[1]).toBeInstanceOf(Object);
        expect(result.messages[1].map[1].value[1].key).toBe('y');
        expect(result.messages[1].map[1].value[1].value).toBeTrue();
    });

    it('should be properly deserialized', () =>
    {
        const userX = {} as Record<string, any>;
        const userY = {} as Record<string, any>;
        const messageX = {} as Record<string, any>;
        const messageY = {} as Record<string, any>;
        const groupX = {} as Record<string, any>;
        const groupY = {} as Record<string, any>;
        const map = [] as Record<string, any>[];

        userX.name = 'userX';
        userY.name = 'userY';
        messageX.title = 'messageX',
        messageY.title = 'messageY';
        groupX.title = 'groupX';
        groupY.title = 'groupY';

        userX.messages = [];
        userY.messages = [];
        messageX.groups = [];
        messageY.groups = [];
        groupX.users = [];
        groupY.users = [];
        
        userX.messages.push(messageX);
        userX.messages.push(messageY);
        userY.messages.push(messageX);
        messageX.groups.push(groupX);
        messageY.groups.push(groupY);
        groupX.users.push(userX);
        groupX.users.push(userY);
        groupY.users.push(userX);
        groupY.users.push(userY);

        map.push({ key: 0, value: [{ key: 'x', value: true }, { key: 'y', value: false }]});
        map.push({ key: 1, value: [{ key: 'x', value: false }, { key: 'y', value: true }]});

        messageY.map = map;

        const result = TypeManager.deserialize(User, userX);
        
        expect(result).toBeInstanceOf(User);
        expect(result.name).toBe('userX');
        expect(result.messages).toBeInstanceOf(Array);
        expect(result.messages![0]).toBeInstanceOf(Message);
        expect(result.messages![0].title).toBe('messageX');
        expect(result.messages![0].groups).toBeInstanceOf(Array);
        expect(result.messages![0].groups![0]).toBeInstanceOf(Group);
        expect(result.messages![0].groups![0].title).toBe('groupX');
        expect(result.messages![0].groups![0].users).toBeInstanceOf(Array);
        expect(result.messages![0].groups![0].users![0]).toBeInstanceOf(User);
        expect(result.messages![0].groups![0].users![0]).toBe(result);
        expect(result.messages![0].groups![0].users![1]).toBeInstanceOf(User);
        expect(result.messages![0].groups![0].users![1].name).toBe('userY');
        expect(result.messages![1]).toBeInstanceOf(Message);
        expect(result.messages![1].title).toBe('messageY');
        expect(result.messages![1].groups).toBeInstanceOf(Array);
        expect(result.messages![1].groups![0]).toBeInstanceOf(Group);
        expect(result.messages![1].groups![0].title).toBe('groupY');
        expect(result.messages![1].groups![0].users).toBeInstanceOf(Array);
        expect(result.messages![1].groups![0].users![0]).toBeInstanceOf(User);
        expect(result.messages![1].groups![0].users![0]).toBe(result);
        expect(result.messages![1].groups![0].users![1]).toBeInstanceOf(User);
        expect(result.messages![1].groups![0].users![1].name).toBe('userY');
        expect(result.messages![1].map).toBeInstanceOf(Map);
        expect(result.messages![1].map!.get(0)).toBeInstanceOf(Map);
        expect(result.messages![1].map!.get(0)!.get('x')).toBeTrue();
        expect(result.messages![1].map!.get(0)!.get('y')).toBeFalse();
        expect(result.messages![1].map!.get(1)).toBeInstanceOf(Map);
        expect(result.messages![1].map!.get(1)!.get('x')).toBeFalse();
        expect(result.messages![1].map!.get(1)!.get('y')).toBeTrue();
    });
});
