import { Serializer } from './../serializer';

export class BooleanSerializer implements Serializer<boolean | boolean[] | null, any | any[] | null>
{
    /**
     * Converts boolean value to any value.
     * 
     * @param {boolean|boolean[]|null} input Input value.
     * 
     * @returns {any|any[]|null} Ouput value.
     */
    public serialize(input: boolean | boolean[] | null): any | any[] | null
    {
        const defined = input !== null && input !== undefined;

        if (defined) 
        {
            return input;
        }

        return null;
    }

    public deserialize(output: any | any[] | null): boolean | boolean[] | null
    {
        const defined = output !== null && output !== undefined;

        if (defined) 
        {
            return Array.isArray(output) ? output.map(o => new Boolean(o)) : new Boolean(output);
        }

        return null;
    }
}
