import { Alias } from './alias';
import { CustomData } from './custom-data';
import { Factory } from './factory';
import { Fn } from './fn';
import { GenericArgument } from './generic-argument';
import { GenericMetadata } from './generic-metadata';
import { Injector } from './injector';
import { Log } from './log';
import { Metadata } from './metadata';
import { NamingConvention } from './naming-convention';
import { PropertyOptions } from './property-options';
import { Serializer } from './serializer';
import { SerializerContext } from './serializer-context';
import { SerializerContextOptions } from './serializer-context-options';
import { TypeArgument } from './type-argument';
import { TypeCtor } from './type-ctor';
import { TypeMetadata } from './type-metadata';
import { TypeMetadataResolver } from './type-metadata-resolver';
import { TypeResolver } from './type-resolver';

/**
 * Main class used to describe a certain property.
 * 
 * @type {PropertyMetadata<TDeclaringType, TType>}
 */
export class PropertyMetadata<TDeclaringType, TType> extends Metadata
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
     * @param {TypeMetadataResolver<any>} typeMetadataResolver Type metadata resolver.
     * @param {TypeMetadata<TDeclaringType>} declaringTypeMetadata Type metadata to which property metadata belongs to.
     * @param {string} name Property name.
     * @param {PropertyOptions<TType>} propertyOptions Property options.
     */
    public constructor(typeMetadataResolver: TypeMetadataResolver<any>, declaringTypeMetadata: TypeMetadata<TDeclaringType>, name: string, propertyOptions: PropertyOptions<TType>)
    {
        super(typeMetadataResolver);

        const typeCtor = Fn.extractReflectMetadata('design:type', declaringTypeMetadata.typeCtor.prototype, name) as TypeCtor<any>;

        this.declaringTypeMetadata = declaringTypeMetadata;
        this.name                  = name;
        this.reflectTypeResolver   = () => typeCtor;
        this.propertyOptions       = {};
        
        this.configure(propertyOptions);

        return;
    }

    /**
     * Gets alias.
     * 
     * @returns {Alias|undefined} Alias or undefined.
     */
    public get alias(): Alias | undefined
    {
        return this.propertyOptions.alias;
    }

    /**
     * Sets alias.
     * 
     * @returns Nothing.
     */
    public set alias(alias: Alias | undefined)
    {
        this.propertyOptions.alias = alias;

        return;
    }

    /**
     * Gets custom data.
     * 
     * @returns {CustomData|undefined} Custom data or undefined.
     */
    public get customData(): CustomData | undefined
    {
        const propertyCustomData = this.propertyOptions.customData;
        const typeCustomData     = this.typeMetadata?.customData;

        if (Fn.isNil(propertyCustomData) && Fn.isNil(typeCustomData))
        {
            return undefined;
        }

        const customData = {};

        if (Fn.isObject(typeCustomData))
        {
            Fn.assign(customData, typeCustomData);
        }

        if (Fn.isObject(propertyCustomData))
        {
            Fn.assign(customData, propertyCustomData);
        }

        return customData;
    }

    /**
     * Sets custom data.
     * 
     * @returns Nothing.
     */
    public set customData(customData: CustomData | undefined)
    {
        if (Fn.isNil(customData))
        {
            this.propertyOptions.customData = customData;

            return;
        }

        if (Fn.isNil(this.propertyOptions.customData))
        {
            this.propertyOptions.customData = {};
        }

        Fn.assign(this.propertyOptions.customData, customData);

        return;
    }

    /**
     * Gets default value.
     * 
     * @returns {any|undefined} Resolved default value or undefined.
     */
    public get defaultValue(): any | undefined
    {
        const defaultValue = this.propertyOptions.defaultValue ?? this.typeMetadata?.defaultValue;

        if (this.useDefaultValue)
        {
            return Fn.isFunction(defaultValue) ? defaultValue() : defaultValue;
        }

        return undefined;
    }

    /**
     * Sets default value.
     * 
     * @returns Nothing.
     */
    public set defaultValue(defaultValue: any | undefined)
    {
        this.propertyOptions.defaultValue = defaultValue;

        return;
    }

    /**
     * Gets deserializable value.
     * 
     * @returns {boolean|undefined} Deserializable indicator or undefined.
     */
    public get deserializable(): boolean | undefined
    {
        return this.propertyOptions.deserializable;
    }

    /**
     * Sets deserializable value.
     * 
     * @returns Nothing.
     */
    public set deserializable(deserializable: boolean | undefined)
    {
        this.propertyOptions.deserializable = deserializable;
        
        return;
    }

    /**
     * Gets factory.
     * 
     * @returns {Factory<TType>|undefined} Factory or undefined.
     */
    public get factory(): Factory<TType> | undefined
    {
        return this.propertyOptions.factory ?? this.typeMetadata?.factory;
    }

    /**
     * Sets factory.
     * 
     * @returns Nothing.
     */
    public set factory(factory: Factory<TType> | undefined)
    {
        this.propertyOptions.factory = factory;
        
        return;
    }

    /**
     * Gets generic arguments.
     * 
     * @returns {GenericArgument<any>[]|undefined} Generic arguments or undefined.
     */
    public get genericArguments(): GenericArgument<any>[] | undefined
    {
        return this.propertyOptions.genericArguments ?? this.typeMetadata?.genericArguments;
    }

    /**
     * Sets generic arguments.
     * 
     * @returns Nothing.
     */
    public set genericArguments(genericArguments: GenericArgument<any>[] | undefined)
    {
        this.propertyOptions.genericArguments = genericArguments;

        return;
    }

    /**
     * Gets generic metadatas.
     * 
     * @returns {GenericMetadata<any>[]|undefined} Generic metadatas.
     */
    public get genericMetadatas(): GenericMetadata<any>[] | undefined
    {
        const genericArguments = this.genericArguments;

        if (!Fn.isNil(genericArguments))
        {
            return this.defineGenericMetadatas(genericArguments);
        }

        return undefined;
    }

    /**
     * Gets injector.
     * 
     * @returns {Injector|undefined} Injector or undefined.
     */
    public get injector(): Injector | undefined
    {
        return this.propertyOptions.injector ?? this.typeMetadata?.injector;
    }

    /**
     * Sets injector.
     * 
     * @returns Nothing.
     */
    public set injector(injector: Injector | undefined)
    {
        this.propertyOptions.injector = injector;
        
        return;
    }

    /**
     * Gets log.
     * 
     * @returns {Log|undefined} Log or undefined.
     */
    public get log(): Log | undefined
    {
        return this.propertyOptions.log ?? this.typeMetadata?.log;
    }

    /**
     * Sets log.
     * 
     * @returns Nothing.
     */
    public set log(log: Log | undefined)
    {
        this.propertyOptions.log = log;
        
        return;
    }

    /**
     * Gets naming convention.
     * 
     * @returns {NamingConvention|undefined} Naming convention or undefined.
     */
    public get namingConvention(): NamingConvention | undefined
    {
        return this.propertyOptions.namingConvention;
    }

    /**
     * Sets naming convention.
     * 
     * @returns Nothing.
     */
    public set namingConvention(namingConvention: NamingConvention | undefined)
    {
        this.propertyOptions.namingConvention = namingConvention;
        
        return;
    }

    /**
     * Gets serializable value.
     * 
     * @returns {boolean|undefined} Serializable indicator or undefined.
     */
    public get serializable(): boolean | undefined
    {
        return this.propertyOptions.serializable;
    }

    /**
     * Sets serializable value.
     * 
     * @returns Nothing.
     */
    public set serializable(serializable: boolean | undefined)
    {
        this.propertyOptions.serializable = serializable;
        
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
     * Gets serializer.
     * 
     * @returns {Serializer<TType>|undefined} Serializer or undefined.
     */
    public get serializer(): Serializer<TType> | undefined
    {
        return this.propertyOptions.serializer ?? this.typeMetadata?.serializer;
    }

    /**
     * Sets serializer.
     * 
     * @returns Nothing.
     */
    public set serializer(serializer: Serializer<TType> | undefined)
    {
        this.propertyOptions.serializer = serializer;
        
        return;
    }

    /**
     * Gets type argument.
     * 
     * @returns {TypeArgument|undefined} Type argument or undefined.
     */
    public get typeArgument(): TypeArgument<TType> | undefined
    {
        return this.propertyOptions.typeArgument;
    }

    /**
     * Sets type argument.
     * 
     * @returns Nothing.
     */
    public set typeArgument(typeArgument: TypeArgument<TType> | undefined)
    {
        this.propertyOptions.typeArgument = typeArgument;
        
        return;
    }

    /**
     * Gets type metadata if it can be defined.
     * 
     * @returns {TypeMetadata<TType>|undefined} Type metadata or undefined.
     */
    public get typeMetadata(): TypeMetadata<TType> | undefined
    {
        const typeArgument = this.typeArgument ?? this.reflectTypeResolver();

        if (!Fn.isNil(typeArgument))
        {
            return this.defineTypeMetadata(typeArgument);
        }

        return undefined;
    }

    /**
     * Gets indicator if default value should be used.
     * 
     * @returns {boolean|undefined} Use default value indicator or undefined.
     */
    public get useDefaultValue(): boolean | undefined
    {
        return this.propertyOptions.useDefaultValue ?? this.typeMetadata?.useDefaultValue;
    }

    /**
     * Sets indicator if default value should be used.
     * 
     * @returns Nothing.
     */
    public set useDefaultValue(useDefaultValue: boolean | undefined)
    {
        this.propertyOptions.useDefaultValue = useDefaultValue;
        
        return;
    }

    /**
     * Gets indicator if implicit conversion should be used.
     * 
     * @returns {boolean|undefined} Use implicit conversion indicator or undefined.
     */
    public get useImplicitConversion(): boolean | undefined
    {
        return this.propertyOptions.useImplicitConversion ?? this.typeMetadata?.useImplicitConversion;
    }

    /**
     * Sets indicator if implicit conversion should be used.
     * 
     * @returns Nothing.
     */
    public set useImplicitConversion(useImplicitConversion: boolean | undefined)
    {
        this.propertyOptions.useImplicitConversion = useImplicitConversion;
        
        return;
    }

    /**
     * Defines serializer context of property metadata.
     * 
     * @param {SerializerContextOptions<TType>} serializerContextOptions Serializer context options.
     * 
     * @returns {SerializerContext<TType>} Serializer context of current type metadata.
     */
    public defineSerializerContext(serializerContextOptions: SerializerContextOptions<TType>): SerializerContext<TType>
    {
        serializerContextOptions.genericArguments = this.genericArguments;
        serializerContextOptions.typeMetadata     = this.typeMetadata;
        serializerContextOptions.propertyMetadata = this;
        
        return new SerializerContext(this.typeMetadataResolver, serializerContextOptions);
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
            this.alias = propertyOptions.alias;
        }

        if (!Fn.isUndefined(propertyOptions.customData))
        {
            this.customData = propertyOptions.customData;
        }

        if (!Fn.isUndefined(propertyOptions.defaultValue))
        {
            this.defaultValue = propertyOptions.defaultValue;
        }

        if (!Fn.isUndefined(propertyOptions.deserializable))
        {
            this.deserializable = propertyOptions.deserializable;
        }

        if (!Fn.isUndefined(propertyOptions.factory))
        {
            this.factory = propertyOptions.factory;
        }

        if (!Fn.isUndefined(propertyOptions.genericArguments)) 
        {
            this.genericArguments = propertyOptions.genericArguments;
        }

        if (!Fn.isUndefined(propertyOptions.injector))
        {
            this.injector = propertyOptions.injector;
        }

        if (!Fn.isUndefined(propertyOptions.log))
        {
            this.log = propertyOptions.log;
        }

        if (!Fn.isUndefined(propertyOptions.namingConvention))
        {
            this.namingConvention = propertyOptions.namingConvention;
        }

        if (!Fn.isUndefined(propertyOptions.serializable)) 
        {
            this.serializable = propertyOptions.serializable;
        }

        if (!Fn.isUndefined(propertyOptions.serializer)) 
        {
            this.serializer = propertyOptions.serializer;
        }

        if (!Fn.isUndefined(propertyOptions.typeArgument)) 
        {
            this.typeArgument = propertyOptions.typeArgument;
        }

        if (!Fn.isUndefined(propertyOptions.useDefaultValue))
        {
            this.useDefaultValue = propertyOptions.useDefaultValue;
        }

        if (!Fn.isUndefined(propertyOptions.useImplicitConversion)) 
        {
            this.useImplicitConversion = propertyOptions.useImplicitConversion;
        }

        return this;
    }
}
