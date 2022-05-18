import { Fn } from '../core/fn';
import { Serializer } from '../core/serializer';
import { SerializerContext } from '../core/serializer-context';
import { TypeLike } from '../core/type-like';

/**
 * Boolean serializer.
 * 
 * @type {BooleanSerializer}
 */
export class BooleanSerializer implements Serializer<boolean>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<boolean>} x Some value.
     * @param {SerializerContext<boolean>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<boolean>, serializerContext: SerializerContext<boolean>): TypeLike<any>
    {
        if (Fn.isUndefined(x))
        {
            return serializerContext.serializedDefaultValue;
        }

        if (Fn.isNull(x) || Fn.isBoolean(x))
        {
            return x;
        }

        if (serializerContext.useImplicitConversion) 
        {
            return this.convert(x, serializerContext);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot serialize value as boolean!`, x);
        }

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<boolean>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<boolean>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<boolean>): TypeLike<boolean>
    {
        if (Fn.isUndefined(x))
        {
            return serializerContext.deserializedDefaultValue;
        }

        if (Fn.isNull(x) || Fn.isBoolean(x))
        {
            return x;
        }

        if (serializerContext.useImplicitConversion) 
        {
            return this.convert(x, serializerContext);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot deserialize value as boolean!`, x);
        }

        return undefined;
    }

    /**
     * Converts provided value to the target type value.
     * 
     * @param {any} x Some value.
     * @param {SerializerContext<boolean>} serializerContext Type serializer context.
     * 
     * @returns {boolean|undefined} Converted value or undefined.
     */
    private convert(x: any, serializerContext: SerializerContext<boolean>): boolean | undefined
    {
        if (Fn.isString(x) && (x === 'true' || x === 'false'))
        {
            return x === 'true';
        }

        if (Fn.isString(x) && (x === '1' || x === '0'))
        {
            return x === '1';
        }

        if (Fn.isNumber(x) && (x === 1 || x === 0))
        {
            return x === 1;
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot convert value to boolean!`, x);
        }

        return undefined;
    }
}
