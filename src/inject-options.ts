import { TypeFn } from './type-fn';

/**
 * Inject options.
 * 
 * @type {InjectOptions<TType>}
 */
export interface InjectOptions<TType>
{
    /**
     * Parameter key to inject within a type context. If specified then
     * type function will be ignored.
     * 
     * @type {string}
     */
    key?: string;

    /**
     * Type of injection. Used if key is not specified. Will be resolved using 
     * type injector.
     * 
     * @type {TypeFn<TType>}
     */
    typeFn?: TypeFn<TType>;
}
