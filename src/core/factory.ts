import { TypeContext } from './type-context';
import { Injector } from './injector';

/**
 * Factory for building a type.
 * 
 * @type {Factory<TType>}
 */
export interface Factory<TType>
{
    /**
     * Builds type described by provided type metadata.
     * 
     * @param {TypeContext<TType>} typeContext Type context.
     * @param {Injector} injector Injector.
     * 
     * @returns {TType} Type instance described by provided type metadata.
     */
    build(typeContext: TypeContext<TType>, injector: Injector): TType;
}
