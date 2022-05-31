import { getWords } from '../functions';
import { NamingConvention } from '../naming-convention';

/**
 * Flat upper case naming convention.
 * 
 * @type {FlatUpperCaseNamingConvention}
 */
export class FlatUpperCaseNamingConvention implements NamingConvention
{
    /**
     * Converts name from provided to target one.
     *
     * @param {string} name Name.
     *
     * @returns {string} Converted name.
     */
    public convert(name: string): string
    {
        return getWords(name).reduce(this.reduce, '');
    }

    /**
     * Reduce function.
     * 
     * @param {string} result Result string.
     * @param {string} word Word to process.
     * 
     * @returns {string} Reduced string.
     */
    private reduce(result: string, word: string): string
    {
        if (word.length === 0)
        {
            return result;
        }

        return `${result}${word.toUpperCase()}`;
    }
}
