import words from 'lodash/words';

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
