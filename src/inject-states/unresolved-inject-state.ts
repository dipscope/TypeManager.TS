import { InjectMetadata } from '../inject-metadata';
import { InjectState } from '../inject-state';
import { Optional } from '../optional';
import { TypeArgument } from '../type-argument';
import { TypeMetadata } from '../type-metadata';
import { ResolvedInjectState } from './resolved-inject-state';

/**
 * Represents unresolved inject state.
 * 
 * @type {ResolvedInjectState<TDeclaringObject, TObject>}
 */
export class UnresolvedInjectState<TDeclaringObject, TObject> implements InjectState<TDeclaringObject, TObject>
{
    /**
     * Inject metadata for which state is defined.
     * 
     * @type {InjectMetadata<TDeclaringObject, TObject>}
     */
    public readonly injectMetadata: InjectMetadata<TDeclaringObject, TObject>;
    
    /**
     * Resolved inject state.
     * 
     * @type {ResolvedInjectState<TDeclaringObject, TObject>}
     */
    private resolvedInjectState?: ResolvedInjectState<TDeclaringObject, TObject>;

    /**
     * Constructor.
     * 
     * @param {InjectMetadata<TDeclaringObject, TObject>} injectMetadata Inject metadata for which state is defined.
     */
    public constructor(injectMetadata: InjectMetadata<TDeclaringObject, TObject>)
    {
        this.injectMetadata = injectMetadata;

        return;
    }

    /**
     * Gets parameter key to inject within a type context.
     * 
     * @returns {Optional<string>} Key.
     */
    public get key(): Optional<string>
    {
        let resolvedInjectState = this.resolvedInjectState;

        if (resolvedInjectState === undefined)
        {
            resolvedInjectState = this.injectMetadata.resolveInjectState();

            this.resolvedInjectState = resolvedInjectState;
        }

        return resolvedInjectState.key;
    }

    /**
     * Gets type argument of the injection.
     * 
     * @type {TypeArgument<TObject>} Type argument.
     */
    public get typeArgument(): TypeArgument<TObject>
    {
        let resolvedInjectState = this.resolvedInjectState;

        if (resolvedInjectState === undefined)
        {
            resolvedInjectState = this.injectMetadata.resolveInjectState();

            this.resolvedInjectState = resolvedInjectState;
        }

        return resolvedInjectState.typeArgument;
    }

    /**
     * Gets type metadata of the injection.
     * 
     * @type {TypeMetadata<TObject>} Type metadata.
     */
    public get typeMetadata(): TypeMetadata<TObject>
    {
        let resolvedInjectState = this.resolvedInjectState;

        if (resolvedInjectState === undefined)
        {
            resolvedInjectState = this.injectMetadata.resolveInjectState();

            this.resolvedInjectState = resolvedInjectState;
        }

        return resolvedInjectState.typeMetadata;
    }
}
