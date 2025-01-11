import { TypeMetadata } from './type-metadata';

/**
 * Represents a type configuration when used without decorators.
 * 
 * @type {TypeConfiguration<TObject>}
 */
export interface TypeConfiguration<TObject>
{
    /**
     * Configures a certain type.
     * 
     * @param {TypeMetadata<TObject>} typeMetadata Type metadata.
     * 
     * @returns {void}
     */
    configure(typeMetadata: TypeMetadata<TObject>): void;
}
