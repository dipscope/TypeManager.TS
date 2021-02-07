import { TypeMetadata } from './type.metadata';
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
     * @param {TypeMetadata<TType>} typeMetadata Type metadata.
     * @param {TypeContext<TType>} typeContext Type context.
     * @param {TypeInjector} typeInjector Type injector.
     * 
     * @returns {TType} Type instance described by provided type metadata.
     */
    build(typeMetadata: TypeMetadata<TType>, typeContext: TypeContext<TType>, typeInjector: TypeInjector): TType;
}
