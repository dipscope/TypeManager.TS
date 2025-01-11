/**
 * Reflect class declaration.
 * 
 * @type {Reflect}
 */
declare class Reflect 
{
    /**
     * Gets metadata value of a metadata key on the prototype chain of an object or property.
     * 
     * @param {string} metadataKey Unique metadata key.
     * @param {any} target Target to extract from. 
     * @param {string|symbol} propertyKey Key in a target.
     * 
     * @returns {any} Metadata for a key or undefined if metadata is not present.
     */
    public static getMetadata(metadataKey: string, target: any, propertyKey: string | symbol): any;
}

/**
 * Gets reflect metadata.
 * 
 * @param {string} metadataKey Unique metadata key.
 * @param {any} target Target to extract from. 
 * @param {string|symbol} propertyKey Key in a target.
 * 
 * @returns {any} Metadata for a key or undefined if metadata is not present.
 */
export function getReflectMetadata(metadataKey: string, target: any, propertyKey: string | symbol): any
{
    if (typeof Reflect === 'object' && Reflect !== null && typeof Reflect.getMetadata === 'function')
    {
        return Reflect.getMetadata(metadataKey, target, propertyKey);
    }
    
    return undefined;
}
