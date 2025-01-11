import { InjectMetadata } from './inject-metadata';
import { Optional } from './optional';
import { TypeArgument } from './type-argument';
import { TypeMetadata } from './type-metadata';

/**
 * Represents an inject state at a certain moment in time.
 * 
 * @type {InjectState<TDeclaringObject, TObject>}
 */
export interface InjectState<TDeclaringObject, TObject>
{
    /**
     * Inject metadata for which state is defined.
     * 
     * @type {InjectMetadata<TDeclaringObject, TObject>}
     */
    readonly injectMetadata: InjectMetadata<TDeclaringObject, TObject>;

    /**
     * Parameter key to inject within a type context.
     * 
     * @type {Optional<string>}
     */
    readonly key: Optional<string>;

    /**
     * Type argument of the injection.
     * 
     * @type {TypeArgument<TObject>}
     */
    readonly typeArgument: TypeArgument<TObject>;

    /**
     * Type metadata of the injection.
     * 
     * @type {TypeMetadata<TObject>}
     */
    readonly typeMetadata: TypeMetadata<TObject>;
}
