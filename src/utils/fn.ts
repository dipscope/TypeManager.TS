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
     * Checks if value is a pure object.
     * 
     * @param {any} x Input value.
     * 
     * @returns {boolean} True when value is a pure object. False otherwise.
     */
    public static isPureObject(x: any): x is { [key: string]: any }
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
     * Performs deep assign and returns target object.
     *
     * @param {any} target Target object.
     * @param {any} source Source object.
     *
     * @returns {any} Target object.
     */
    public static assign(target: any, source: any): any
    {
        if (!this.isObject(target) || !this.isObject(source))
        {
            return target;
        }

        for (const key in source)
        {
            if (!source.hasOwnProperty(key))
            {
                continue;
            }

            if (!this.isObject(source[key]) || !this.isPureObject(source[key]))
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
