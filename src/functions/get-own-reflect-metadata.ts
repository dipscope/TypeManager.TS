import isFunction from 'lodash-es/isFunction';
import isObject from 'lodash-es/isObject';

/**
 * Reflect class declaration.
 * 
 * @type {Reflect}
 */
declare class Reflect
{
    /**
     * Gets metadata value of an own metadata key of an object or property.
     * 
     * @param {string} metadataKey Unique metadata key.
     * @param {any} target Target to extract from. 
     * 
     * @returns {any} Metadata for a key or undefined if metadata is not present.
     */
    public static getOwnMetadata(metadataKey: string, target: any): any;
}

/**
 * Gets own reflect metadata.
 * 
 * @param {string} metadataKey Unique metadata key.
 * @param {any} target Target to extract from. 
 * 
 * @returns {any} Metadata for a key or undefined if metadata is not present.
 */
export function getOwnReflectMetadata(metadataKey: string, target: any): any
{
    if (isObject(Reflect) && isFunction(Reflect.getOwnMetadata))
    {
        return Reflect.getOwnMetadata(metadataKey, target);
    }

    return undefined;
}
