import { PropertyMetadata } from '../property-metadata';
import { PropertySorter } from '../property-sorter';

/**
 * Represents desc property sorter which sorts type properties in
 * descending order by name.
 * 
 * @type {DescPropertySorter}
 */
export class DescPropertySorter implements PropertySorter
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
    public sort<TType>(x: PropertyMetadata<TType, any>, y: PropertyMetadata<TType, any>): number
    {
        const a = x.propertyName.toLowerCase();
        const b = y.propertyName.toLowerCase();

        if (a < b)
        {
            return 1;
        }

        if (a > b)
        {
            return -1;
        }

        return 0;
    }
}
