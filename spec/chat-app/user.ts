import { Property, Type } from '../../src';
import { Chat } from './chat';
import { HasTitle } from './has-title';
import { Message } from './message';
import { Messageable } from './messageable';
import { Statusable } from './statusable';

@Type({
    alias: 'users',
    discriminant: 'User',
    parentTypeArguments: [() => Messageable, () => HasTitle]
})
export class User extends Statusable implements Messageable, HasTitle
{
    @Property(String) title: string;
    @Property(Array, ['messages']) messages!: Array<Message>;
    @Property(Array, ['chats']) chats!: Array<Chat>;

    public constructor(title: string)
    {
        super();

        this.title = title;

        return;
    }
}
