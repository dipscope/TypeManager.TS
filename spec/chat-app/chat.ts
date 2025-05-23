import { Property, Type } from '../../src';
import { HasTitle } from './has-title';
import { Messageable } from './messageable';

@Type({
    alias: 'chats',
    discriminant: 'Chat',
    parentTypeArguments: [() => HasTitle]
})
export class Chat extends Messageable implements HasTitle
{
    @Property(String) title: string;

    public constructor(title: string)
    {
        super();

        this.title = title;

        return;
    }
}
