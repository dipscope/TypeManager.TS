import { InjectMetadata } from '../inject-metadata';
import { InjectSorter } from '../inject-sorter';

/**
 * Represents desc inject sorter which sorts type injects in
 * descending order by index.
 * 
 * @type {DescInjectSorter}
 */
export class DescInjectSorter implements InjectSorter
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
    public sort<TType>(x: InjectMetadata<TType, any>, y: InjectMetadata<TType, any>): number
    {
        const a = x.injectIndex;
        const b = y.injectIndex;

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
