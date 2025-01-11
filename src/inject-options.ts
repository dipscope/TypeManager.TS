import { TypeArgument } from './type-argument';

/**
 * Inject options.
 * 
 * @type {InjectOptions<TObject>}
 */
export type InjectOptions<TObject> =
{
    /**
     * Parameter key to inject within a type context. If specified then 
     * type argument will be ignored.
     * 
     * @type {string}
     */
    key?: string;
    
    /**
     * Type argument of the injection. Used if key is not specified and 
     * resolved using injector.
     * 
     * @type {TypeArgument<TObject>}
     */
    typeArgument?: TypeArgument<TObject>;
};
