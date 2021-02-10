import { Fn, Log } from './../utils';
import { TypeLike } from './../type.like';
import { TypeSerializer } from './../type.serializer';
import { TypeSerializerContext } from './../type.serializer.context';

/**
 * Date serializer.
 * 
 * @type {DateSerializer}
 */
export class DateSerializer implements TypeSerializer<Date>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<Date>} x Some value.
     * @param {TypeSerializerContext<Date>} typeSerializerContext Type serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<Date>, typeSerializerContext: TypeSerializerContext<Date>): TypeLike<any>
    {
        if (Fn.isUndefined(x))
        {
            return typeSerializerContext.defaultValue;
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
            return x.map(v => this.serialize(v, typeSerializerContext));
        }

        if (Log.errorEnabled) 
        {
            Log.error(`${typeSerializerContext.path}: Cannot serialize value as date!`, x);
        }

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {TypeSerializerContext<Date>} typeSerializerContext Type serializer context.
     * 
     * @returns {TypeLike<Date>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, typeSerializerContext: TypeSerializerContext<Date>): TypeLike<Date>
    {
        if (Fn.isUndefined(x))
        {
            return typeSerializerContext.defaultValue;
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
            return x.map(v => this.deserialize(v, typeSerializerContext));
        }

        if (Log.errorEnabled) 
        {
            Log.error(`${typeSerializerContext.path}: Cannot deserialize value as date!`, x);
        }

        return undefined;
    }
}
