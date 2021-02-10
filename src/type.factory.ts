import { TypeContext } from './type.context';
import { TypeInjector } from './type.injector';

/**
 * Type factory for building types.
 * 
 * @type {TypeFactory<TType>}
 */
export interface TypeFactory<TType>
{
    /**
     * Builds type described by provided type metadata.
     * 
     * @param {TypeContext<TType>} typeContext Type context.
     * @param {TypeInjector} typeInjector Type injector.
     * 
     * @returns {TType} Type instance described by provided type metadata.
     */
    build(typeContext: TypeContext<TType>, typeInjector: TypeInjector): TType;
}
