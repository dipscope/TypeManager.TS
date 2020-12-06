import { Serializer } from "./serializer";

export class NumberSerializer implements Serializer<string | null, string | null>
{
    public serialize(input: string | null | undefined): string | null 
    {
        return '';
    }

    public deserialize(output: string | null): string | null 
    {
        return '';
    }
}
