import { Serializer } from './../serializer';

export class DirectSerializer implements Serializer<any, any>
{
    public serialize(input: any): any
    {
        return input;
    }

    public deserialize(output: any): any
    {
        return output;
    }
}
