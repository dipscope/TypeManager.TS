import { TypeCtor } from './type-ctor';

/**
 * Inject options.
 * 
 * @type {InjectOptions<TType>}
 */
export interface InjectOptions<TType>
{
    /**
     * Parameter key to inject within a type context. If specified
     * type constructor will be ignored.
     * 
     * @type {string}
     */
    key?: string;

    /**
     * Type of injection. Used if key is not specified. Will be resolved using 
     * type injector.
     * 
     * @type {TypeCtor<TType>}
     */
    typeCtor?: TypeCtor<TType>;
}
