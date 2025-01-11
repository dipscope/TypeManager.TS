import { InjectMetadata } from '../inject-metadata';
import { InjectState } from '../inject-state';
import { Optional } from '../optional';
import { TypeArgument } from '../type-argument';
import { TypeMetadata } from '../type-metadata';

/**
 * Represents resolved inject state.
 * 
 * @type {ResolvedInjectState<TDeclaringObject, TObject>}
 */
export class ResolvedInjectState<TDeclaringObject, TObject> implements InjectState<TDeclaringObject, TObject>
{
    /**
     * Inject metadata for which state is defined.
     * 
     * @type {InjectMetadata<TDeclaringObject, TObject>}
     */
    public readonly injectMetadata: InjectMetadata<TDeclaringObject, TObject>;

    /**
     * Parameter key to inject within a type context.
     * 
     * @type {Optional<string>}
     */
    public readonly key: Optional<string>;

    /**
     * Type argument of the injection.
     * 
     * @type {TypeArgument<TObject>}
     */
    public readonly typeArgument: TypeArgument<TObject>;

    /**
     * Type metadata of the injection.
     * 
     * @type {TypeMetadata<TObject>}
     */
    public readonly typeMetadata: TypeMetadata<TObject>;

    /**
     * Constructor.
     * 
     * @param {InjectMetadata<TDeclaringObject, TObject>} injectMetadata Inject metadata for which state is defined.
     * @param {Optional<string>} key Parameter key to inject within a type context.
     * @param {TypeArgument<TObject>} typeArgument Type argument of the injection.
     * @param {TypeMetadata<TObject>} typeMetadata Type metadata of the injection.
     */
    public constructor(
        injectMetadata: InjectMetadata<TDeclaringObject, TObject>,
        key: Optional<string>,
        typeArgument: TypeArgument<TObject>,
        typeMetadata: TypeMetadata<TObject>
    )
    {
        this.injectMetadata = injectMetadata;
        this.key = key;
        this.typeArgument = typeArgument;
        this.typeMetadata = typeMetadata;

        return;
    }
}
