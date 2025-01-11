import { PropertyMetadata } from './property-metadata';

/**
 * Represents a data entry defined within a scope of a type.
 * 
 * @type {TypeEntry<TDeclaringObject, TObject>}
 */
export type TypeEntry<TDeclaringObject, TObject> =
{
    /**
     * Unique key.
     * 
     * @type {string}
     */
    readonly key: string;

    /**
     * Value behind a key. 
     * 
     * If property metadata is defined then this is deserialized value. Original otherwise.
     * 
     * @type {any}
     */
    readonly value: any;

    /**
     * Property metadata behind a key.
     * 
     * @type {PropertyMetadata<TDeclaringObject, TObject>}
     */
    readonly propertyMetadata?: PropertyMetadata<TDeclaringObject, TObject>;
};
