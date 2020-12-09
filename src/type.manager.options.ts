import { LogLevel } from './utils';
import { TypeCtor } from './type.ctor';
import { TypeOptions } from './type.options';

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
     * Preconfigured options for types.
     * 
     * @type {Map<TypeCtor, TypeOptions>}
     */
    typeOptionsMap?: Map<TypeCtor, TypeOptions>;
}