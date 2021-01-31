import { TypeMetadata } from './type.metadata';

/**
 * Type injector used to resolve dependent types.
 * 
 * @type {TypeInjector}
 */
export interface TypeInjector
{
    /**
     * Method to get instance described by type metadata.
     * 
     * @param {TypeMetadata} typeMetadata Type metadata.
     * 
     * @returns {any} Instance of type described by type metadata or undefined.
     */
    get(typeMetadata: TypeMetadata): any | undefined;
}
