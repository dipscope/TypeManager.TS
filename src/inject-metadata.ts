import { Alias } from './alias';
import { EMPTY_ARRAY } from './constants/empty-array';
import { getOwnReflectMetadata } from './functions/get-own-reflect-metadata';
import { InjectIndex } from './inject-index';
import { InjectOptions } from './inject-options';
import { InjectState } from './inject-state';
import { ResolvedInjectState } from './inject-states/resolved-inject-state';
import { UnresolvedInjectState } from './inject-states/unresolved-inject-state';
import { Metadata } from './metadata';
import { Optional } from './optional';
import { TypeArgument } from './type-argument';
import { TypeFn } from './type-fn';
import { TypeManager } from './type-manager';
import { TypeMetadata } from './type-metadata';

/**
 * Main class used to describe an injection.
 * 
 * @type {InjectMetadata<TDeclaringObject, TObject>}
 */
export class InjectMetadata<TDeclaringObject, TObject> extends Metadata
{
    /**
     * Type metadata to which inject metadata belongs to.
     * 
     * @type {TypeMetadata<TDeclaringObject>}
     */
    public readonly declaringTypeMetadata: TypeMetadata<TDeclaringObject>;

    /**
     * Index of injection within a type constructor function.
     * 
     * @type {InjectIndex}
     */
    public readonly injectIndex: InjectIndex;

    /**
     * Inject options.
     * 
     * @type {InjectOptions<TObject>}
     */
    private readonly injectOptions: InjectOptions<TObject>;

    /**
     * Type function defined using reflect metadata.
     * 
     * @type {Optional<TypeFn<TObject>>}
     */
    private readonly reflectTypeFn: Optional<TypeFn<TObject>>;

    /**
     * Current inject state.
     * 
     * @type {InjectState<TDeclaringObject, TObject>}
     */
    private currentInjectState: InjectState<TDeclaringObject, TObject>;

    /**
     * Constructor.
     * 
     * @param {TypeManager} typeManager Type manager.
     * @param {ReadonlyMap<Alias, TypeFn<any>>} typeFnMap Type function map for types with aliases.
     * @param {TypeMetadata<TDeclaringObject>} declaringTypeMetadata Type metadata to which inject metadata belongs to.
     * @param {InjectIndex} injectIndex Index of injection within a type constructor function.
     * @param {InjectOptions<TObject>} injectOptions Inject options.
     */
    public constructor(
        typeManager: TypeManager, 
        typeFnMap: ReadonlyMap<Alias, TypeFn<any>>,
        declaringTypeMetadata: TypeMetadata<TDeclaringObject>, 
        injectIndex: InjectIndex,
        injectOptions: InjectOptions<TObject>
    )
    {
        super(typeManager, typeFnMap);

        this.declaringTypeMetadata = declaringTypeMetadata;
        this.injectIndex = injectIndex;
        this.injectOptions = injectOptions;
        this.reflectTypeFn = (getOwnReflectMetadata('design:paramtypes', declaringTypeMetadata.typeFn) ?? EMPTY_ARRAY)[injectIndex];
        this.currentInjectState = new UnresolvedInjectState<TDeclaringObject, TObject>(this);

        this.configure(injectOptions);

        return;
    }

    /**
     * Gets inject state.
     * 
     * @returns {InjectState<TDeclaringObject, TObject>} Inject state.
     */
    public get injectState(): InjectState<TDeclaringObject, TObject>
    {
        return this.currentInjectState;
    }

    /**
     * Gets key.
     * 
     * @returns {Optional<string>} Key or undefined.
     */
    public get key(): Optional<string>
    {
        return this.currentInjectState.key;
    }

    /**
     * Gets type argument.
     * 
     * @returns {TypeArgument<TObject>} Type argument.
     */
    public get typeArgument(): TypeArgument<TObject>
    {
        return this.currentInjectState.typeArgument;
    }

    /**
     * Gets inject type metadata.
     * 
     * @returns {TypeMetadata<TObject>} Type metadata.
     */
    public get typeMetadata(): TypeMetadata<TObject>
    {
        return this.currentInjectState.typeMetadata;
    }

    /**
     * Resolves inject state.
     * 
     * Calling this method has side effects by recomputing injection state. If you need current
     * inject state then use provided getter for that.
     * 
     * @returns {ResolvedInjectState<TDeclaringObject, TObject>} Resolved inject state.
     */
    public resolveInjectState(): ResolvedInjectState<TDeclaringObject, TObject>
    {
        const injectOptions = this.injectOptions;
        const key = injectOptions.key;
        const typeArgument = injectOptions.typeArgument === undefined ? this.reflectTypeFn : injectOptions.typeArgument;
        const typeMetadata = this.resolveTypeMetadata(typeArgument);
        const resolvedInjectState = new ResolvedInjectState<TDeclaringObject, TObject>(this, key, typeArgument, typeMetadata);

        this.currentInjectState = resolvedInjectState;

        return resolvedInjectState;
    }

    /**
     * Unresolves inject state.
     * 
     * Calling this method has side effects by resetting inject state. 
     * 
     * @returns {UnresolvedInjectState<TDeclaringObject, TObject>} Unresolved inject state.
     */
    public unresolveInjectState(): UnresolvedInjectState<TDeclaringObject, TObject>
    {
        const unresolvedInjectState = new UnresolvedInjectState<TDeclaringObject, TObject>(this);

        this.currentInjectState = unresolvedInjectState;

        return unresolvedInjectState;
    }

    /**
     * Configures key.
     * 
     * @param {Optional<string>} key Key or undefined.
     * 
     * @returns {this} Current instance of inject metadata.
     */
    public hasKey(key: Optional<string>): this
    {
        this.injectOptions.key = key;
        this.currentInjectState = new UnresolvedInjectState<TDeclaringObject, TObject>(this);

        return this;
    }

    /**
     * Configures type argument.
     * 
     * @param {Optional<TypeArgument<TObject>>} typeArgument Type argument or undefined.
     * 
     * @returns {this} Current instance of inject metadata.
     */
    public hasTypeArgument(typeArgument: Optional<TypeArgument<TObject>>): this
    {
        this.injectOptions.typeArgument = typeArgument;
        this.currentInjectState = new UnresolvedInjectState<TDeclaringObject, TObject>(this);

        return this;
    }

    /**
     * Configures inject metadata based on provided options.
     * 
     * @param {InjectOptions<TObject>} injectOptions Inject options.
     * 
     * @returns {this} Current instance of inject metadata.
     */
    public configure(injectOptions: InjectOptions<TObject>): this
    {
        if (injectOptions.key !== undefined)
        {
            this.hasKey(injectOptions.key);
        }

        if (injectOptions.typeArgument !== undefined)
        {
            this.hasTypeArgument(injectOptions.typeArgument);
        }

        return this;
    }
}
