import { Fn } from './utils';
import { TypeCtor } from './type.ctor';
import { TypeMetadata } from './type.metadata';
import { InjectOptions } from './inject.options';

/**
 * Main class used to describe an injection.
 * 
 * @type {InjectMetadata<TDeclaringType, TType>}
 */
export class InjectMetadata<TDeclaringType, TType>
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
     * @param {TypeMetadata<TDeclaringType>} declaringTypeMetadata Type metadata to which inject metadata belongs to.
     * @param {number} index Index of injection within a type constructor function.
     * @param {InjectOptions<TType>} injectOptions Inject options.
     */
    public constructor(declaringTypeMetadata: TypeMetadata<TDeclaringType>, index: number, injectOptions: InjectOptions<TType>)
    {
        const injectTypeCtors = Fn.extractOwnReflectMetadata('design:paramtypes', declaringTypeMetadata.typeCtor) ?? [];

        this.declaringTypeMetadata = declaringTypeMetadata;
        this.index                 = index;
        this.injectOptions         = injectOptions;
        this.reflectTypeCtor       = injectTypeCtors[index];

        return;
    }

    /**
     * Gets current key.
     * 
     * @returns {string|undefined} Key or undefined.
     */
    public get key(): string | undefined
    {
        return this.injectOptions.key;
    }

    /**
     * Gets current type constructor.
     * 
     * @returns {TypeCtor<TType>|undefined} Type constructor or undefined.
     */
    public get typeCtor(): TypeCtor<TType> | undefined
    {
        return this.injectOptions.typeCtor ?? this.reflectTypeCtor;
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
            return this.declaringTypeMetadata.typeMetadataResolver(typeCtor);
        }

        return undefined;
    }

    /**
     * Clones current metadata instance.
     * 
     * @returns {InjectMetadata<TDeclaringType, TType>} Clone of current metadata instance.
     */
    public clone(): InjectMetadata<TDeclaringType, TType>
    {
        const injectOptions  = Fn.assign({}, this.injectOptions);
        const injectMetadata = new InjectMetadata<TDeclaringType, TType>(this.declaringTypeMetadata, this.index, injectOptions);
        
        return injectMetadata;
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
