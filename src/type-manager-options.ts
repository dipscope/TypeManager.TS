import { TypeFn } from './core';
import { TypeOptions } from './core/type-options';
import { TypeOptionsBase } from './core/type-options-base';

/**
 * Type manager options.
 * 
 * @type {TypeManagerOptions}
 */
export interface TypeManagerOptions
{
    /**
     * Global type options shared among all types.
     * 
     * @type {Partial<TypeOptionsBase<any>>}
     */
    typeOptionsBase?: Partial<TypeOptionsBase<any>>;

    /**
     * Type options per type. 
     * 
     * Overrides global type options.
     * 
     * @type {Map<TypeFn<any>, TypeOptions<any>>}
     */
    typeOptionsMap?: Map<TypeFn<any>, TypeOptions<any>>;
}