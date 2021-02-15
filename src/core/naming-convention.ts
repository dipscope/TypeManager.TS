/**
 * Represents naming convention.
 * 
 * @type {NamingConvention}
 */
export interface NamingConvention
{
    /**
     * Converts name from provided to target one.
     * 
     * @param {string} name Name.
     * 
     * @returns {string} Converted name.
     */
    convert(name: string): string;
}
