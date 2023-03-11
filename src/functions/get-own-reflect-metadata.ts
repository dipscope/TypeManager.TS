import { isFunction, isObject } from 'lodash';

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
