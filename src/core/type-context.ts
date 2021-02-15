import { TypeContextEntry } from './type-context-entry';
import { TypeMetadata } from './type-metadata';

/**
 * Type context class to encapsulate type values before building an object.
 * 
 * @type {TypeContext<TType>}
 */
export class TypeContext<TType>
{
    /**
     * Type metadata.
     * 
     * @type {TypeMetadata<TType>}
     */
    public readonly typeMetadata: TypeMetadata<TType>;

    /**
     * Type context entry map.
     * 
     * @type {Map<string, TypeContextEntry<TType, any>>}
     */
    public readonly typeContextEntryMap: Map<string, TypeContextEntry<TType, any>> = new Map<string, TypeContextEntry<TType, any>>();

    /**
     * Constructor.
     * 
     * @param {TypeMetadata<TType>} typeMetadata Type metadata.
     */
    public constructor(typeMetadata: TypeMetadata<TType>)
    {
        this.typeMetadata = typeMetadata;

        return;
    }

    /**
     * Checks if type context has a key.
     * 
     * @param {string} key Key.
     *  
     * @returns {boolean} True when type context has a key. False otherwise.
     */
    public has(key: string): boolean
    {
        return this.typeContextEntryMap.has(key);
    }

    /**
     * Gets value by key.
     * 
     * @param {string} key Key.
     *  
     * @returns {TypeContextEntry<TType, any>} Type context entry or undefined.
     */
    public get(key: string): TypeContextEntry<TType, any> | undefined
    {
        return this.typeContextEntryMap.get(key);
    }

    /**
     * Sets value for key.
     * 
     * @param {string} key Key.
     * @param {TypeContextEntry<TType, any>} value Value.
     *  
     * @returns {TypeContext<TType>} Current type context.
     */
    public set(key: string, value: TypeContextEntry<TType, any>): TypeContext<TType>
    {
        this.typeContextEntryMap.set(key, value);

        return this;
    }
    
    /**
     * Gets iterable for values inside the context.
     * 
     * @returns {IterableIterator<TypeContextEntry<TType, any>>} Iterable for values inside the context.
     */
    public values(): IterableIterator<TypeContextEntry<TType, any>>
    {
        return this.typeContextEntryMap.values();
    }
}
