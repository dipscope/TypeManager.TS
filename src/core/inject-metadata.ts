import { Fn } from './fn';
import { InjectOptions } from './inject-options';
import { Metadata } from './metadata';
import { TypeCtor } from './type-ctor';
import { TypeMetadata } from './type-metadata';
import { TypeMetadataResolver } from './type-metadata-resolver';

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
     * Type of injection defined using reflect metadata.
     * 
     * Used as a fallback when type constructor is not defined.
     * 
     * @type {TypeCtor<TType>}
     */
    public readonly reflectTypeCtor?: TypeCtor<TType>;

    /**
     * Inject options.
     * 
     * @type {InjectOptions<TType>}
     */
    public readonly injectOptions: InjectOptions<TType>;

    /**
     * Constructor.
     * 
     * @param {TypeMetadataResolver<any>} typeMetadataResolver Type metadata resolver.
     * @param {TypeMetadata<TDeclaringType>} declaringTypeMetadata Type metadata to which inject metadata belongs to.
     * @param {number} index Index of injection within a type constructor function.
     * @param {InjectOptions<TType>} injectOptions Inject options.
     */
    public constructor(typeMetadataResolver: TypeMetadataResolver<any>, declaringTypeMetadata: TypeMetadata<TDeclaringType>, index: number, injectOptions: InjectOptions<TType>)
    {
        super(typeMetadataResolver);

        // TODO: Check. May not be applied. If so then remove this reflect and configure on type metadata level. Assign typeCtor if it is empty.
        const injectTypeCtors = (Fn.extractOwnReflectMetadata('design:paramtypes', declaringTypeMetadata.typeCtor) ?? []) as TypeCtor<any>[];

        this.declaringTypeMetadata = declaringTypeMetadata;
        this.index                 = index;
        this.reflectTypeCtor       = injectTypeCtors[index];
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
     * Sets key.
     * 
     * @returns Nothing.
     */
    public set key(key: string | undefined)
    {
        this.injectOptions.key = key;

        return;
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
     * Sets type constructor.
     * 
     * @returns Nothing.
     */
    public set typeCtor(typeCtor: TypeCtor<TType> | undefined)
    {
        this.injectOptions.typeCtor = typeCtor;

        return;
    }

    /**
     * Gets inject type metadata if it can be defined.
     * 
     * @returns {TypeMetadata<TType>|undefined} Type metadata or undefined.
     */
    public get typeMetadata(): TypeMetadata<TType> | undefined
    {
        const typeCtor = this.typeCtor;

        if (!Fn.isNil(typeCtor))
        {
            return this.defineTypeMetadata(typeCtor);
        }

        return undefined;
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
            this.key = injectOptions.key;
        }

        if (!Fn.isUndefined(injectOptions.typeCtor)) 
        {
            this.typeCtor = injectOptions.typeCtor;
        }

        return this;
    }
}
