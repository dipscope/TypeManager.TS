import { Fn, Log } from './../utils';
import { TypeLike } from './../type.like';
import { TypeSerializer } from './../type.serializer';
import { TypeSerializerContext } from './../type.serializer.context';

/**
 * String serializer.
 * 
 * @type {StringSerializer}
 */
export class StringSerializer implements TypeSerializer<string>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<string>} x Some value.
     * @param {TypeSerializerContext<string>} typeSerializerContext Type serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<string>, typeSerializerContext: TypeSerializerContext<string>): TypeLike<any>
    {
        if (Fn.isUndefined(x))
        {
            return typeSerializerContext.defaultValue;
        }

        if (Fn.isNull(x) || Fn.isString(x))
        {
            return x;
        }

        if (Fn.isArray(x))
        {
            return x.map(v => this.serialize(v, typeSerializerContext));
        }

        if (typeSerializerContext.useImplicitConversion) 
        {
            return this.convert(x, typeSerializerContext);
        }

        if (Log.errorEnabled) 
        {
            Log.error(`${typeSerializerContext.path}: Cannot serialize value as string!`, x);
        }

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {TypeSerializerContext<string>} typeSerializerContext Type serializer context.
     * 
     * @returns {TypeLike<string>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, typeSerializerContext: TypeSerializerContext<string>): TypeLike<string>
    {
        if (Fn.isUndefined(x))
        {
            return typeSerializerContext.defaultValue;
        }

        if (Fn.isNull(x) || Fn.isString(x))
        {
            return x;
        }

        if (Fn.isArray(x))
        {
            return x.map(v => this.deserialize(v, typeSerializerContext));
        }

        if (typeSerializerContext.useImplicitConversion) 
        {
            return this.convert(x, typeSerializerContext);
        }

        if (Log.errorEnabled) 
        {
            Log.error(`${typeSerializerContext.path}: Cannot deserialize value as string!`, x);
        }

        return undefined;
    }

    /**
     * Converts provided value to the target type value.
     * 
     * @param {any} x Some value.
     * @param {TypeSerializerContext<string>} typeSerializerContext Type serializer context.
     * 
     * @returns {string|undefined} Converted value or original value.
     */
    private convert(x: any, typeSerializerContext: TypeSerializerContext<string>): string | undefined
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
            Log.error(`${typeSerializerContext.path}: Cannot convert value to a string!`, x);
        }
        
        return undefined;
    }
}
