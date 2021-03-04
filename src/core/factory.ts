import { Injector } from './injector';
import { TypeContext } from './type-context';

/**
 * Factory for building types.
 * 
 * @type {Factory}
 */
export interface Factory
{
    /**
     * Builds type described by provided type context.
     * 
     * @param {TypeContext<TType>} typeContext Type context.
     * @param {Injector} injector Injector.
     * 
     * @returns {TType} Type instance described by provided type context.
     */
    build<TType>(typeContext: TypeContext<TType>, injector: Injector): TType;
}
