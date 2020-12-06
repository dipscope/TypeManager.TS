/**
 * Reflect class declaration.
 * 
 * @type {Reflect}
 */
declare class Reflect 
{
    static getMetadata(metadataKey: string, target: any, targetKey: string | symbol): any;
}

/**
 * Class to encapsulate helper functions.
 * 
 * @type {Fn}
 */
export class Fn
{
    public static isNil(x: any): x is null | undefined
    {
        return x === null || x === undefined;
    }

    public static isObject(x: any): x is { [key: string]: any }
    {
        return typeof x === 'object';
    }

    public static isFunction(x: any): x is (...args: any[]) => any
    {
        return typeof x === 'function';
    }

    public static isString(x: any): x is string
    {
        return typeof x === 'string';
    }

    public static isSymbol(x: any): x is symbol
    {
        return typeof x === 'symbol';
    }

    public static isBoolean(x: any): x is boolean
    {
        return typeof x === 'boolean';
    }

    public static nameOf(x: any): string
    {
        let name = 'undefined';

        if (!Fn.isNil(x) && (Fn.isFunction(x) || Fn.isObject(x)) && Fn.isString(x.name))
        {
            name = x.name;
        }

        return name;
    }

    public static isReflectMetadataSupported(): boolean
    {
        return !this.isNil(Reflect) && this.isObject(Reflect) && this.isFunction(Reflect.getMetadata);
    }

    public static extractReflectMetadata(metadataKey: string, target: any, targetKey: string | symbol): any
    {
        return Fn.isReflectMetadataSupported() ? Reflect.getMetadata(metadataKey, target, targetKey) : null;
    }
}
