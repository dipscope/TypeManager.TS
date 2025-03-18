import { Type, Property } from '../../../../src';
import { Messageable } from './messageable'

@Type({ alias: 'messages' })
export class Message
{
    @Property('messageables') public sender: Messageable;
    @Property('messageables') public reciever: Messageable;
    @Property(String) public content: string;

    public constructor(content: string, sender: Messageable, reciever: Messageable)
    {
        this.content = content;
        this.sender = sender;
        this.reciever = reciever;

        return;
    }
}
