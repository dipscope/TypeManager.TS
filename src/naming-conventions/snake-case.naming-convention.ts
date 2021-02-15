import { Fn } from './../core/fn';
import { NamingConvention } from './../core/naming-convention';

/**
 * Snake case naming convention.
 *
 * @type {SnakeCaseNamingConvention}
 */
export class SnakeCaseNamingConvention implements NamingConvention
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
        return Fn.words(name).reduce(this.reduce, '');
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

        if (index === 0)
        {
            return wordLowerCased;
        }

        return `${result}_${wordLowerCased}`;
    }
}
