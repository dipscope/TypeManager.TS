import { Fn } from './fn';
import { InjectIndex } from './inject-index';
import { InjectOptions } from './inject-options';
import { Metadata } from './metadata';
import { TypeFn } from './type-fn';
import { TypeMetadata } from './type-metadata';

/**
 * Main class used to describe an injection.
 * 
 * @type {InjectMetadata<TDeclaringType, TType>}
 */
export class InjectMetadata<TDeclaringType, TType> extends Metadata
{
    /**
     * Type metadata to which inject metadata belongs to.
     * 
     * @type {TypeMetadata<TDeclaringType>}
     */
    public readonly declaringTypeMetadata: TypeMetadata<TDeclaringType>;

    /**
     * Type function defined using reflect metadata.
     * 
     * Used as a fallback when type function is not defined.
     * 
     * @type {TypeFn<TType>}
     */
    public readonly reflectTypeFn: TypeFn<TType>;

    /**
     * Index of injection within a type constructor function.
     * 
     * @type {InjectIndex}
     */
    public readonly injectIndex: InjectIndex;

    /**
     * Inject options.
     * 
     * @type {InjectOptions<TType>}
     */
    public readonly injectOptions: InjectOptions<TType>;

    /**
     * Constructor.
     * 
     * @param {TypeMetadata<TDeclaringType>} declaringTypeMetadata Type metadata to which inject metadata belongs to.
     * @param {InjectIndex} injectIndex Index of injection within a type constructor function.
     * @param {InjectOptions<TType>} injectOptions Inject options.
     */
    public constructor(declaringTypeMetadata: TypeMetadata<TDeclaringType>, injectIndex: InjectIndex, injectOptions: InjectOptions<TType>)
    {
        super(declaringTypeMetadata.typeMetadataResolver);

        this.declaringTypeMetadata = declaringTypeMetadata;
        this.reflectTypeFn         = (Fn.extractOwnReflectMetadata('design:paramtypes', declaringTypeMetadata.typeFn) ?? [])[injectIndex];
        this.injectIndex           = injectIndex;
        this.injectOptions         = injectOptions;

        return;
    }

    /**
     * Gets key.
     * 
     * @returns {string|undefined} Key or undefined.
     */
    public get key(): string | undefined
    {
        return this.injectOptions.key;
    }

    /**
     * Gets type function.
     * 
     * @returns {TypeFn<TType>|undefined} Type constructor or undefined.
     */
    public get typeFn(): TypeFn<TType> | undefined
    {
        return this.injectOptions.typeFn ?? this.reflectTypeFn;
    }

    /**
     * Gets inject type metadata.
     * 
     * @returns {TypeMetadata<TType>} Type metadata.
     */
    public get typeMetadata(): TypeMetadata<TType>
    {
        const typeFn = this.typeFn;

        if (Fn.isNil(typeFn))
        {
            throw new Error(`${this.declaringTypeMetadata.typeName}[${this.injectIndex}]: Cannot resolve constructor injection type metadata! This is usually caused by invalid configuration!`);
        }

        return this.defineTypeMetadata(typeFn);
    }

    /**
     * Configures inject metadata based on provided options.
     * 
     * @param {InjectOptions<TType>} injectOptions Inject options.
     * 
     * @returns {InjectMetadata<TDeclaringType, TType>} Instance of inject metadata.
     */
    public configure(injectOptions: InjectOptions<TType>): InjectMetadata<TDeclaringType, TType>
    {
        if (!Fn.isUndefined(injectOptions.key))
        {
            this.injectOptions.key = injectOptions.key;
        }

        if (!Fn.isUndefined(injectOptions.typeFn)) 
        {
            this.injectOptions.typeFn = injectOptions.typeFn;
        }

        return this;
    }
}
