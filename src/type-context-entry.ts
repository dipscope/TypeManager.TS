import { PropertyMetadata } from './property-metadata';

/**
 * Represents a data entry defined within a scope of a type.
 * 
 * @type {TypeContextEntry<TDeclaringType, TType>}
 */
export class TypeContextEntry<TDeclaringType, TType>
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
     * @type {PropertyMetadata<TDeclaringType, TType>}
     */
    public readonly propertyMetadata?: PropertyMetadata<TDeclaringType, TType>;

    /**
     * Constructor.
     * 
     * @param {string} key Unique key.  
     * @param {any} value Value behind a key.
     * @param {PropertyMetadata<TDeclaringType, TType>} propertyMetadata Property metadata behind a key.
     */
    public constructor(key: string, value: any, propertyMetadata?: PropertyMetadata<TDeclaringType, TType>)
    {
        this.key = key;
        this.value = value;
        this.propertyMetadata = propertyMetadata;

        return;
    }
}
