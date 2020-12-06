import { Serializer } from "./serializer";

export interface TypeOptions
{
    serializer?: Serializer<any, any>;

    alias?: string;

    defaultValue?: any;
}
