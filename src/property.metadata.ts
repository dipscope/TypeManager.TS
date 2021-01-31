import { Fn } from './utils';
import { TypeResolver } from './type.resolver';
import { TypeSerializer } from './type.serializer';
import { TypeInjector } from './type.injector';
import { TypeFactory } from './type.factory';
import { TypeMetadata } from './type.metadata';
import { PropertyOptions } from './property.options';

/**
 * Main class used to describe certain property.
 * 
 * @type {PropertyMetadata}
 */
export class PropertyMetadata
{
    /**
     * Property alias.
     * 
     * Used if property name in object differs from declared for type.
     * 
     * @type {string}
     */
    public alias?: string;

    /**
     * Type metadata to which property metadata belongs to.
     * 
     * @type {TypeMetadata}
     */
    public declaringTypeMetadata: TypeMetadata;

    /**
     * Default value for undefined ones.
     * 
     * Assigned only when use default value option is true.
     * 
     * @type {any}
     */
    public defaultValue?: any;

    /**
     * Deserializable from object?
     * 
     * @type {boolean}
     */
    public deserializable?: boolean;

    /**
     * Multiple property?
     * 
     * @type {boolean}
     */
    public multiple?: boolean;

    /**
     * Property name as declared in type.
     * 
     * @type {string}
     */
    public name: string;

    /**
     * Use default value assignment for undefined values?
     * 
     * @type {boolean}
     */
    public useDefaultValue?: boolean;

    /**
     * Use implicit conversion when provided value can be converted
     * to the target one?
     * 
     * @type {boolean}
     */
    public useImplicitConversion?: boolean;

    /**
     * Type resolver defined using reflect metadata.
     * 
     * Used as a fallback when type resolver is not defined.
     * 
     * @type {TypeResolver}
     */
    public reflectTypeResolver: TypeResolver;

    /**
     * Serializable to object?
     * 
     * @type {boolean}
     */
    public serializable?: boolean;

    /**
     * Type alias.
     * 
     * @type {string}
     */
    public typeAlias?: string;

    /**
     * Type factory used to build instances of type.
     * 
     * @type {TypeFactory}
     */
    public typeFactory?: TypeFactory;

    /**
     * Type injector used to resolve types.
     * 
     * @type {TypeInjector}
     */
    public typeInjector?: TypeInjector;

    /**
     * Type resolver to get a property type.
     * 
     * @type {TypeResolver}
     */
    public typeResolver?: TypeResolver;

    /**
     * Custom property type serializer.
     * 
     * Used to override default one.
     * 
     * @type {TypeSerializer}
     */
    public typeSerializer?: TypeSerializer;

    /**
     * Constructor.
     * 
     * @param {TypeMetadata} declaringTypeMetadata Type metadata to which property metadata belongs to.
     * @param {string} name Property name.
     */
    public constructor(declaringTypeMetadata: TypeMetadata, name: string)
    {
        const propertyTypeCtor = Fn.extractReflectMetadata('design:type', declaringTypeMetadata.typeCtor.prototype, name);

        this.declaringTypeMetadata = declaringTypeMetadata;
        this.multiple              = propertyTypeCtor === Array;
        this.name                  = name;
        this.reflectTypeResolver   = () => propertyTypeCtor;

        return;
    }

    /**
     * Checks if serialization configured.
     * 
     * @returns {boolean} True when serialization configured. False otherwise.
     */
    public get serializationConfigured(): boolean
    {
        return !Fn.isNil(this.serializable) || !Fn.isNil(this.deserializable);
    }

    /**
     * Gets property type metadata if it can be defined.
     * 
     * @returns {TypeMetadata|undefined} Type metadata or undefined.
     */
    public get typeMetadata(): TypeMetadata | undefined
    {
        const typeResolver = this.typeResolver ?? this.reflectTypeResolver;
        const typeCtor     = typeResolver();

        if (!Fn.isNil(typeCtor))
        {
            return this.declaringTypeMetadata.resolveTypeMetadata(typeCtor);
        }

        return undefined;
    }

    /**
     * Configures property metadata based on provided options.
     * 
     * @param {PropertyOptions} propertyOptions Property options.
     * 
     * @returns {PropertyMetadata} Instance of property metadata.
     */
    public configure(propertyOptions: PropertyOptions): PropertyMetadata
    {
        if (!Fn.isUndefined(propertyOptions.alias))
        {
            this.alias = propertyOptions.alias;
        }

        if (!Fn.isUndefined(propertyOptions.defaultValue)) 
        {
            this.defaultValue = propertyOptions.defaultValue;
        }

        if (!Fn.isUndefined(propertyOptions.deserializable))
        {
            this.deserializable = propertyOptions.deserializable;
        }

        if (!Fn.isUndefined(propertyOptions.multiple))
        {
            this.multiple = propertyOptions.multiple;
        }

        if (!Fn.isUndefined(propertyOptions.useDefaultValue)) 
        {
            this.useDefaultValue = propertyOptions.useDefaultValue;
        }

        if (!Fn.isUndefined(propertyOptions.useImplicitConversion)) 
        {
            this.useImplicitConversion = propertyOptions.useImplicitConversion;
        }

        if (!Fn.isUndefined(propertyOptions.typeAlias)) 
        {
            this.typeAlias = propertyOptions.typeAlias;
        }

        if (!Fn.isUndefined(propertyOptions.serializable)) 
        {
            this.serializable = propertyOptions.serializable;
        }

        if (!Fn.isUndefined(propertyOptions.typeFactory))
        {
            this.typeFactory = propertyOptions.typeFactory;
        }

        if (!Fn.isUndefined(propertyOptions.typeInjector))
        {
            this.typeInjector = propertyOptions.typeInjector;
        }

        if (!Fn.isUndefined(propertyOptions.typeResolver))
        {
            this.typeResolver = propertyOptions.typeResolver;
        }

        if (!Fn.isUndefined(propertyOptions.typeSerializer)) 
        {
            this.typeSerializer = propertyOptions.typeSerializer;
        }

        return this;
    }
}
