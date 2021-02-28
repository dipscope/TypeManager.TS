import { Fn } from './../core/fn';
import { TypeLike } from './../core/type-like';
import { Serializer } from './../core/serializer';
import { SerializerContext } from './../core/serializer-context';

/**
 * Float 64 array serializer.
 * 
 * @type {Float64ArraySerializer}
 */
export class Float64ArraySerializer implements Serializer<Float64Array>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<Float64Array>} x Some value.
     * @param {SerializerContext<Float64Array>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<Float64Array>, serializerContext: SerializerContext<Float64Array>): TypeLike<any>
    {
        if (Fn.isUndefined(x))
        {
            return serializerContext.defaultValue;
        }

        if (Fn.isNull(x))
        {
            return x;
        }

        if (Fn.isFloat64Array(x))
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
            serializerContext.log.error(`${serializerContext.path}: Cannot serialize value as float 64 array!`, x);
        }

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<Float64Array>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<Float64Array>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<Float64Array>): TypeLike<Float64Array>
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
            return Float64Array.from(x);
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
            serializerContext.log.error(`${serializerContext.path}: Cannot deserialize value to a float 64 array!`, x);
        }

        return undefined;
    }

    /**
     * Converts provided value to the target type value.
     * 
     * @param {any} x Some value.
     * @param {SerializerContext<Float64Array>} serializerContext Serializer context.
     * 
     * @returns {Float64Array|undefined} Converted value or undefined.
     */
    private convert(x: any, serializerContext: SerializerContext<Float64Array>): Float64Array | undefined
    {
        if (Fn.isInt8Array(x) || Fn.isInt16Array(x) || Fn.isInt32Array(x) || Fn.isFloat32Array(x))
        {
            return Float64Array.from(x);
        }
        
        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot convert value to float 64 array!`, x);
        }

        return undefined;
    }
}
