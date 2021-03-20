import { InjectIndex } from './core/inject-index';
import { InjectMetadata } from './core/inject-metadata';
import { InjectOptions } from './core/inject-options';
import { TypeCtor } from './core/type-ctor';
import { TypeArtisan } from './type-artisan';

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
     * @param {TypeCtor<TDeclaringType>} declaringTypeCtor Declaring type constructor function.
     * @param {InjectIndex} injectIndex Inject index.
     * @param {InjectOptions<TType>} injectOptions Inject options.
     * 
     * @returns {InjectMetadata<TDeclaringType, TType>} Inject metadata for provided type constructor.
     */
    public static defineInjectMetadata<TDeclaringType, TType>(
        declaringTypeCtor: TypeCtor<TDeclaringType>, 
        injectIndex: InjectIndex,
        injectOptions: InjectOptions<TType>
    ): InjectMetadata<TDeclaringType, TType>
    {
        const typeMetadata   = TypeArtisan.defineTypeMetadata(declaringTypeCtor);
        const injectMetadata = typeMetadata.configureInjectMetadata(injectIndex, injectOptions);

        return injectMetadata;
    }
}
