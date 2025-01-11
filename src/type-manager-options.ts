import { TypeConfiguration } from './type-configuration';
import { TypeFn } from './type-fn';
import { TypeOptions } from './type-options';
import { TypeOptionsBase } from './type-options-base';

/**
 * Type manager options.
 * 
 * @type {TypeManagerOptions}
 */
export type TypeManagerOptions =
{
    /**
     * Type options shared among all types.
     * 
     * @type {Partial<TypeOptionsBase<any>>}
     */
    typeOptionsBase?: Partial<TypeOptionsBase<any>>;

    /**
     * Type options per type. 
     * 
     * Overrides shared type options.
     * 
     * @type {Map<TypeFn<any>, TypeOptions<any>>}
     */
    typeOptionsMap?: Map<TypeFn<any>, TypeOptions<any>>;

    /**
     * Type configuration per type. 
     * 
     * Overrides certain type options.
     * 
     * @type {Map<TypeFn<any>, TypeConfiguration<any>>}
     */
    typeConfigurationMap?: Map<TypeFn<any>, TypeConfiguration<any>>;
};
