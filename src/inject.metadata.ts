import { Fn } from './utils';
import { TypeCtor } from './type.ctor';
import { TypeMetadata } from './type.metadata';
import { InjectOptions } from './inject.options';

/**
 * Main class used to describe an injection.
 * 
 * @type {InjectMetadata}
 */
export class InjectMetadata
{
    /**
     * Type metadata to which inject metadata belongs to.
     * 
     * @type {TypeMetadata}
     */
    public readonly declaringTypeMetadata: TypeMetadata;

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
     * @type {TypeCtor}
     */
    public readonly reflectTypeCtor?: TypeCtor;

    /**
     * Inject options.
     * 
     * @type {InjectOptions}
     */
    public readonly injectOptions: InjectOptions = {};

    /**
     * Constructor.
     * 
     * @param {TypeMetadata} declaringTypeMetadata Type metadata to which inject metadata belongs to.
     * @param {number} index Index of injection within a type constructor function.
     */
    public constructor(declaringTypeMetadata: TypeMetadata, index: number)
    {
        const injectTypeCtors = Fn.extractOwnReflectMetadata('design:paramtypes', declaringTypeMetadata.typeCtor.prototype) ?? [];

        this.declaringTypeMetadata = declaringTypeMetadata;
        this.index                 = index;
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
     * @returns {TypeCtor|undefined} Type constructor or undefined.
     */
    public get typeCtor(): TypeCtor | undefined
    {
        return this.injectOptions.typeCtor ?? this.reflectTypeCtor;
    }

    /**
     * Gets inject type metadata if it can be defined.
     * 
     * @returns {TypeMetadata|undefined} Type metadata or undefined.
     */
    public get typeMetadata(): TypeMetadata | undefined
    {
        const typeCtor = this.typeCtor;

        if (!Fn.isNil(typeCtor))
        {
            return this.declaringTypeMetadata.resolveTypeMetadata(typeCtor);
        }

        return undefined;
    }

    /**
     * Clones current metadata instance.
     * 
     * @returns {InjectMetadata} Clone of current metadata instance.
     */
    public clone(): InjectMetadata
    {
        const injectMetadata = new InjectMetadata(this.declaringTypeMetadata, this.index);
        const injectOptions  = Fn.assign({}, this.injectOptions);

        return injectMetadata.configure(injectOptions);
    }

    /**
     * Configures inject metadata based on provided options.
     * 
     * @param {InjectOptions} injectOptions Inject options.
     * 
     * @returns {InjectMetadata} Instance of inject metadata.
     */
    public configure(injectOptions: InjectOptions): InjectMetadata
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
