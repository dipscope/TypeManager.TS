import { TypeCtor } from './type.ctor';
import { TypeArtisan } from './type.artisan';
import { TypeDeclaration } from './type.declaration';
import { InjectOptions } from './inject.options';
import { InjectMetadata } from './inject.metadata';

/**
 * Inject artisan class to encapsulate injection manipulating functions.
 * 
 * @type {InjectArtisan}
 */
export class InjectArtisan
{
    /**
     * Defines inject metadata for a certain type constructor.
     * 
     * @param {TypeCtor} declaringTypeCtor Declaring type constructor function.
     * @param {number} injectIndex Inject index.
     * @param {InjectOptions} injectOptions Inject options.
     * 
     * @returns {InjectMetadata} Inject metadata for provided type constructor.
     */
    public static defineInjectMetadata(declaringTypeCtor: TypeCtor, injectIndex: number, injectOptions: InjectOptions): InjectMetadata
    {
        const typeMetadata   = TypeArtisan.defineTypeMetadata(declaringTypeCtor, {}, TypeDeclaration.Implicit);
        const injectMetadata = typeMetadata.configureInjectMetadata(injectIndex, injectOptions);

        return injectMetadata;
    }
}
