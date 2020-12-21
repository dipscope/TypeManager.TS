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

        if (Log.warnEnabled) 
        {
            Log.warn('Serializing non string value as string!', x);
        }

        return new String(x);
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

        if (Log.warnEnabled) 
        {
            Log.warn('Deserializing non string value as string!', x);
        }

        return new String(x);
    }

    /**
     * TODO: Implement implicit conversion.
     * 
     * Converts provided value to the target type value.
     * 
     * @param {any} x Some value.
     * 
     * @returns {any} Converted value or original value.
     */
    public convert(x: any): any
    {
        return x;
    }
}
