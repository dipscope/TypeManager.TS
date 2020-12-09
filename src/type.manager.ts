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
        if (!Fn.isNil(typeManagerOptions.logLevel))
        {
            Log.logLevel = typeManagerOptions.logLevel;
        }

        if (!Fn.isNil(typeManagerOptions.typeOptionsMap)) 
        {
            typeManagerOptions.typeOptionsMap.forEach((typeOptions, typeCtor) => 
            {
                TypeArtisan.typeOptionsMap.set(typeCtor, typeOptions);
            });
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
}
