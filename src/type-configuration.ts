import { TypeMetadata } from './type-metadata';

/**
 * Represents a type configuration when used without decorators.
 * 
 * @type {TypeConfiguration<TType>}
 */
export interface TypeConfiguration<TType>
{
    /**
     * Configures a certain type.
     * 
     * @param {TypeMetadata<TType>} typeMetadata Type metadata.
     * 
     * @returns {void}
     */
    configure(typeMetadata: TypeMetadata<TType>): void;
}
