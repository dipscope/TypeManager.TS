import { Fn, Log, LogLevel } from './utils';
import { TypeMetadata } from './type.metadata';
import { TypeManagerOptions } from './type.manager.options';
import { TypeCtor } from './type.ctor';
import { TypeArtisan } from './type.artisan';
import { TypeOptionsBase } from './type.options.base';
import { TypeOptions } from './type.options';

/**
 * Type manager class for external usage.
 * 
 * @type {TypeManager}
 */
export class TypeManager
{
    /**
     * Type metadata for provided type.
     * 
     * @type {TypeMetadata}
     */
    public readonly typeMetadata: TypeMetadata;

    /**
     * Constructor.
     * 
     * @param {TypeCtor} typeCtor Type constructor function.
     * @param {TypeOptions} typeOptions Type options binded to the instance.
     */
    public constructor(typeCtor: TypeCtor, typeOptions: TypeOptions = {})
    {
        this.typeMetadata = TypeArtisan.extractTypeMetadata(typeCtor).clone();

        this.typeMetadata.configure(typeOptions);

        return;
    }

    /**
     * Sets log level.
     * 
     * @param {LogLevel} logLevel Log level.
     * 
     * @returns {void}
     */
    public static setLogLevel(logLevel: LogLevel): void 
    {
        Log.logLevel = logLevel;

        return;
    }

    /**
     * Configures global type options.
     * 
     * @param {Partial<TypeOptionsBase>} typeOptionsBase Type options base.
     * 
     * @returns {void}
     */
    public static configureTypeOptionsBase(typeOptionsBase: Partial<TypeOptionsBase>): void
    {
        TypeArtisan.configureTypeOptionsBase(typeOptionsBase);

        return;
    }

    /**
     * Configures type options.
     * 
     * @param {TypeCtor} typeCtor Type constructor function.
     * @param {TypeOptions} typeOptions Type options.
     * 
     * @returns {void}
     */
    public static configureTypeOptions(typeCtor: TypeCtor, typeOptions: TypeOptions): void 
    {
        TypeArtisan.configureTypeOptions(typeCtor, typeOptions);

        return;
    }

    /**
     * Configures type options per type.
     * 
     * @param {Map<TypeCtor, TypeOptions>} typeOptionsMap Type options map.
     * 
     * @returns {void}
     */
    public static configureTypeOptionsMap(typeOptionsMap: Map<TypeCtor, TypeOptions>): void
    {
        TypeArtisan.configureTypeOptionsMap(typeOptionsMap);

        return;
    }

    /**
     * Configures type manager in general.
     * 
     * @param {TypeManagerOptions} typeManagerOptions Type manager options.
     * 
     * @returns {void}
     */
    public static configure(typeManagerOptions: TypeManagerOptions): void
    {
        if (!Fn.isUndefined(typeManagerOptions.logLevel))
        {
            this.setLogLevel(typeManagerOptions.logLevel);
        }

        if (!Fn.isUndefined(typeManagerOptions.typeOptionsBase)) 
        {
            this.configureTypeOptionsBase(typeManagerOptions.typeOptionsBase);
        }

        if (!Fn.isUndefined(typeManagerOptions.typeOptionsMap)) 
        {
            this.configureTypeOptionsMap(typeManagerOptions.typeOptionsMap);
        }

        return;
    }

    /**
     * Serializes provided value based on the type constructor function.
     * 
     * @param {TypeCtor} typeCtor Type constructor function.
     * @param {any} x Input value.
     * 
     * @returns {any} Object created from provided input value. 
     */
    public static serialize(typeCtor: TypeCtor, x: any): any 
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(typeCtor);

        return typeMetadata.typeSerializer.serialize(x, typeMetadata);
    }

    /**
     * Deserializes provided value based on the type constructor function.
     * 
     * @param {TypeCtor} typeCtor Type constructor function.
     * @param {any} x Input value.
     * 
     * @returns {any} Type created from provided input value. 
     */
    public static deserialize(typeCtor: TypeCtor, x: any): any
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(typeCtor);

        return typeMetadata.typeSerializer.deserialize(x, typeMetadata);
    }

    /**
     * Converts provided value to a JavaScript Object Notation (JSON) string.
     * 
     * @param {TypeCtor} typeCtor Type constructor function.
     * @param {any} x Input value, usually an object or array, to be converted.
     * @param {Function|number[]|string[]} replacer A function that transforms the results or an array of strings and numbers that acts as an approved list.
     * @param {string|number} space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
     * 
     * @returns {string} JSON string.
     */
    public static stringify(typeCtor: TypeCtor, x: any, replacer?: (this: any, key: string, value: any) => any | number[] | string[] | null, space?: string | number): string
    {
        return JSON.stringify(this.serialize(typeCtor, x), replacer, space);
    }

    /**
     * Converts a JavaScript Object Notation (JSON) string into a type.
     * 
     * @param {TypeCtor} typeCtor Type constructor function.
     * @param {any} x A valid JSON string.
     * @param {Function} reviver A function that transforms the results. This function is called for each member of the object.
     * 
     * @returns {any} Type created from provided input value.
     */
    public static parse(typeCtor: TypeCtor, x: string, reviver?: (this: any, key: string, value: any) => any): any
    {
        return this.deserialize(typeCtor, JSON.parse(x, reviver));
    }

    /**
     * Serializes provided value.
     * 
     * @param {any} x Input value.
     * 
     * @returns {any} Object created from provided input value. 
     */
    public serialize(x: any): any 
    {
        return this.typeMetadata.typeSerializer.serialize(x, this.typeMetadata);
    }

    /**
     * Deserializes provided value.
     * 
     * @param {any} x Input value.
     * 
     * @returns {any} Type created from provided input value. 
     */
    public deserialize(x: any): any
    {
        return this.typeMetadata.typeSerializer.deserialize(x, this.typeMetadata);
    }

    /**
     * Converts provided value to a JavaScript Object Notation (JSON) string.
     * 
     * @param {any} x Input value, usually an object or array, to be converted.
     * @param {Function|number[]|string[]} replacer A function that transforms the results or an array of strings and numbers that acts as an approved list.
     * @param {string|number} space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
     * 
     * @returns {string} JSON string.
     */
    public stringify(x: any, replacer?: (this: any, key: string, value: any) => any | number[] | string[] | null, space?: string | number): string
    {
        return JSON.stringify(this.serialize(x), replacer, space);
    }

    /**
     * Converts a JavaScript Object Notation (JSON) string into a type.
     * 
     * @param {any} x A valid JSON string.
     * @param {Function} reviver A function that transforms the results. This function is called for each member of the object.
     * 
     * @returns {any} Type created from provided input value.
     */
    public parse(x: string, reviver?: (this: any, key: string, value: any) => any): any
    {
        return this.deserialize(JSON.parse(x, reviver));
    }
}
