import { Type, Property } from '../../../../src';


@Type({ alias: 'has-titles'})
export abstract class HasTitle
{
    @Property(String) title!: string;
}
