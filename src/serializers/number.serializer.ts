import { Fn, Log } from './../utils';
import { TypeLike } from './../type.like';
import { TypeSerializer } from './../type.serializer';
import { TypeSerializerContext } from './../type.serializer.context';

/**
 * Number serializer.
 * 
 * @type {NumberSerializer}
 */
export class NumberSerializer implements TypeSerializer<number>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<number>} x Some value.
     * @param {TypeSerializerContext<number>} typeSerializerContext Type serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<number>, typeSerializerContext: TypeSerializerContext<number>): TypeLike<any>
    {
        if (Fn.isUndefined(x))
        {
            return typeSerializerContext.defaultValue;
        }

        if (Fn.isNull(x) || Fn.isNumber(x))
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
            Log.error(`${typeSerializerContext.path}: Cannot serialize value as number!`, x);
        }

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {TypeSerializerContext<number>} typeSerializerContext Type serializer context.
     * 
     * @returns {TypeLike<number>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, typeSerializerContext: TypeSerializerContext<number>): TypeLike<number>
    {
        if (Fn.isUndefined(x))
        {
            return typeSerializerContext.defaultValue;
        }

        if (Fn.isNull(x) || Fn.isNumber(x))
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
            Log.error(`${typeSerializerContext.path}: Cannot deserialize value as number!`, x);
        }

        return undefined;
    }

    /**
     * Converts provided value to the target type value.
     * 
     * @param {any} x Some value.
     * @param {TypeSerializerContext<number>} typeSerializerContext Type serializer context.
     * 
     * @returns {number|undefined} Converted value or undefined.
     */
    private convert(x: any, typeSerializerContext: TypeSerializerContext<number>): number | undefined
    {
        if (Fn.isString(x) || Fn.isBoolean(x))
        {
            return Number(x);
        }
        
        if (Log.errorEnabled) 
        {
            Log.error(`${typeSerializerContext.path}: Cannot convert value to a number!`, x);
        }

        return undefined;
    }
}
