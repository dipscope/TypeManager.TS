import { SerializerContext } from './serializer-context';
import { TypeLike } from './type-like';

/**
 * Serializer.
 * 
 * @type {Serializer<TType>}
 */
export interface Serializer<TType>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<TType>} x Some value.
     * @param {SerializerContext<TType>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value.
     */
    serialize(x: TypeLike<TType>, serializerContext: SerializerContext<TType>): TypeLike<any>;

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<TType>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<TType>} Deserialized value.
     */
    deserialize(x: TypeLike<any>, serializerContext: SerializerContext<TType>): TypeLike<TType>;
}
