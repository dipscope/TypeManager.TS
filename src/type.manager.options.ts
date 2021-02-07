import { LogLevel } from './utils';
import { TypeCtor } from './type.ctor';
import { TypeOptions } from './type.options';
import { TypeOptionsBase } from './type.options.base';

/**
 * Type manager options.
 * 
 * @type {TypeManagerOptions}
 */
export interface TypeManagerOptions
{
    /**
     * Log level.
     * 
     * @type {LogLevel}
     */
    logLevel?: LogLevel;

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