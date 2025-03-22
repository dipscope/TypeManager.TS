import { Property, Type } from '../../src';
import { Message } from './message';

@Type({ alias: 'messageables' })
export abstract class Messageable
{
    @Property(Array, ['messages']) messages!: Array<Message>;
}
