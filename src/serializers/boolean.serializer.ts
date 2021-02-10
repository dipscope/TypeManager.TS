import { Fn, Log } from './../utils';
import { TypeLike } from './../type.like';
import { TypeSerializer } from './../type.serializer';
import { TypeSerializerContext } from './../type.serializer.context';

/**
 * Boolean serializer.
 * 
 * @type {BooleanSerializer}
 */
export class BooleanSerializer implements TypeSerializer<boolean>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<boolean>} x Some value.
     * @param {TypeSerializerContext<boolean>} typeSerializerContext Type serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<boolean>, typeSerializerContext: TypeSerializerContext<boolean>): TypeLike<any>
    {
        if (Fn.isUndefined(x))
        {
            return typeSerializerContext.defaultValue;
        }

        if (Fn.isNull(x) || Fn.isBoolean(x))
        {
            return x;
        }

        if (Fn.isArray(x))
        {
            return x.map((v: any) => this.serialize(v, typeSerializerContext));
        }

        if (typeSerializerContext.useImplicitConversion) 
        {
            return this.convert(x, typeSerializerContext);
        }

        if (Log.errorEnabled) 
        {
            Log.error(`${typeSerializerContext.path}: Cannot serialize value as boolean!`, x);
        }

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {TypeSerializerContext<boolean>} typeSerializerContext Type serializer context.
     * 
     * @returns {TypeLike<boolean>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, typeSerializerContext: TypeSerializerContext<boolean>): TypeLike<boolean>
    {
        if (Fn.isUndefined(x))
        {
            return typeSerializerContext.defaultValue;
        }

        if (Fn.isNull(x) || Fn.isBoolean(x))
        {
            return x;
        }
        
        if (Fn.isArray(x))
        {
            return x.map((v: any) => this.deserialize(v, typeSerializerContext));
        }

        if (typeSerializerContext.useImplicitConversion) 
        {
            return this.convert(x, typeSerializerContext);
        }

        if (Log.errorEnabled) 
        {
            Log.error(`${typeSerializerContext.path}: Cannot deserialize value as boolean!`, x);
        }

        return undefined;
    }

    /**
     * Converts provided value to the target type value.
     * 
     * @param {any} x Some value.
     * @param {TypeSerializerContext<boolean>} typeSerializerContext Type serializer context.
     * 
     * @returns {boolean|undefined} Converted value or undefined.
     */
    private convert(x: any, typeSerializerContext: TypeSerializerContext<boolean>): boolean | undefined
    {
        if (Fn.isString(x) || Fn.isNumber(x)) 
        {
            return Boolean(x);
        }

        if (Log.errorEnabled) 
        {
            Log.error(`${typeSerializerContext.path}: Cannot convert value to a boolean!`, x);
        }

        return undefined;
    }
}
