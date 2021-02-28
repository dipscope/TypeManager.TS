import { Fn } from './../core/fn';
import { TypeLike } from './../core/type-like';
import { Serializer } from './../core/serializer';
import { SerializerContext } from './../core/serializer-context';

/**
 * Uint 16 array serializer.
 * 
 * @type {Uint16ArraySerializer}
 */
export class Uint16ArraySerializer implements Serializer<Uint16Array>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<Uint16Array>} x Some value.
     * @param {SerializerContext<Uint16Array>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<Uint16Array>, serializerContext: SerializerContext<Uint16Array>): TypeLike<any>
    {
        if (Fn.isUndefined(x))
        {
            return serializerContext.defaultValue;
        }

        if (Fn.isNull(x))
        {
            return x;
        }

        if (Fn.isUint16Array(x))
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
            serializerContext.log.error(`${serializerContext.path}: Cannot serialize value as uint 16 array!`, x);
        }

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<Uint16Array>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<Uint16Array>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<Uint16Array>): TypeLike<Uint16Array>
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
            return Uint16Array.from(x);
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
            serializerContext.log.error(`${serializerContext.path}: Cannot deserialize value as uint 16 array!`, x);
        }

        return undefined;
    }

    /**
     * Converts provided value to the target type value.
     * 
     * @param {any} x Some value.
     * @param {SerializerContext<Uint16Array>} serializerContext Serializer context.
     * 
     * @returns {Uint16Array|undefined} Converted value or undefined.
     */
    private convert(x: any, serializerContext: SerializerContext<Uint16Array>): Uint16Array | undefined
    {
        if (Fn.isUint8Array(x))
        {
            return Uint16Array.from(x);
        }
        
        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot convert value to uint 16 array!`, x);
        }

        return undefined;
    }
}
