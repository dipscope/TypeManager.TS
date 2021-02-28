import { Fn } from '../core/fn';
import { Serializer } from '../core/serializer';
import { SerializerContext } from '../core/serializer-context';
import { TypeLike } from '../core/type-like';

/**
 * Int 32 array serializer.
 * 
 * @type {Int32ArraySerializer}
 */
export class Int32ArraySerializer implements Serializer<Int32Array>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<Int32Array>} x Some value.
     * @param {SerializerContext<Int32Array>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<Int32Array>, serializerContext: SerializerContext<Int32Array>): TypeLike<any>
    {
        if (Fn.isUndefined(x))
        {
            return serializerContext.defaultValue;
        }

        if (Fn.isNull(x))
        {
            return x;
        }

        if (Fn.isInt32Array(x))
        {
            return Array.from(x);
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
            serializerContext.log.error(`${serializerContext.path}: Cannot serialize value as int 32 array!`, x);
        }

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<Int32Array>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<Int32Array>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<Int32Array>): TypeLike<Int32Array>
    {
        if (Fn.isUndefined(x))
        {
            return serializerContext.defaultValue;
        }

        if (Fn.isNull(x))
        {
            return x;
        }

        if (Fn.isArray(x) && x.every(v => Fn.isNumber(v) && !Number.isNaN(v)))
        {
            return Int32Array.from(x);
        }

        if (Fn.isArray(x) && x.every(v => Fn.isArray(v)))
        {
            return x.map(v => this.deserialize(v, serializerContext));
        }

        if (serializerContext.useImplicitConversion) 
        {
            return this.convert(x, serializerContext);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot deserialize value as int 32 array!`, x);
        }

        return undefined;
    }

    /**
     * Converts provided value to the target type value.
     * 
     * @param {any} x Some value.
     * @param {SerializerContext<Int32Array>} serializerContext Serializer context.
     * 
     * @returns {Int32Array|undefined} Converted value or undefined.
     */
    private convert(x: any, serializerContext: SerializerContext<Int32Array>): Int32Array | undefined
    {
        if (Fn.isInt8Array(x) || Fn.isInt16Array(x))
        {
            return Int32Array.from(x);
        }
        
        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot convert value to int 32 array!`, x);
        }

        return undefined;
    }
}
