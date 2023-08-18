import { isNil, isUndefined } from 'lodash';
import { CustomKey } from './custom-key';
import { CustomOption } from './custom-option';
import { CustomValue } from './custom-value';

/**
 * Custom context class to encapsulate custom values attached to metadata.
 * 
 * @type {CustomContext}
 */
export class CustomContext
{
    /**
     * Custom options.
     * 
     * @type {Array<CustomOption>}
     */
    public readonly customOptions: Array<CustomOption>;

    /**
     * Custom value map.
     * 
     * @type {Map<CustomKey<any>, CustomValue>}
     */
    public readonly customValueMap: Map<CustomKey<any>, CustomValue> = new Map<CustomKey<any>, CustomValue>();

    /**
     * Constructor.
     * 
     * @param {Array<CustomOption>} customOptions Custom options.
     */
    public constructor(customOptions: Array<CustomOption> = new Array<CustomOption>())
    {
        this.customOptions = this.constructCustomOptions(customOptions);

        this.configure(customOptions);

        return;
    }

    /**
     * Constructs initial custom options by removing duplicates. 
     * All references are kept.
     * 
     * @param {Array<CustomOption>} customOptions Custom options.
     * 
     * @returns {CustomOptions} Constructed custom options.
     */
    private constructCustomOptions(customOptions: Array<CustomOption>): Array<CustomOption>
    {
        const customValueMap = new Map<CustomKey<any>, CustomValue>();

        for (const [customKey, customValue] of customOptions)
        {
            customValueMap.set(customKey, customValue);
        }

        customOptions.splice(0, customOptions.length);

        for (const [customKey, customValue] of customValueMap.entries())
        {
            customOptions.push([customKey, customValue]);
        }

        return customOptions;
    }

    /**
     * Sets value for a custom key.
     * 
     * @param {CustomKey<TCustomValue>} customKey Custom key.
     * @param {TCustomValue} customValue Custom value.
     *  
     * @returns {this} Current custom context.
     */
    public set<TCustomValue>(customKey: CustomKey<TCustomValue>, customValue: TCustomValue): this
    {
        const customOptions = this.customOptions;

        this.customValueMap.set(customKey, customValue);

        for (let i = 0; i < customOptions.length; i++)
        {
            if (customOptions[i][0] === customKey)
            {
                customOptions[i][1] = customValue;

                return this;
            }
        }

        customOptions.push([customKey, customValue]);

        return this;
    }

    /**
     * Gets value by custom key.
     * 
     * @param {CustomKey<TCustomValue>} customKey Custom key.
     *  
     * @returns {TCustomValue} Custom value.
     */
    public get<TCustomValue>(customKey: CustomKey<TCustomValue>): TCustomValue
    {
        let customValue = this.customValueMap.get(customKey);
        
        if (isUndefined(customValue) && !isNil(customKey.customValueResolver))
        {
            customValue = customKey.customValueResolver();
        }

        return customValue;
    }

    /**
     * Checks if type context has a custom key.
     * 
     * @param {CustomKey<TCustomValue>} customKey Custom key.
     *  
     * @returns {boolean} True when type context has a custom key. False otherwise.
     */
    public has<TCustomValue>(customKey: CustomKey<TCustomValue>): boolean
    {
        return this.customValueMap.has(customKey);
    }

    /**
     * Gets iterable for keys inside the context.
     * 
     * @returns {IterableIterator<CustomValue>} Iterable for keys inside the context.
     */
    public keys(): IterableIterator<CustomKey<any>>
    {
        return this.customValueMap.keys();
    }

    /**
     * Gets iterable for values inside the context.
     * 
     * @returns {IterableIterator<CustomValue>} Iterable for values inside the context.
     */
    public values(): IterableIterator<CustomValue>
    {
        return this.customValueMap.values();
    }

    /**
     * Gets iterable for entries inside the context.
     * 
     * @returns {IterableIterator<[CustomKey<any>, CustomValue]>} Iterable for entries inside the context.
     */
    public entries(): IterableIterator<[CustomKey<any>, CustomValue]>
    {
        return this.customValueMap.entries();
    }

    /**
     * Configures custom context based on custom options.
     * 
     * @param {Array<CustomOption>} customOptions Custom options.
     * 
     * @returns {this} Current custom context.
     */
    public configure(customOptions: Array<CustomOption>): this
    {
        for (const [customKey, customValue] of customOptions)
        {
            this.set(customKey, customValue);
        }

        return this;
    }
}
