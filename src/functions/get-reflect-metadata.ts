import { isFunction, isObject } from 'lodash';

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
    if (isObject(Reflect) && isFunction(Reflect.getMetadata))
    {
        return Reflect.getMetadata(metadataKey, target, propertyKey);
    }

    return undefined;
}
