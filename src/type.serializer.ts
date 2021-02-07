import { TypeMetadata } from './type.metadata';
import { PropertyMetadata } from './property.metadata';

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
     * @param {TType|undefined} x Some value.
     * @param {TypeMetadata<TType>} typeMetadata Type metadata when it is known.
     * @param {PropertyMetadata<any, TType>} propertyMetadata Property metadata when serialization is performed on a property level.
     * 
     * @returns {any|undefined} Serialized value.
     */
    serialize(x: TType | undefined, typeMetadata?: TypeMetadata<TType>, propertyMetadata?: PropertyMetadata<any, TType>): any | undefined;

    /**
     * Deserializes provided value.
     * 
     * @param {any|undefined} x Some value.
     * @param {TypeMetadata<TType>} typeMetadata Type metadata when it is known.
     * @param {PropertyMetadata<any, TType>} propertyMetadata Property metadata when serialization is performed on a property level.
     * 
     * @returns {TType|undefined} Deserialized value.
     */
    deserialize(x: any | undefined, typeMetadata?: TypeMetadata<TType>, propertyMetadata?: PropertyMetadata<any, TType>): TType | undefined;
}
