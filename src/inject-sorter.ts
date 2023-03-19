import { InjectMetadata } from './inject-metadata';

/**
 * Represents inject sorter. Used to sort injects during serialization
 * and deserialization.
 * 
 * @type {InjectSorter}
 */
export interface InjectSorter
{
    /**
     * Sort type injects. It is expected to return a negative value if the value of first property 
     * is less than the value of second property, zero if they are equal, and a positive value otherwise.
     * 
     * @param {InjectMetadata<TType, any>} x First inject.
     * @param {InjectMetadata<TType, any>} y Second inject.
     * 
     * @returns {number} Sort result.
     */
    sort<TType>(x: InjectMetadata<TType, any>, y: InjectMetadata<TType, any>): number;
}
