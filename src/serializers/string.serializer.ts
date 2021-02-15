import { Fn } from './../core/fn';
import { TypeLike } from './../core/type-like';
import { Serializer } from './../core/serializer';
import { SerializerContext } from './../core/serializer-context';

/**
 * String serializer.
 * 
 * @type {StringSerializer}
 */
export class StringSerializer implements Serializer<string>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<string>} x Some value.
     * @param {SerializerContext<string>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<string>, serializerContext: SerializerContext<string>): TypeLike<any>
    {
        if (Fn.isUndefined(x))
        {
            return serializerContext.defaultValue;
        }

        if (Fn.isNull(x) || Fn.isString(x))
        {
            return x;
        }

        if (Fn.isArray(x))
        {
            return x.map(v => this.serialize(v, serializerContext));
        }

        if (serializerContext.useImplicitConversion) 
        {
            return this.convert(x, serializerContext);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot serialize value as string!`, x);
        }

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<string>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<string>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<string>): TypeLike<string>
    {
        if (Fn.isUndefined(x))
        {
            return serializerContext.defaultValue;
        }

        if (Fn.isNull(x) || Fn.isString(x))
        {
            return x;
        }

        if (Fn.isArray(x))
        {
            return x.map(v => this.deserialize(v, serializerContext));
        }

        if (serializerContext.useImplicitConversion) 
        {
            return this.convert(x, serializerContext);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot deserialize value as string!`, x);
        }

        return undefined;
    }

    /**
     * Converts provided value to the target type value.
     * 
     * @param {any} x Some value.
     * @param {SerializerContext<string>} serializerContext Type serializer context.
     * 
     * @returns {string|undefined} Converted value or original value.
     */
    private convert(x: any, serializerContext: SerializerContext<string>): string | undefined
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

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot convert value to a string!`, x);
        }
        
        return undefined;
    }
}
