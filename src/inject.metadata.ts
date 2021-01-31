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
    public declaringTypeMetadata: TypeMetadata;

    /**
     * Index of injection within a type constructor function.
     * 
     * @type {number}
     */
    public index: number;

    /**
     * Parameter key to inject within a type context. If specified
     * type constructor will be ignored.
     * 
     * @type {string}
     */
    public key?: string;

    /**
     * Type of injection defined using reflect metadata.
     * 
     * Used as a fallback when type constructor is not defined.
     * 
     * @type {TypeCtor}
     */
    public reflectTypeCtor?: TypeCtor;

    /**
     * Type of injection. Used if key is not specified. Will be resolved using 
     * type injector.
     * 
     * @type {TypeCtor}
     */
    public typeCtor?: TypeCtor; 

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
     * Gets inject type metadata if it can be defined.
     * 
     * @returns {TypeMetadata|undefined} Type metadata or undefined.
     */
    public get typeMetadata(): TypeMetadata | undefined
    {
        const typeCtor = this.typeCtor ?? this.reflectTypeCtor;

        if (!Fn.isNil(typeCtor))
        {
            return this.declaringTypeMetadata.resolveTypeMetadata(typeCtor);
        }

        return undefined;
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
            this.key = injectOptions.key;
        }

        if (!Fn.isUndefined(injectOptions.typeCtor)) 
        {
            this.typeCtor = injectOptions.typeCtor;
        }

        return this;
    }
}
