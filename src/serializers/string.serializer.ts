import { Fn, Log } from './../utils';
import { TypeSerializer } from './../type.serializer';
import { TypeMetadata } from './../type.metadata';
import { PropertyMetadata } from './../property.metadata';

/**
 * String serializer.
 * 
 * @type {StringSerializer}
 */
export class StringSerializer implements TypeSerializer
{
    /**
     * Serializes provided value.
     * 
     * @param {any} x Some value.
     * @param {TypeMetadata} typeMetadata Type metadata when it is known.
     * @param {PropertyMetadata} propertyMetadata Property metadata when serialization is performed on a property level.
     * 
     * @returns {any} Serialized value.
     */
    public serialize(x: any, typeMetadata?: TypeMetadata, propertyMetadata?: PropertyMetadata): any
    {
        if (Fn.isUndefined(x))
        {
            return propertyMetadata?.defaultValue ?? typeMetadata?.defaultValue;
        }

        if (Fn.isNull(x) || Fn.isString(x))
        {
            return x;
        }

        if (Fn.isArray(x))
        {
            return x.map(v => this.serialize(v, typeMetadata, propertyMetadata));
        }

        if (propertyMetadata?.useImplicitConversion ?? typeMetadata?.useImplicitConversion) 
        {
            return this.convert(x);
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
     * @param {TypeMetadata} typeMetadata Type metadata when it is known.
     * @param {PropertyMetadata} propertyMetadata Property metadata when serialization is performed on a property level.
     * 
     * @returns {any} Deserialized value.
     */
    public deserialize(x: any, typeMetadata?: TypeMetadata, propertyMetadata?: PropertyMetadata): any
    {
        if (Fn.isUndefined(x))
        {
            return propertyMetadata?.defaultValue ?? typeMetadata?.defaultValue;
        }

        if (Fn.isNull(x) || Fn.isString(x))
        {
            return x;
        }

        if (Fn.isArray(x))
        {
            return x.map(v => this.deserialize(v, typeMetadata, propertyMetadata));
        }

        if (propertyMetadata?.useImplicitConversion ?? typeMetadata?.useImplicitConversion) 
        {
            return this.convert(x);
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
    private convert(x: any): any
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

        if (Log.errorEnabled) 
        {
            Log.error('Cannot convert value to a string!', x);
        }
        
        return undefined;
    }
}
