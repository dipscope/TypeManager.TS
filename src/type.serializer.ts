import { TypeLike } from './type.like';
import { TypeSerializerContext } from './type.serializer.context';

/**
 * Type serializer.
 * 
 * @type {TypeSerializer<TType>}
 */
export interface TypeSerializer<TType>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<TType>} x Some value.
     * @param {TypeSerializerContext<TType>} typeSerializerContext Type serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value.
     */
    serialize(x: TypeLike<TType>, typeSerializerContext: TypeSerializerContext<TType>): TypeLike<any>;

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {TypeSerializerContext<TType>} typeSerializerContext Type serializer context.
     * 
     * @returns {TypeLike<TType>} Deserialized value.
     */
    deserialize(x: TypeLike<any>, typeSerializerContext: TypeSerializerContext<TType>): TypeLike<TType>;
}
