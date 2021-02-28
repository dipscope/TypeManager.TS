/** ------ Symbols and regular expressions used by Fn class. ------ **/
const rsAstralRange               = '\\ud800-\\udfff';
const rsComboMarksRange           = '\\u0300-\\u036f';
const reComboHalfMarksRange       = '\\ufe20-\\ufe2f';
const rsComboSymbolsRange         = '\\u20d0-\\u20ff';
const rsComboMarksExtendedRange   = '\\u1ab0-\\u1aff';
const rsComboMarksSupplementRange = '\\u1dc0-\\u1dff';
const rsComboRange                = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange + rsComboMarksExtendedRange + rsComboMarksSupplementRange;
const rsDingbatRange              = '\\u2700-\\u27bf';
const rsLowerRange                = 'a-z\\xdf-\\xf6\\xf8-\\xff';
const rsMathOpRange               = '\\xac\\xb1\\xd7\\xf7';
const rsNonCharRange              = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf';
const rsPunctuationRange          = '\\u2000-\\u206f';
const rsSpaceRange                = '\\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000';
const rsUpperRange                = 'A-Z\\xc0-\\xd6\\xd8-\\xde';
const rsVarRange                  = '\\ufe0e\\ufe0f';
const rsBreakRange                = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
const rsApos                      = '[\'\\u2019]';
const rsBreak                     = `[${rsBreakRange}]`;
const rsCombo                     = `[${rsComboRange}]`;
const rsDigit                     = '\\d';
const rsDingbat                   = `[${rsDingbatRange}]`;
const rsLower                     = `[${rsLowerRange}]`;
const rsMisc                      = `[^${rsAstralRange}${rsBreakRange + rsDigit + rsDingbatRange + rsLowerRange + rsUpperRange}]`;
const rsFitz                      = '\\ud83c[\\udffb-\\udfff]';
const rsModifier                  = `(?:${rsCombo}|${rsFitz})`;
const rsNonAstral                 = `[^${rsAstralRange}]`;
const rsRegional                  = '(?:\\ud83c[\\udde6-\\uddff]){2}';
const rsSurrPair                  = '[\\ud800-\\udbff][\\udc00-\\udfff]';
const rsUpper                     = `[${rsUpperRange}]`;
const rsZWJ                       = '\\u200d';
const rsMiscLower                 = `(?:${rsLower}|${rsMisc})`;
const rsMiscUpper                 = `(?:${rsUpper}|${rsMisc})`;
const rsOptContrLower             = `(?:${rsApos}(?:d|ll|m|re|s|t|ve))?`;
const rsOptContrUpper             = `(?:${rsApos}(?:D|LL|M|RE|S|T|VE))?`;
const reOptMod                    = `${rsModifier}?`;
const rsOptVar                    = `[${rsVarRange}]?`;
const rsOptJoin                   = `(?:${rsZWJ}(?:${[rsNonAstral, rsRegional, rsSurrPair].join('|')})${rsOptVar + reOptMod})*`;
const rsOrdLower                  = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])';
const rsOrdUpper                  = '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])';
const rsSeq                       = rsOptVar + reOptMod + rsOptJoin;
const rsEmoji                     = `(?:${[rsDingbat, rsRegional, rsSurrPair].join('|')})${rsSeq}`;
const reA                         = `${rsUpper}?${rsLower}+${rsOptContrLower}(?=${[rsBreak, rsUpper, '$'].join('|')})`;
const reB                         = `${rsMiscUpper}+${rsOptContrUpper}(?=${[rsBreak, rsUpper + rsMiscLower, '$'].join('|')})`;
const reC                         = `${rsUpper}?${rsMiscLower}+${rsOptContrLower}`;
const reD                         = rsOrdUpper;
const reE                         = rsOrdLower;
const reF                         = `${rsDigit}+`;
const reG                         = rsEmoji;
const reUnicodeWord               = new RegExp('[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9\\s]');
const reUnicodeWords              = new RegExp([reA, reB, reC, reD, reE, reF, reG].join('|'), 'g');
const reAsciiWords                = new RegExp('[^\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\x7f]+', 'g');

/**
 * Reflect class declaration.
 * 
 * @type {Reflect}
 */
declare class Reflect 
{
    /**
     * Gets metadata value of a metadata key on the prototype chain of an object or property.
     * 
     * @param {string} metadataKey Unique metadata key.
     * @param {any} target Target to extract from. 
     * @param {string|symbol} targetKey Key in a target.
     * 
     * @returns {any} Metadata for a key or undefined if metadata is not present.
     */
    static getMetadata(metadataKey: string, target: any, targetKey?: string | symbol): any;

    /**
     * Gets metadata value of an own metadata key of an object or property.
     * 
     * @param {string} metadataKey Unique metadata key.
     * @param {any} target Target to extract from. 
     * @param {string|symbol} targetKey Key in a target.
     * 
     * @returns {any} Metadata for a key or undefined if metadata is not present.
     */
    static getOwnMetadata(metadataKey: string, target: any, targetKey?: string | symbol): any;
}

/**
 * Helper class to encapsulate commonly used functions.
 * 
 * @type {Fn}
 */
export class Fn
{
    /**
     * Checks if value is null or undefined.
     * 
     * @param {any} x Input value.
     * 
     * @returns {boolean} True when value is null or undefined. False otherwise.
     */
    public static isNil(x: any): x is null | undefined
    {
        return x === null || x === undefined;
    }

    /**
     * Checks if value is null.
     * 
     * @param {any} x Input value.
     * 
     * @returns {boolean} True when value is null. False otherwise.
     */
    public static isNull(x: any): x is null
    {
        return x === null;
    }

    /**
     * Checks if value is undefined.
     * 
     * @param {any} x Input value.
     * 
     * @returns {boolean} True when value is undefined. False otherwise.
     */
    public static isUndefined(x: any): x is undefined
    {
        return x === undefined;
    }

    /**
     * Checks if value is object.
     * 
     * @param {any} x Input value.
     * 
     * @returns {boolean} True when value is object. False otherwise.
     */
    public static isObject(x: any): x is { [key: string]: any }
    {
        return x !== null && typeof x === 'object';
    }

    /**
     * Checks if value is a plain object.
     * 
     * @param {any} x Input value.
     * 
     * @returns {boolean} True when value is a plain object. False otherwise.
     */
    public static isPlainObject(x: any): x is { [key: string]: any }
    {
        return x !== null && typeof x === 'object' && Object.getPrototypeOf(x).isPrototypeOf(Object);
    }

    /**
     * Checks if value is function.
     * 
     * @param {any} x Input value.
     * 
     * @returns {boolean} True when value is function. False otherwise.
     */
    public static isFunction(x: any): x is (...args: any[]) => any
    {
        return typeof x === 'function';
    }

    /**
     * Checks if value is a constructor.
     * 
     * @param {any} x Input value.
     * 
     * @returns {boolean} True when value is a constructor. False otherwise.
     */
    public static isCtor(x: any): x is new (...args: any[]) => any
    {
        return typeof x === 'function' && x.prototype && x.prototype.constructor === x;
    }

    /**
     * Checks if value is string.
     * 
     * @param {any} x Input value.
     * 
     * @returns {boolean} True when value is string. False otherwise.
     */
    public static isString(x: any): x is string
    {
        return typeof x === 'string';
    }

    /**
     * Checks if value is number.
     * 
     * @param {any} x Input value.
     * 
     * @returns {boolean} True when value is number. False otherwise.
     */
    public static isNumber(x: any): x is number
    {
        return typeof x === 'number';
    }

    /**
     * Checks if value is symbol.
     * 
     * @param {any} x Input value.
     * 
     * @returns {boolean} True when value is symbol. False otherwise.
     */
    public static isSymbol(x: any): x is symbol
    {
        return typeof x === 'symbol';
    }

    /**
     * Checks if value is boolean.
     * 
     * @param {any} x Input value.
     * 
     * @returns {boolean} True when value is boolean. False otherwise.
     */
    public static isBoolean(x: any): x is boolean
    {
        return typeof x === 'boolean';
    }

    /**
     * Checks if value is array.
     * 
     * @param {any} x Input value.
     * 
     * @returns {boolean} True when value is array. False otherwise.
     */
    public static isArray(x: any): x is any[]
    {
        return Array.isArray(x);
    }

    /**
     * Checks if value is date.
     * 
     * @param {any} x Input value.
     * 
     * @returns {boolean} True when value is date. False otherwise.
     */
    public static isDate(x: any): x is Date
    {
        return x instanceof Date;
    }

    /**
     * Checks if value is array buffer.
     * 
     * @param {any} x Input value.
     * 
     * @returns {boolean} True when value is array buffer. False otherwise.
     */
    public static isArrayBuffer(x: any): x is ArrayBuffer
    {
        return x instanceof ArrayBuffer;
    }

    /**
     * Checks if value is data view.
     * 
     * @param {any} x Input value.
     * 
     * @returns {boolean} True when value is data view. False otherwise.
     */
    public static isDataView(x: any): x is DataView
    {
        return x instanceof DataView;
    }

    /**
     * Checks if value is float 32 array.
     * 
     * @param {any} x Input value.
     * 
     * @returns {boolean} True when value is float 32 array. False otherwise.
     */
    public static isFloat32Array(x: any): x is Float32Array
    {
        return x instanceof Float32Array;
    }

    /**
     * Checks if value is float 64 array.
     * 
     * @param {any} x Input value.
     * 
     * @returns {boolean} True when value is float 64 array. False otherwise.
     */
    public static isFloat64Array(x: any): x is Float64Array
    {
        return x instanceof Float64Array;
    }

    /**
     * Checks if value is int 8 array.
     * 
     * @param {any} x Input value.
     * 
     * @returns {boolean} True when value is int 8 array. False otherwise.
     */
    public static isInt8Array(x: any): x is Int8Array
    {
        return x instanceof Int8Array;
    }

    /**
     * Checks if value is int 16 array.
     * 
     * @param {any} x Input value.
     * 
     * @returns {boolean} True when value is int 16 array. False otherwise.
     */
    public static isInt16Array(x: any): x is Int16Array
    {
        return x instanceof Int16Array;
    }

    /**
     * Checks if value is int 32 array.
     * 
     * @param {any} x Input value.
     * 
     * @returns {boolean} True when value is int 32 array. False otherwise.
     */
    public static isInt32Array(x: any): x is Int32Array
    {
        return x instanceof Int32Array;
    }

    /**
     * Checks if value is map.
     * 
     * @param {any} x Input value.
     * 
     * @returns {boolean} True when value is map. False otherwise.
     */
    public static isMap(x: any): x is Map<any, any>
    {
        return x instanceof Map;
    }

    /**
     * Checks if value is set.
     * 
     * @param {any} x Input value.
     * 
     * @returns {boolean} True when value is set. False otherwise.
     */
    public static isSet(x: any): x is Set<any>
    {
        return x instanceof Set;
    }

    /**
     * Checks if value is uint 8 array.
     * 
     * @param {any} x Input value.
     * 
     * @returns {boolean} True when value is uint 8 array. False otherwise.
     */
    public static isUint8Array(x: any): x is Uint8Array
    {
        return x instanceof Uint8Array;
    }

    /**
     * Checks if value is uint 8 clamped array.
     * 
     * @param {any} x Input value.
     * 
     * @returns {boolean} True when value is uint 8 clamped array. False otherwise.
     */
    public static isUint8ClampedArray(x: any): x is Uint8ClampedArray
    {
        return x instanceof Uint8ClampedArray;
    }

    /**
     * Checks if value is uint 16 array.
     * 
     * @param {any} x Input value.
     * 
     * @returns {boolean} True when value is uint 16 array. False otherwise.
     */
    public static isUint16Array(x: any): x is Uint16Array
    {
        return x instanceof Uint16Array;
    }

    /**
     * Checks if value is uint 32 array.
     * 
     * @param {any} x Input value.
     * 
     * @returns {boolean} True when value is uint 32 array. False otherwise.
     */
    public static isUint32Array(x: any): x is Uint32Array
    {
        return x instanceof Uint32Array;
    }

    /**
     * Checks if value is weak map.
     * 
     * @param {any} x Input value.
     * 
     * @returns {boolean} True when value is weak map. False otherwise.
     */
    public static isWeakMap(x: any): x is WeakMap<any, any>
    {
        return x instanceof WeakMap;
    }

    /**
     * Checks if value is weak set.
     * 
     * @param {any} x Input value.
     * 
     * @returns {boolean} True when value is weak set. False otherwise.
     */
    public static isWeakSet(x: any): x is WeakSet<any>
    {
        return x instanceof WeakSet;
    }

    /**
     * Checks if provided value is empty.
     *
     * @param {any} x Input value.
     *
     * @returns {boolean} True when value is empty. False otherwise.
     */
    public static isEmpty(x: any): boolean
    {
        return (!x && x !== 0 || typeof x === typeof {} && (x.length === 0 || Object.keys(x).length === 0));
    }

    /**
     * Performs deep assign and returns target object.
     *
     * @param {any} target Target object.
     * @param {any[]} sources Source objects.
     *
     * @returns {any} Target object.
     */
    public static assign(target: any, ...sources: any[]): any
    {
        if (!this.isObject(target) || !sources.every(s => this.isObject(s)))
        {
            return target;
        }

        for (const source of sources) 
        {
            for (const key in source)
            {
                if (!source.hasOwnProperty(key))
                {
                    continue;
                }
    
                if (!this.isObject(source[key]) || !this.isPlainObject(source[key]))
                {
                    target[key] = source[key];
    
                    continue;
                }
    
                if (!this.isObject(target[key]))
                {
                    target[key] = {};
                }
    
                target[key] = this.assign(target[key], source[key]);
            }
        }
        
        return target;
    }

    /**
     * Defines name for any value.
     * 
     * @param {any} x Input value.
     * 
     * @returns {boolean} Name when present. Unknown otherwise.
     */
    public static nameOf(x: any): string
    {
        let name = 'Unknown';

        if (!Fn.isNil(x) && (Fn.isFunction(x) || Fn.isObject(x)) && Fn.isString(x.name))
        {
            name = x.name;
        }

        return name;
    }

    /**
     * Splits a Unicode string into an array of its words.
     *
     * @param {string} x String.
     * 
     * @returns {string[]} Array with the words of provided string.
     */
    public static unicodeWords(x: string): string[]
    {
        return x.match(reUnicodeWords) ?? [];
    }

    /**
     * Splits a ASCII string into an array of its words.
     *
     * @param {string} x String.
     * 
     * @returns {string[]} Array with the words of provided string.
     */
    public static asciiWords(x: string): string[]
    {
        return x.match(reAsciiWords) ?? [];
    }

    /**
     * Splits string into an array of its words.
     *
     * @param {string} x String.
     * 
     * @returns {string[]} Array with the words of provided string.
     */
    public static words(x: string): string[]
    {
        return reUnicodeWord.test(x) ? this.unicodeWords(x) : this.asciiWords(x);
    }
    
    /**
     * Checks if reflect metadata is supported.
     *
     * @returns {boolean} True when supported. False otherwise.
     */
    public static isReflectMetadataSupported(): boolean
    {
        return !this.isNil(Reflect) && this.isObject(Reflect) && this.isFunction(Reflect.getMetadata);
    }

    /**
     * Extracts reflect metadata.
     * 
     * @param {string} metadataKey Unique metadata key.
     * @param {any} target Target to extract from. 
     * @param {string|symbol} targetKey Key in a target.
     * 
     * @returns {any} Metadata for a key or undefined if metadata is not present.
     */
    public static extractReflectMetadata(metadataKey: string, target: any, targetKey?: string | symbol): any
    {
        return Fn.isReflectMetadataSupported() ? Reflect.getMetadata(metadataKey, target, targetKey) : undefined;
    }

    /**
     * Extracts own reflect metadata.
     * 
     * @param {string} metadataKey Unique metadata key.
     * @param {any} target Target to extract from. 
     * @param {string|symbol} targetKey Key in a target.
     * 
     * @returns {any} Metadata for a key or undefined if metadata is not present.
     */
    public static extractOwnReflectMetadata(metadataKey: string, target: any, targetKey?: string | symbol): any
    {
        return Fn.isReflectMetadataSupported() ? Reflect.getOwnMetadata(metadataKey, target, targetKey) : undefined;
    }
}
