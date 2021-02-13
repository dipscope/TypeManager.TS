import { Fn } from './utils';
import { TypeCtor } from './type.ctor';
import { TypeResolver } from './type.resolver';
import { TypeSerializer } from './type.serializer';
import { TypeSerializerContext } from './type.serializer.context';
import { TypeInjector } from './type.injector';
import { TypeFactory } from './type.factory';
import { TypeMetadata } from './type.metadata';
import { PropertyOptions } from './property.options';
import { CustomData } from './custom.data';

/**
 * Main class used to describe certain property.
 * 
 * @type {PropertyMetadata<TDeclaringType, TType>}
 */
export class PropertyMetadata<TDeclaringType, TType> implements TypeSerializerContext<TType>
{
    /**
     * Type metadata to which property metadata belongs to.
     * 
     * @type {TypeMetadata<TDeclaringType>}
     */
    public readonly declaringTypeMetadata: TypeMetadata<TDeclaringType>;

    /**
     * Property name as declared in type.
     * 
     * @type {string}
     */
    public readonly name: string;

    /**
     * Type resolver defined using reflect metadata.
     * 
     * Used as a fallback when type resolver is not defined.
     * 
     * @type {TypeResolver<TType>}
     */
    public readonly reflectTypeResolver: TypeResolver<TType>;

    /**
     * Property options.
     * 
     * @type {PropertyOptions<TType>}
     */
    public readonly propertyOptions: PropertyOptions<TType>;

    /**
     * Constructor.
     * 
     * @param {TypeMetadata<TDeclaringType>} declaringTypeMetadata Type metadata to which property metadata belongs to.
     * @param {string} name Property name.
     * @param {PropertyOptions<TType>} propertyOptions Property options.
     */
    public constructor(declaringTypeMetadata: TypeMetadata<TDeclaringType>, name: string, propertyOptions: PropertyOptions<TType>)
    {
        const propertyTypeCtor = Fn.extractReflectMetadata('design:type', declaringTypeMetadata.typeCtor.prototype, name) as TypeCtor<any>;

        this.declaringTypeMetadata = declaringTypeMetadata;
        this.name                  = name;
        this.reflectTypeResolver   = () => propertyTypeCtor;
        this.propertyOptions       = {};
        
        this.configure(propertyOptions);

        if (Fn.isUndefined(this.propertyOptions.multiple))
        {
            this.propertyOptions.multiple = propertyTypeCtor === Array;
        }

        return;
    }

    /**
     * Gets current alias.
     * 
     * @returns {string|undefined} Alias or undefined.
     */
    public get alias(): string | undefined
    {
        return this.propertyOptions.alias;
    }

    /**
     * Gets current custom data.
     * 
     * @returns {CustomData} Custom data.
     */
    public get customData(): CustomData
    {
        const customData = Fn.assign({}, this.typeMetadata?.customData ?? {});

        return Fn.assign(customData, this.propertyOptions.customData ?? {});
    }

    /**
     * Gets current default value.
     * 
     * @returns {any|undefined} Resolved default value or undefined.
     */
    public get defaultValue(): any | undefined
    {
        const defaultValue = this.multiple ? [] : (this.propertyOptions.defaultValue ?? this.typeMetadata?.defaultValue);

        if (this.useDefaultValue)
        {
            return Fn.isFunction(defaultValue) ? defaultValue() : defaultValue;
        }

        return undefined;
    }

    /**
     * Gets current deserializable value.
     * 
     * @returns {boolean} True when property is deserializable. False otherwise.
     */
    public get deserializable(): boolean | undefined
    {
        return this.propertyOptions.deserializable;
    }

    /**
     * Gets current multiple value.
     * 
     * @returns {boolean} Multiple value or undefined.
     */
    public get multiple(): boolean | undefined
    {
        return this.propertyOptions.multiple;
    }

    /**
     * Gets metadata path for logging.
     * 
     * @returns {string}
     */
    public get path(): string
    {
        return `${this.declaringTypeMetadata.name}.${this.name}`;
    }

    /**
     * Gets context property metadata.
     * 
     * @returns {PropertyMetadata<TDeclaringType, TType> | undefined}
     */
    public get propertyMetadata(): PropertyMetadata<TDeclaringType, TType> | undefined
    {
        return this;
    }

    /**
     * Gets current serializable value.
     * 
     * @returns {boolean} True when property is serializable. False otherwise.
     */
    public get serializable(): boolean | undefined
    {
        return this.propertyOptions.serializable;
    }

    /**
     * Checks if serialization configured.
     * 
     * @returns {boolean} True when serialization configured. False otherwise.
     */
    public get serializationConfigured(): boolean
    {
        return !Fn.isNil(this.propertyOptions.serializable) || !Fn.isNil(this.propertyOptions.deserializable);
    }

    /**
     * Gets current type alias.
     * 
     * @returns {string|undefined} Type alias or undefined.
     */
    public get typeAlias(): string | undefined
    {
        return this.propertyOptions.typeAlias;
    }

    /**
     * Gets current type factory.
     * 
     * @returns {TypeFactory<TType>|undefined} Type factory or undefined.
     */
    public get typeFactory(): TypeFactory<TType> | undefined
    {
        return this.propertyOptions.typeFactory ?? this.typeMetadata?.typeFactory;
    }

    /**
     * Gets current type injector.
     * 
     * @returns {TypeInjector|undefined} Type injector or undefined.
     */
    public get typeInjector(): TypeInjector | undefined
    {
        return this.propertyOptions.typeInjector ?? this.typeMetadata?.typeInjector;
    }

    /**
     * Gets property type metadata if it can be defined.
     * 
     * @returns {TypeMetadata<TType>|undefined} Type metadata or undefined.
     */
    public get typeMetadata(): TypeMetadata<TType> | undefined
    {
        const typeCtor = this.typeResolver();

        if (!Fn.isNil(typeCtor))
        {
            return this.declaringTypeMetadata.typeMetadataResolver(typeCtor);
        }

        return undefined;
    }

    /**
     * Gets current type resolver.
     * 
     * @type {TypeResolver<TType>} Type resolver or undefined.
     */
    public get typeResolver(): TypeResolver<TType> 
    {
        return this.propertyOptions.typeResolver ?? this.reflectTypeResolver;
    }

    /**
     * Gets current type serializer.
     * 
     * @returns {TypeSerializer<TType>|undefined} Type serializer or undefined.
     */
    public get typeSerializer(): TypeSerializer<TType> | undefined
    {
        return this.propertyOptions.typeSerializer ?? this.typeMetadata?.typeSerializer;
    }

    /**
     * Gets indicator if default value should be used.
     * 
     * @returns {boolean} True when property should use default value. False otherwise.
     */
    public get useDefaultValue(): boolean | undefined
    {
        return this.propertyOptions.useDefaultValue ?? this.typeMetadata?.useDefaultValue;
    }

    /**
     * Gets indicator if implicit conversion should be used.
     * 
     * @returns {boolean} True when property should use implicit conversion. False otherwise.
     */
    public get useImplicitConversion(): boolean | undefined
    {
        return this.propertyOptions.useImplicitConversion ?? this.typeMetadata?.useImplicitConversion;
    }

    /**
     * Clones current metadata instance.
     * 
     * @returns {PropertyMetadata<TDeclaringType, TType>} Clone of current metadata instance.
     */
    public clone(): PropertyMetadata<TDeclaringType, TType>
    {
        const propertyOptions  = Fn.assign({}, this.propertyOptions) as PropertyOptions<TType>;
        const propertyMetadata = new PropertyMetadata(this.declaringTypeMetadata, this.name, propertyOptions);
        
        return propertyMetadata;
    }

    /**
     * Configures property options custom data.
     * 
     * @param {CustomData} customData Custom data.
     * 
     * @returns {PropertyMetadata<TDeclaringType, TType>} Configured property metadata.
     */
    public configurePropertyOptionsCustomData(customData: CustomData): PropertyMetadata<TDeclaringType, TType>
    {
        if (Fn.isNil(this.propertyOptions.customData))
        {
            this.propertyOptions.customData = {};
        }

        Fn.assign(this.propertyOptions.customData, customData);

        return this;
    }

    /**
     * Configures property metadata based on provided options.
     * 
     * @param {PropertyOptions<TType>} propertyOptions Property options.
     * 
     * @returns {PropertyMetadata<TDeclaringType, TType>} Instance of property metadata.
     */
    public configure(propertyOptions: PropertyOptions<TType>): PropertyMetadata<TDeclaringType, TType>
    {
        if (!Fn.isUndefined(propertyOptions.alias))
        {
            this.propertyOptions.alias = propertyOptions.alias;
        }

        if (!Fn.isUndefined(propertyOptions.customData))
        {
            this.configurePropertyOptionsCustomData(propertyOptions.customData);
        }

        if (!Fn.isUndefined(propertyOptions.defaultValue)) 
        {
            this.propertyOptions.defaultValue = propertyOptions.defaultValue;
        }

        if (!Fn.isUndefined(propertyOptions.deserializable))
        {
            this.propertyOptions.deserializable = propertyOptions.deserializable;
        }

        if (!Fn.isUndefined(propertyOptions.multiple))
        {
            this.propertyOptions.multiple = propertyOptions.multiple;
        }

        if (!Fn.isUndefined(propertyOptions.useDefaultValue)) 
        {
            this.propertyOptions.useDefaultValue = propertyOptions.useDefaultValue;
        }

        if (!Fn.isUndefined(propertyOptions.useImplicitConversion)) 
        {
            this.propertyOptions.useImplicitConversion = propertyOptions.useImplicitConversion;
        }

        if (!Fn.isUndefined(propertyOptions.typeAlias)) 
        {
            this.propertyOptions.typeAlias = propertyOptions.typeAlias;
        }

        if (!Fn.isUndefined(propertyOptions.serializable)) 
        {
            this.propertyOptions.serializable = propertyOptions.serializable;
        }

        if (!Fn.isUndefined(propertyOptions.typeFactory))
        {
            this.propertyOptions.typeFactory = propertyOptions.typeFactory;
        }

        if (!Fn.isUndefined(propertyOptions.typeInjector))
        {
            this.propertyOptions.typeInjector = propertyOptions.typeInjector;
        }

        if (!Fn.isUndefined(propertyOptions.typeResolver))
        {
            this.propertyOptions.typeResolver = propertyOptions.typeResolver;
        }

        if (!Fn.isUndefined(propertyOptions.typeSerializer)) 
        {
            this.propertyOptions.typeSerializer = propertyOptions.typeSerializer;
        }

        return this;
    }
}
