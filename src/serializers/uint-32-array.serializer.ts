import { Fn } from './../core/fn';
import { TypeLike } from './../core/type-like';
import { Serializer } from './../core/serializer';
import { SerializerContext } from './../core/serializer-context';

/**
 * Uint 32 array serializer.
 * 
 * @type {Uint32ArraySerializer}
 */
export class Uint32ArraySerializer implements Serializer<Uint32Array>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<Uint32Array>} x Some value.
     * @param {SerializerContext<Uint32Array>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<Uint32Array>, serializerContext: SerializerContext<Uint32Array>): TypeLike<any>
    {
        if (Fn.isUndefined(x))
        {
            return serializerContext.defaultValue;
        }

        if (Fn.isNull(x))
        {
            return x;
        }

        if (Fn.isUint32Array(x))
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
            serializerContext.log.error(`${serializerContext.path}: Cannot serialize value as uint 32 array!`, x);
        }

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<Uint32Array>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<Uint32Array>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<Uint32Array>): TypeLike<Uint32Array>
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
            return Uint32Array.from(x);
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
            serializerContext.log.error(`${serializerContext.path}: Cannot deserialize value as uint 32 array!`, x);
        }

        return undefined;
    }

    /**
     * Converts provided value to the target type value.
     * 
     * @param {any} x Some value.
     * @param {SerializerContext<Uint32Array>} serializerContext Serializer context.
     * 
     * @returns {Uint32Array|undefined} Converted value or undefined.
     */
    private convert(x: any, serializerContext: SerializerContext<Uint32Array>): Uint32Array | undefined
    {
        if (Fn.isUint8Array(x) || Fn.isUint16Array(x))
        {
            return Uint32Array.from(x);
        }
        
        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot convert value to uint 32 array!`, x);
        }

        return undefined;
    }
}
