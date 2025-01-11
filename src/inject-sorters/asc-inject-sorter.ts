import { InjectMetadata } from '../inject-metadata';
import { InjectSorter } from '../inject-sorter';

/**
 * Represents asc inject sorter which sorts type injects in
 * ascending order by index.
 * 
 * @type {AscInjectSorter}
 */
export class AscInjectSorter implements InjectSorter
{
    /**
     * Sort type injects. It is expected to return a negative value if the value of first property 
     * is less than the value of second property, zero if they are equal, and a positive value otherwise.
     * 
     * @param {InjectMetadata<TObject, any>} x First inject.
     * @param {InjectMetadata<TObject, any>} y Second inject.
     * 
     * @returns {number} Sort result.
     */
    public sort<TObject>(x: InjectMetadata<TObject, any>, y: InjectMetadata<TObject, any>): number
    {
        return x.injectIndex - y.injectIndex;
    }
}
