import { TypeCtor } from './core/type-ctor';
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
     * @type {Map<TypeCtor<any>, TypeOptions<any>>}
     */
    typeOptionsMap?: Map<TypeCtor<any>, TypeOptions<any>>;
}