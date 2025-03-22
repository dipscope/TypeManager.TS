import { Property, Type } from '../../src';
import { Status } from './status';

@Type({ alias: 'statusables' })
export abstract class Statusable
{
    @Property(Array, ['statuses']) statuses!: Array<Status>;
}
