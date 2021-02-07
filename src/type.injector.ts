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
     * @param {TypeMetadata<TType>} typeMetadata Type metadata.
     * 
     * @returns {TType|undefined} Instance of type described by type metadata or undefined.
     */
    get<TType>(typeMetadata: TypeMetadata<TType>): TType | undefined;
}
