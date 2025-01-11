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
     * @param {PropertyMetadata<TObject, any>} x First property.
     * @param {PropertyMetadata<TObject, any>} y Second property.
     * 
     * @returns {number} Sort result.
     */
    sort<TObject>(x: PropertyMetadata<TObject, any>, y: PropertyMetadata<TObject, any>): number;
}
