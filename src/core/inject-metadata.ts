import { Fn } from './fn';
import { InjectOptions } from './inject-options';
import { Metadata } from './metadata';
import { TypeCtor } from './type-ctor';
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
     * Index of injection within a type constructor function.
     * 
     * @type {number}
     */
    public readonly index: number;

    /**
     * Type constructor defined using reflect metadata.
     * 
     * Used as a fallback when type constructor is not defined.
     * 
     * @type {TypeCtor<TType>}
     */
    public readonly reflectTypeCtor: TypeCtor<TType>;

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
     * @param {number} index Index of injection within a type constructor function.
     * @param {InjectOptions<TType>} injectOptions Inject options.
     */
    public constructor(declaringTypeMetadata: TypeMetadata<TDeclaringType>, index: number, injectOptions: InjectOptions<TType>)
    {
        super(declaringTypeMetadata.typeMetadataResolver);

        this.declaringTypeMetadata = declaringTypeMetadata;
        this.index                 = index;
        this.reflectTypeCtor       = (Fn.extractOwnReflectMetadata('design:paramtypes', declaringTypeMetadata.typeCtor) ?? [])[index];
        this.injectOptions         = {};

        this.configure(injectOptions);

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
     * Gets type constructor.
     * 
     * @returns {TypeCtor<TType>|undefined} Type constructor or undefined.
     */
    public get typeCtor(): TypeCtor<TType> | undefined
    {
        return this.injectOptions.typeCtor ?? this.reflectTypeCtor;
    }

    /**
     * Gets inject type metadata.
     * 
     * @returns {TypeMetadata<TType>} Type metadata.
     */
    public get typeMetadata(): TypeMetadata<TType>
    {
        const typeCtor = this.typeCtor;

        if (Fn.isNil(typeCtor))
        {
            throw new Error(`${this.declaringTypeMetadata.name}[${this.index}]: Cannot resolve constructor injection type metadata! This is usually caused by invalid configuration!`);
        }

        return this.defineTypeMetadata(typeCtor);
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

        if (!Fn.isUndefined(injectOptions.typeCtor)) 
        {
            this.injectOptions.typeCtor = injectOptions.typeCtor;
        }

        return this;
    }
}
