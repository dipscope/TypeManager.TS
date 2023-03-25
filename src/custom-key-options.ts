import { CustomValueResolver } from './custom-value-resolver';

/**
 * Custom key options.
 * 
 * @type {CustomKeyOptions<TCustomValue>}
 */
export type CustomKeyOptions<TCustomValue> =
{
    /**
     * Custom key description.
     * 
     * @type {string}
     */
    description?: string;

    /**
     * Custom value resolver.
     * 
     * @type {CustomValueResolver<TCustomValue>}
     */
    customValueResolver?: CustomValueResolver<TCustomValue>;
}