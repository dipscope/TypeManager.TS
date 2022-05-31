/**
 * Checks if value is data view.
 * 
 * @param {any} x Input value.
 * 
 * @returns {boolean} True when value is data view. False otherwise.
 */
export function isDataView(x: any): x is DataView
{
    return x instanceof DataView;
}
