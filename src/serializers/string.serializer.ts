import { Fn, Log } from './../utils';
import { TypeSerializer } from './../type.serializer';

/**
 * String serializer.
 * 
 * @type {StringSerializer}
 */
export class StringSerializer extends TypeSerializer
{
    /**
     * Serializes provided value.
     * 
     * @param {any} x Some value.
     * 
     * @returns {any} Serialized value.
     */
    public serialize(x: any): any
    {
        if (Fn.isNil(x))
        {
            return null;
        }

        if (Fn.isString(x))
        {
            return x;
        }

        if (Fn.isArray(x))
        {
            return x.map(v => this.serialize(v));
        }

        if (Log.errorEnabled) 
        {
            Log.error('Cannot serialize value as string!', x);
        }

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {any} x Some value.
     * 
     * @returns {any} Deserialized value.
     */
    public deserialize(x: any): any
    {
        if (Fn.isNil(x))
        {
            return null;
        }

        if (Fn.isString(x))
        {
            return x;
        }

        if (Fn.isArray(x))
        {
            return x.map(v => this.deserialize(v));
        }

        if (Log.errorEnabled) 
        {
            Log.error('Cannot deserialize value as string!', x);
        }

        return undefined;
    }

    /**
     * Converts provided value to the target type value.
     * 
     * @param {any} x Some value.
     * 
     * @returns {any} Converted value or original value.
     */
    public convert(x: any): any
    {
        if (Fn.isNumber(x) || Fn.isBoolean(x)) 
        {
            return String(x);
        }

        if (Fn.isDate(x))
        {
            return x.toISOString();
        }

        if (Fn.isObject(x))
        {
            return JSON.stringify(x);
        }

        if (Fn.isArray(x))
        {
            return x.map(v => this.convert(v));
        }
        
        return x;
    }
}
