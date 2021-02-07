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
 * @type {TypeManager<TType>}
 */
export class TypeManager<TType>
{
    /**
     * Type metadata for provided type.
     * 
     * @type {TypeMetadata<TType>}
     */
    public readonly typeMetadata: TypeMetadata<TType>;

    /**
     * Constructor.
     * 
     * @param {TypeCtor<TType>} typeCtor Type constructor function.
     * @param {TypeOptions<TType>} typeOptions Type options binded to the instance.
     */
    public constructor(typeCtor: TypeCtor<TType>, typeOptions: TypeOptions<TType> = {})
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
     * @param {Partial<TypeOptionsBase<TType>>} typeOptionsBase Type options base.
     * 
     * @returns {void}
     */
    public static configureTypeOptionsBase<TType>(typeOptionsBase: Partial<TypeOptionsBase<TType>>): void
    {
        TypeArtisan.configureTypeOptionsBase(typeOptionsBase);

        return;
    }

    /**
     * Configures type options.
     * 
     * @param {TypeCtor<TType>} typeCtor Type constructor function.
     * @param {TypeOptions<TType>} typeOptions Type options.
     * 
     * @returns {void}
     */
    public static configureTypeOptions<TType>(typeCtor: TypeCtor<TType>, typeOptions: TypeOptions<TType>): void 
    {
        TypeArtisan.configureTypeOptions(typeCtor, typeOptions);

        return;
    }

    /**
     * Configures type options per type.
     * 
     * @param {Map<TypeCtor<TType>, TypeOptions<TType>>} typeOptionsMap Type options map.
     * 
     * @returns {void}
     */
    public static configureTypeOptionsMap<TType>(typeOptionsMap: Map<TypeCtor<TType>, TypeOptions<TType>>): void
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
     * @param {TypeCtor<TType>} typeCtor Type constructor function.
     * @param {any} x Input value.
     * 
     * @returns {any} Object created from provided input value. 
     */
    public static serialize<TType>(typeCtor: TypeCtor<TType>, x: any): any 
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(typeCtor);

        return typeMetadata.typeSerializer.serialize(x, typeMetadata);
    }

    /**
     * Deserializes provided value based on the type constructor function.
     * 
     * @param {TypeCtor<TType>} typeCtor Type constructor function.
     * @param {any} x Input value.
     * 
     * @returns {any} Type created from provided input value. 
     */
    public static deserialize<TType>(typeCtor: TypeCtor<TType>, x: any): TType | undefined
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(typeCtor);

        return typeMetadata.typeSerializer.deserialize(x, typeMetadata);
    }

    /**
     * Converts provided value to a JavaScript Object Notation (JSON) string.
     * 
     * @param {TypeCtor<TType>} typeCtor Type constructor function.
     * @param {any} x Input value, usually an object or array, to be converted.
     * @param {Function|number[]|string[]} replacer A function that transforms the results or an array of strings and numbers that acts as an approved list.
     * @param {string|number} space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
     * 
     * @returns {string} JSON string.
     */
    public static stringify<TType>(typeCtor: TypeCtor<TType>, x: any, replacer?: (this: any, key: string, value: any) => any | number[] | string[] | null, space?: string | number): string
    {
        return JSON.stringify(this.serialize(typeCtor, x), replacer, space);
    }

    /**
     * Converts a JavaScript Object Notation (JSON) string into a type.
     * 
     * @param {TypeCtor<TType>} typeCtor Type constructor function.
     * @param {any} x A valid JSON string.
     * @param {Function} reviver A function that transforms the results. This function is called for each member of the object.
     * 
     * @returns {TType} Type created from provided input value.
     */
    public static parse<TType>(typeCtor: TypeCtor<TType>, x: string, reviver?: (this: any, key: string, value: any) => any): TType | undefined
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
    public deserialize(x: any): TType | undefined
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
