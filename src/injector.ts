import { Optional } from './optional';
import { TypeMetadata } from './type-metadata';

/**
 * Injector used to resolve dependent types.
 * 
 * @type {Injector}
 */
export interface Injector
{
    /**
     * Method to get instance described by type metadata.
     * 
     * @param {TypeMetadata<TObject>} typeMetadata Type metadata.
     * 
     * @returns {Optional<TObject>} Instance of type described by type metadata or undefined.
     */
    get<TObject>(typeMetadata: TypeMetadata<TObject>): Optional<TObject>;
}
