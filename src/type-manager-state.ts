import { TYPE_METADATA_SYMBOL } from './type-metadata-symbol';

/**
 * Represents global state that is shared by all active instances of the type manager.
 * 
 * @type {Record<string, symbol>}
 */
export const TYPE_MANAGER_STATE: Record<string, symbol> = 
{ 
    /**
     * Symbol of static instance of type manager.
     * 
     * @type {symbol}
     */
    staticSymbol: TYPE_METADATA_SYMBOL,
    
    /**
     * Symbol of currently active instance of type manager.
     * 
     * @type {symbol}
     */
    activeSymbol: TYPE_METADATA_SYMBOL
};
