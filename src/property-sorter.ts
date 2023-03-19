import { PropertyMetadata } from './property-metadata';

/**
 * Represents property sorter. Used to sort properties during serialization
 * and deserialization.
 * 
 * @type {PropertySorter}
 */
export interface PropertySorter
{
    /**
     * Sort type properties. It is expected to return a negative value if the value of first property 
     * is less than the value of second property, zero if they are equal, and a positive value otherwise.
     * 
     * @param {PropertyMetadata<TType, any>} x First property.
     * @param {PropertyMetadata<TType, any>} y Second property.
     * 
     * @returns {number} Sort result.
     */
    sort<TType>(x: PropertyMetadata<TType, any>, y: PropertyMetadata<TType, any>): number;
}
