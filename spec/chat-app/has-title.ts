import { Property, Type } from '../../src';

@Type({ alias: 'has-titles'})
export abstract class HasTitle
{
    @Property(String) title!: string;
}
