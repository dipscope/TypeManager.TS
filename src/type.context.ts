import { TypeContextEntry } from './type.context.entry';

/**
 * Type context class to encapsulate type values before populating an object.
 * 
 * @type { TypeContext<TDeclaringType>}
 */
export class TypeContext<TDeclaringType>
{
    /**
     * Type context entry map.
     * 
     * @type {Map<string, TypeContextEntry<TDeclaringType, any>>}
     */
    private readonly typeContextEntryMap: Map<string, TypeContextEntry<TDeclaringType, any>> = new Map<string, TypeContextEntry<TDeclaringType, any>>();

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
     * @returns {TypeContextEntry<TDeclaringType, any>} Type context entry or undefined.
     */
    public get(key: string): TypeContextEntry<TDeclaringType, any> | undefined
    {
        return this.typeContextEntryMap.get(key);
    }

    /**
     * Sets value for key.
     * 
     * @param {string} key Key.
     * @param {TypeContextEntry<TDeclaringType, any>} value Value.
     *  
     * @returns {TypeContext} Current type context.
     */
    public set(key: string, value: TypeContextEntry<TDeclaringType, any>): TypeContext<TDeclaringType>
    {
        this.typeContextEntryMap.set(key, value);

        return this;
    }
    
    /**
     * Gets iterable for values inside the context.
     * 
     * @returns {IterableIterator<TypeContextEntry>} Iterable for values inside the context.
     */
    public values(): IterableIterator<TypeContextEntry<TDeclaringType, any>>
    {
        return this.typeContextEntryMap.values();
    }
}
