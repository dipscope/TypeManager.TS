import { TypeContextEntry } from './type.context.entry';

/**
 * Type context class to encapsulate type values before populating an object.
 * 
 * @type {TypeContext}
 */
export class TypeContext
{
    /**
     * Type context entry map.
     * 
     * @type {Map<string, TypeContextEntry>}
     */
    private readonly typeContextEntryMap: Map<string, TypeContextEntry> = new Map<string, TypeContextEntry>();

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
     * @returns {TypeContextEntry} Type context entry or undefined.
     */
    public get(key: string): TypeContextEntry | undefined
    {
        return this.typeContextEntryMap.get(key);
    }

    /**
     * Sets value for key.
     * 
     * @param {string} key Key.
     * @param {TypeContextEntry} value Value.
     *  
     * @returns {TypeContext} Current type context.
     */
    public set(key: string, value: TypeContextEntry): TypeContext
    {
        this.typeContextEntryMap.set(key, value);

        return this;
    }
    
    /**
     * Gets iterable for values inside the context.
     * 
     * @returns {IterableIterator<TypeContextEntry>} Iterable for values inside the context.
     */
    public values(): IterableIterator<TypeContextEntry>
    {
        return this.typeContextEntryMap.values();
    }
}
