import { getWords } from '../functions/get-words';
import { NamingConvention } from '../naming-convention';

/**
 * Pascal case naming convention.
 * 
 * @type {PascalCaseNamingConvention}
 */
export class PascalCaseNamingConvention implements NamingConvention
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
     * @param {number} index Word index.
     * 
     * @returns {string} Reduced string.
     */
    private reduce(result: string, word: string, index: number): string
    {
        if (word.length === 0)
        {
            return result;
        }

        const wordLowerCased = word.toLowerCase();
        const wordPascalCased = `${wordLowerCased[0].toUpperCase()}${wordLowerCased.slice(1)}`;

        if (index === 0)
        {
            return wordPascalCased;
        }

        return `${result}${wordPascalCased}`;
    }
}
