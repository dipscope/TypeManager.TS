import { PropertyMetadata } from './property.metadata';

/**
 * Represents a data entry defined within a scope of a type.
 * 
 * @type {TypeContextEntry}
 */
export class TypeContextEntry
{
    /**
     * Unique key.
     * 
     * @type {string}
     */
    public readonly key: string;

    /**
     * Value behind a key. 
     * 
     * If property metadata is defined then this is deserialized value. Original otherwise.
     * 
     * @type {any}
     */
    public readonly value: any;

    /**
     * Property metadata behind a key.
     * 
     * @type {PropertyMetadata}
     */
    public readonly propertyMetadata?: PropertyMetadata;

    /**
     * Constructor.
     * 
     * @param {string} key Unique key.  
     * @param {any} value Value behind a key.
     * @param {PropertyMetadata} propertyMetadata Property metadata behind a key.
     */
    public constructor(key: string, value: any, propertyMetadata?: PropertyMetadata)
    {
        this.key              = key;
        this.value            = value;
        this.propertyMetadata = propertyMetadata;

        return;
    }
}
