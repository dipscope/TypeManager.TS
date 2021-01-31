import { TypeMetadata } from './type.metadata';
import { PropertyMetadata } from './property.metadata';

/**
 * Type serializer.
 * 
 * @type {TypeSerializer}
 */
export interface TypeSerializer
{
    /**
     * Serializes provided value.
     * 
     * @param {any} x Some value.
     * @param {TypeMetadata} typeMetadata Type metadata.
     * @param {PropertyMetadata} propertyMetadata Property metadata.
     * 
     * @returns {any} Serialized value.
     */
    serialize(x: any, typeMetadata: TypeMetadata, propertyMetadata?: PropertyMetadata): any;

    /**
     * Deserializes provided value.
     * 
     * @param {any} x Some value.
     * @param {TypeMetadata} typeMetadata Type metadata.
     * @param {PropertyMetadata} propertyMetadata Property metadata.
     * 
     * @returns {any} Deserialized value.
     */
    deserialize(x: any, typeMetadata: TypeMetadata, propertyMetadata?: PropertyMetadata): any;
}
