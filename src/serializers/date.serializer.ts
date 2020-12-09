import { Fn, Log } from './../utils';
import { TypeSerializer } from './../type.serializer';

/**
 * Date serializer.
 * 
 * @type {DateSerializer}
 */
export class DateSerializer implements TypeSerializer<any, any>
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

        if (Fn.isDate(input))
        {
            return input.toISOString();
        }

        if (Fn.isArray(input))
        {
            return input.map(i => this.serialize(i));
        }

        if (Log.warnEnabled) 
        {
            Log.warn('Serializing non date value as date!', input);
        }

        return null;
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
            return new Date(output);
        }

        if (Fn.isArray(output))
        {
            return output.map(o => this.deserialize(o));
        }

        if (Log.warnEnabled) 
        {
            Log.warn('Deserializing non string value as date!', output);
        }

        return null;
    }
}
