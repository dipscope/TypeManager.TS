import { Fn, Log } from './../utils';
import { TypeSerializer } from './../type.serializer';

/**
 * Boolean serializer.
 * 
 * @type {BooleanSerializer}
 */
export class BooleanSerializer implements TypeSerializer
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

        if (Fn.isBoolean(x))
        {
            return x;
        }

        if (Fn.isArray(x))
        {
            return x.map(v => this.serialize(v));
        }

        if (Log.warnEnabled) 
        {
            Log.warn('Serializing non boolean value as boolean!', x);
        }

        return new Boolean(x);
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

        if (Fn.isBoolean(x))
        {
            return x;
        }

        if (Fn.isArray(x))
        {
            return x.map(v => this.deserialize(v));
        }

        if (Log.warnEnabled) 
        {
            Log.warn('Deserializing non boolean value as boolean!', x);
        }

        return new Boolean(x);
    }
}
