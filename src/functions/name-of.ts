import isFunction from 'lodash/isFunction';

/**
 * Defines name for any value.
 * 
 * @param {any} x Input value.
 * 
 * @returns {boolean} Name when present. Unknown otherwise.
 */
export function nameOf(x: any): string
{
    if (isFunction(x))
    {
        return x.name;
    }

    return 'Unknown';
}
