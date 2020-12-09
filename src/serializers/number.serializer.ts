import { Fn, Log } from './../utils';
import { TypeSerializer } from './../type.serializer';

/**
 * Number serializer.
 * 
 * @type {NumberSerializer}
 */
export class NumberSerializer implements TypeSerializer<any, any>
{
    /**
     * Converts data from type to object.
     * 
     * @param {any} input Input data.
     * 
     * @returns {any} Output data.
     */
    public serialize(input: any): any
    {
        if (Fn.isNil(input))
        {
            return null;
        }

        if (Fn.isNumber(input))
        {
            return input;
        }

        if (Fn.isArray(input))
        {
            return input.map(i => this.serialize(i));
        }

        if (Log.warnEnabled) 
        {
            Log.warn('Serializing non number value as number!', input);
        }

        return new Number(input);
    }

    /**
     * Converts data from object to type.
     * 
     * @param {any} output Output data.
     * 
     * @returns {any} Input data.
     */
    public deserialize(output: any): any
    {
        if (Fn.isNil(output))
        {
            return null;
        }

        if (Fn.isNumber(output))
        {
            return output;
        }

        if (Fn.isArray(output))
        {
            return output.map(o => this.deserialize(o));
        }

        if (Log.warnEnabled) 
        {
            Log.warn('Deserializing non number value as number!', output);
        }

        return new Number(output);
    }
}
