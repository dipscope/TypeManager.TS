import { Property, Type, TypeManager } from '../../src';

@Type()
class Message
{
    @Property(() => Messageable) public sender: Messageable
    @Property(() => Messageable) public reciever: Messageable
    @Property(String) public content: string

    public constructor (content: string, sender: Messageable, reciever: Messageable) 
    {
        this.content = content;
        this.sender = sender;
        this.reciever = reciever;

        return;
    }
}

@Type()
class Status
{
    @Property(String) status: string;

    public constructor (status: string) 
    {
        this.status = status;

        return;
    }
    
}

abstract class Messageable
{
    @Property(Array, [Message]) messages!: Message[];
}

@Type()
abstract class HasTitle
{
    @Property(String) title!: string;
}

@Type()
abstract class Statusable
{
    @Property(Array, [Status]) statuses!: Status[];
}

@Type({
    discriminant: 'Chat',
    parentTypeFns: [HasTitle]
})
class Chat extends Messageable implements HasTitle
{
    @Property(String) title: string;

    public constructor (title: string) 
    {
        super();

        this.title = title;

        return;
    }
}

@Type({
    discriminant: 'User',
    parentTypeFns: [Messageable, HasTitle]
})
class User extends Statusable implements Messageable, HasTitle
{
    @Property(String) title: string;
    @Property(Array, [Message]) messages!: Message[];

    constructor (title: string) 
    {
        super();

        this.title = title;

        return;
    }
}

describe('Polymorphic types', () =>
{
    afterEach(() =>
    {
        TypeManager.applyTypeOptionsBase({ 
            preserveDiscriminator: false 
        });
    });

    it('should be properly serialized', () =>
    {
        const user = new User('user-a');
        const chat = new Chat('chat-b');
        const messageCount = 5;
        const statusCount = 3;

        TypeManager.applyTypeOptionsBase({ 
            preserveDiscriminator: true 
        });

        const messages = [...Array(messageCount)].map((_,i) => new Message(
            i.toString(),
            i % 2 ? user : chat,
            i % 2 ? chat : user
        ));

        const statuses = [...Array(statusCount)].map((_, i) => new Status(i.toString()));

        user.messages = messages.filter(m => m.sender === user);
        chat.messages = messages.filter(m => m.sender === chat);
        user.statuses = statuses;

        const results = messages.map(message => TypeManager.serialize(Message, message));

        expect(results.length).toBe(messageCount);

        results.forEach((result, i) => 
        {
            expect(result).toBeInstanceOf(Object);
            expect(result.$type).toBe('Message');
            expect(result.sender.$type).toBe(i % 2 ? 'User' : 'Chat');
            expect(result.reciever.$type).toBe(i % 2 ? 'Chat' : 'User');
            expect(result.sender.title).toBe(i % 2 ? 'user-a' : 'chat-b');

            const testUser = i % 2 ? result.sender : result.reciever;

            expect(testUser.statuses.length).toBe(statusCount);

            testUser.statuses.forEach((status: any, i: number) => 
            {
                expect(status.status).toBe(i.toString());
            })
        });
    });

    it('should be properly deserialized', () =>
    {
        TypeManager.applyTypeOptionsBase({ 
            preserveDiscriminator: true 
        });

        const messageCount = 5;
        const statusCount = 3;

        const statuses = [...Array(statusCount)].map((_, i) => 
        {
            return { $type: 'Status', status: i.toString() }
        });

        const user = { $type: 'User', title: 'user-b', messages: [] as Record<string, any>[], statuses };
        const chat = { $type: 'Chat', title: 'chat-b', messages: [] as Record<string, any>[] };

        const messages = [...Array(messageCount)].map((_, i) => 
        {
            return {
                $type: 'Message',
                content: i.toString(),
                sender: i % 2 ? user : chat,
                reciever: i % 2 ? chat : user
            };
        });

        user.messages = messages.filter(m => m.sender === user);
        chat.messages = messages.filter(m => m.sender === chat);

        const results = messages.map(message => TypeManager.deserialize(Message, message));

        expect(results.length).toBe(messageCount);
        
        results.forEach((result, i) => 
        {
            expect(result).toBeInstanceOf(Message);
            expect(result.sender).toBeInstanceOf(i % 2 ? User : Chat);
            expect(result.reciever).toBeInstanceOf(i % 2 ? Chat : User);

            const testUser = (i % 2 ? result.sender : result.reciever) as User;

            expect(testUser).toBeInstanceOf(User);
            expect(testUser.title).toBe('user-b');
            expect(testUser.statuses.length).toBe(statusCount);

            testUser.statuses.forEach((status, i) => 
            {
                expect(status.status).toBe(i.toString())
            });
        });
    });
});
