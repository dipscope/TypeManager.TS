import { Fn, Log } from './utils';
import { TypeMetadata } from './type.metadata';
import { TypeManagerOptions } from './type.manager.options';
import { TypeCtor } from './type.ctor';
import { TypeArtisan } from './type.artisan';

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
    private readonly typeMetadata: TypeMetadata;

    /**
     * Constructor.
     * 
     * @param {TypeCtor} typeCtor Type constructor function.
     */
    public constructor(typeCtor: TypeCtor)
    {
        this.typeMetadata = TypeArtisan.extractTypeMetadata(typeCtor);

        if (this.typeMetadata.declaredImplicitly && Log.errorEnabled)
        {
            Log.error(`${Fn.nameOf(typeCtor)}: cannot build implicitly declared type! Declare a type using decorator or configure function!`);
        }
        
        return;
    }

    /**
     * Configures internal objects explicitly.
     * 
     * @param {TypeManagerOptions} typeManagerOptions Type manager options.
     * 
     * @returns {void}
     */
    public static configure(typeManagerOptions: TypeManagerOptions): void
    {
        if (!Fn.isUndefined(typeManagerOptions.logLevel))
        {
            Log.logLevel = typeManagerOptions.logLevel;
        }

        if (!Fn.isUndefined(typeManagerOptions.typeOptions)) 
        {
            TypeArtisan.configureTypeOptions(typeManagerOptions.typeOptions);
        }

        if (!Fn.isUndefined(typeManagerOptions.typeOptionsMap)) 
        {
            TypeArtisan.configureTypeOptionsMap(typeManagerOptions.typeOptionsMap);
        }

        return;
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
        return this.typeMetadata.typeSerializer.serialize(x);
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
        return this.typeMetadata.typeSerializer.deserialize(x);
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
