import { Fn } from './utils';

/**
 * Type context class to encapsulate type values before populating an object.
 * 
 * @type {TypeContext}
 */
export class TypeContext extends Map<string, any>
{
    /**
     * Populates provided object.
     * 
     * @param {any} object Object to populate.
     * 
     * @returns {any} Populated object.
     */
    public populate(object: any): any
    {
        for (const [key, value] of this.entries()) 
        {
            if (Fn.isUndefined(object[key]))
            {
                object[key] = value;
            }
        }

        return object;
    }
}
