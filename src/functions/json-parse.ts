/**
 * Function which returns consistent results when parse JSON object.
 * 
 * @param {string} x A valid JSON string.
 * @param {Function} reviver A function that transforms the results. This function is called for each member of the object.
 * 
 * @returns {any} Consistent JSON parse result.
 */
export function jsonParse(
    x: string,
    reviver?: (this: any, key: string, value: any) => any | undefined
): any
{
    return JSON.parse(x, reviver);
}
