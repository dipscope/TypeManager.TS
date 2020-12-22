/**
 * Type options base interface.
 * 
 * @type {TypeOptionsBase}
 */
export interface TypeOptionsBase
{
    /**
     * Default value for undefined ones.
     * 
     * Assigned only when use default value option is true.
     * 
     * @type {any}
     */
    defaultValue?: any;

    /**
     * Use default value assignment for undefined values?
     * 
     * @type {boolean}
     */
    useDefaultValue?: boolean;

    /**
     * Use implicit conversion when provided value can be converted
     * to the target one?
     * 
     * @type {boolean}
     */
    useImplicitConversion?: boolean;
}
