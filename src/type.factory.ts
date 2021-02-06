import { TypeMetadata } from './type.metadata';
import { TypeContext } from './type.context';
import { TypeInjector } from './type.injector';

/**
 * Type factory for building types.
 * 
 * @type {TypeFactory}
 */
export interface TypeFactory
{
    /**
     * Builds type described by provided type metadata.
     * 
     * @param {TypeMetadata} typeMetadata Type metadata.
     * @param {TypeContext} typeContext Type context.
     * @param {TypeInjector} typeInjector Type injector.
     * 
     * @returns {any} Type instance described by provided type metadata.
     */
    build(typeMetadata: TypeMetadata, typeContext: TypeContext, typeInjector: TypeInjector): any;
}
