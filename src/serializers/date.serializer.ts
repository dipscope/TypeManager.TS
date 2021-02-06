import { Fn, Log } from './../utils';
import { TypeSerializer } from './../type.serializer';
import { TypeMetadata } from './../type.metadata';
import { PropertyMetadata } from './../property.metadata';

/**
 * Date serializer.
 * 
 * @type {DateSerializer}
 */
export class DateSerializer implements TypeSerializer
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

        if (Fn.isNull(x))
        {
            return x;
        }

        if (Fn.isDate(x))
        {
            return x.toISOString();
        }

        if (Fn.isArray(x))
        {
            return x.map(v => this.serialize(v, typeMetadata, propertyMetadata));
        }

        if (Log.errorEnabled) 
        {
            Log.error('Cannot serialize value as date!', x);
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

        if (Fn.isNull(x))
        {
            return x;
        }

        if (Fn.isString(x))
        {
            return new Date(x);
        }

        if (Fn.isArray(x))
        {
            return x.map(v => this.deserialize(v, typeMetadata, propertyMetadata));
        }

        if (Log.errorEnabled) 
        {
            Log.error('Cannot deserialize value as date!', x);
        }

        return undefined;
    }
}
