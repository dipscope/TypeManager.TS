import { SerializerContext } from './serializer-context';
import { TypeLike } from './type-like';

/**
 * Serializer.
 * 
 * @type {Serializer<TObject>}
 */
export interface Serializer<TObject>
{
    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<TObject>} x Some value.
     * @param {SerializerContext<TObject>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<any>} Serialized value.
     */
    serialize(x: TypeLike<TObject>, serializerContext: Readonly<SerializerContext<TObject>>): TypeLike<any>;

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<TObject>} serializerContext Serializer context.
     * 
     * @returns {TypeLike<TObject>} Deserialized value.
     */
    deserialize(x: TypeLike<any>, serializerContext: SerializerContext<TObject>): TypeLike<TObject>;
}
