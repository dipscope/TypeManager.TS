import { Fn, Log } from './../utils';
import { TypeSerializer } from './../type.serializer';

/**
 * String serializer.
 * 
 * @type {StringSerializer}
 */
export class StringSerializer implements TypeSerializer<any, any>
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

        if (Fn.isString(input))
        {
            return input;
        }

        if (Fn.isArray(input))
        {
            return input.map(i => this.serialize(i));
        }

        if (Log.warnEnabled) 
        {
            Log.warn('Serializing non string value as string!', input);
        }

        return new String(input);
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

        if (Fn.isString(output))
        {
            return output;
        }

        if (Fn.isArray(output))
        {
            return output.map(o => this.deserialize(o));
        }

        if (Log.warnEnabled) 
        {
            Log.warn('Deserializing non string value as string!', output);
        }

        return new String(output);
    }
}
