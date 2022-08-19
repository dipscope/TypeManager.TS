import { words } from 'lodash';

/**
 * Gets words from a string.
 *
 * @param {string} x String.
 * 
 * @returns {Array<string>} Array with the words of provided string.
 */
export function getWords(x: string): Array<string>
{
    return words(x)
}
