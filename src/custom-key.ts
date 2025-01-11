import { CustomValueResolver } from './custom-value-resolver';
import { Optional } from './optional';

/**
 * Key used to describe custom value. Such key is explicitly defined and used
 * by type manager plugins to store strongly typed custom values within metadata.
 * 
 * @type {CustomKey<TCustomValue>}
 */
export class CustomKey<TCustomValue>
{
    /**
     * Description.
     * 
     * @type {string}
     */
    public readonly description: string;
    
    /**
     * Custom value resolver.
     * 
     * @type {Optional<CustomValueResolver<TCustomValue>>}
     */
    public readonly customValueResolver: Optional<CustomValueResolver<TCustomValue>>;
    
    /**
     * Constructor.
     * 
     * @param {string} description Description.
     * @param {CustomValueResolver<TCustomValue>} customValueResolver Custom value resolver.
     */
    public constructor(description: string, customValueResolver?: CustomValueResolver<TCustomValue>)
    {
        this.description = description;
        this.customValueResolver = customValueResolver;

        return;
    }
}
