import { Fn } from './../core/fn';
import { TypeLike } from './../core/type-like';
import { Serializer } from './../core/serializer';
import { SerializerContext } from './../core/serializer-context';

/**
 * Number serializer.
 * 
 * @type {NumberSerializer}
 */
export class NumberSerializer implements Serializer<number>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<number>} x Some value.
     * @param {SerializerContext<number>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<number>, serializerContext: SerializerContext<number>): TypeLike<any>
    {
        if (Fn.isUndefined(x))
        {
            return serializerContext.defaultValue;
        }

        if (Fn.isNull(x) || Fn.isNumber(x))
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
            serializerContext.log.error(`${serializerContext.path}: Cannot serialize value as number!`, x);
        }

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<number>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<number>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<number>): TypeLike<number>
    {
        if (Fn.isUndefined(x))
        {
            return serializerContext.defaultValue;
        }

        if (Fn.isNull(x) || Fn.isNumber(x))
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
            serializerContext.log.error(`${serializerContext.path}: Cannot deserialize value as number!`, x);
        }

        return undefined;
    }

    /**
     * Converts provided value to the target type value.
     * 
     * @param {any} x Some value.
     * @param {SerializerContext<number>} serializerContext Serializer context.
     * 
     * @returns {number|undefined} Converted value or undefined.
     */
    private convert(x: any, serializerContext: SerializerContext<number>): number | undefined
    {
        if (Fn.isString(x) || Fn.isBoolean(x))
        {
            return Number(x);
        }
        
        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot convert value to a number!`, x);
        }

        return undefined;
    }
}
