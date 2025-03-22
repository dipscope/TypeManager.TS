import { Property, Type } from '../../src';

@Type({ alias: 'statuses' })
export class Status
{
    @Property(String) status: string;

    public constructor(status: string)
    {
        this.status = status;

        return;
    }
}
