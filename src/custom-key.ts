import { CustomKeyOptions } from './custom-key-options';
import { CustomValueResolver } from './custom-value-resolver';

/**
 * Key used to describe custom value. Such key is explicitly defined and used
 * by type manager plugins to store strongly typed custom values within a metadata.
 * 
 * @type {CustomKey<TCustomValue>}
 */
export class CustomKey<TCustomValue>
{
    /**
     * Custom key options.
     * 
     * @type {CustomKeyOptions<TCustomValue>}
     */
    public readonly customKeyOptions: CustomKeyOptions<TCustomValue>;

    /**
     * Constructor.
     * 
     * @param {CustomKeyOptions<TCustomValue>} customKeyOptions Custom key options.
     */
    public constructor(customKeyOptions: CustomKeyOptions<TCustomValue> = {})
    {
        this.customKeyOptions = customKeyOptions;

        return;
    }
    
    /**
     * Gets description.
     * 
     * @returns {string|undefined} Description or undefined.
     */
    public get description(): string | undefined
    {
        return this.customKeyOptions.description;
    }

    /**
     * Gets custom value resolver.
     * 
     * @returns {CustomValueResolver<TCustomValue>|undefined} Custom value resolver or undefined.
     */
    public get customValueResolver(): CustomValueResolver<TCustomValue> | undefined
    {
        return this.customKeyOptions.customValueResolver;
    }
}
