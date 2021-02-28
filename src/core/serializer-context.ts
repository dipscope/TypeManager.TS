import { CustomData } from './custom-data';
import { Factory } from './factory';
import { Fn } from './fn';
import { GenericArgument } from './generic-argument';
import { GenericMetadata } from './generic-metadata';
import { Injector } from './injector';
import { Log } from './log';
import { LogLevel } from './log-level';
import { Metadata } from './metadata';
import { NamingConvention } from './naming-convention';
import { PropertyMetadata } from './property-metadata';
import { Serializer } from './serializer';
import { SerializerContextOptions } from './serializer-context-options';
import { TypeMetadata } from './type-metadata';
import { TypeMetadataResolver } from './type-metadata-resolver';

/**
 * Serializer context of a certain type.
 * 
 * @type {SerializerContext<TType>}
 */
export class SerializerContext<TType> extends Metadata
{
    /**
     * Serializer context options.
     * 
     * @type {SerializerContext<TType>}
     */
    public readonly serializerContextOptions: SerializerContextOptions<TType>;

    /**
     * Generic type metadata map. Key is a generic index.
     * 
     * This are generic types if serializing type has any.
     * 
     * @type {Map<number, TypeMetadata<any>>}
     */
    public readonly genericTypeMetadataMap: Map<number, TypeMetadata<any>> = new Map<number, TypeMetadata<any>>();

    /**
     * Generic serializer context map. Key is a generic index.
     * 
     * This are contexts related to certain generic types.
     * 
     * @type {Map<number, SerializerContext<any>>}
     */
    public readonly genericSerializerContextMap: Map<number, SerializerContext<any>> = new Map<number, SerializerContext<any>>();

    /**
     * Constructor.
     * 
     * @param {TypeMetadataResolver} typeMetadataResolver Type metadata resolver.
     * @param {SerializerContextOptions<TType>} serializerContextOptions Serializer context options.
     */
    public constructor(typeMetadataResolver: TypeMetadataResolver<any>, serializerContextOptions: SerializerContextOptions<TType>)
    {
        super(typeMetadataResolver);

        this.serializerContextOptions = {};

        this.configure(serializerContextOptions);

        return;
    }

    /**
     * Gets custom data.
     * 
     * @returns {CustomData} Custom data.
     */
    public get customData(): CustomData
    {
        const customData       = {};
        const typeMetadata     = this.typeMetadata;
        const propertyMetadata = this.propertyMetadata;

        if (!Fn.isNil(typeMetadata))
        {
            Fn.assign(customData, typeMetadata.customData);
        }

        if (!Fn.isNil(propertyMetadata))
        {
            Fn.assign(customData, propertyMetadata.customData);
        }

        return Fn.assign(customData, this.serializerContextOptions.customData ?? {});
    }

    /**
     * Sets custom data.
     * 
     * @returns Nothing.
     */
    public set customData(customData: CustomData)
    {
        if (Fn.isNil(this.serializerContextOptions.customData))
        {
            this.serializerContextOptions.customData = {};
        }

        Fn.assign(this.serializerContextOptions.customData, customData);

        return;
    }

    /**
     * Gets default value.
     * 
     * @returns {any|undefined} Resolved default value or undefined.
     */
    public get defaultValue(): any | undefined
    {
        const defaultValue = this.serializerContextOptions.defaultValue ?? this.propertyMetadata?.defaultValue ?? this.typeMetadata?.defaultValue;

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
        this.serializerContextOptions.defaultValue = defaultValue;

        return;
    }

    /**
     * Gets factory.
     * 
     * @returns {Factory<TType>|undefined} Factory or undefined.
     */
    public get factory(): Factory<TType> | undefined
    {
        return this.serializerContextOptions.factory ?? this.propertyMetadata?.factory ?? this.typeMetadata?.factory;
    }

    /**
     * Sets factory.
     * 
     * @returns Nothing.
     */
    public set factory(factory: Factory<TType> | undefined)
    {
        this.serializerContextOptions.factory = factory;
        
        return;
    }

    /**
     * Gets generic arguments.
     * 
     * @returns {GenericArgument<any>[]|undefined} Generic arguments or undefined.
     */
    public get genericArguments(): GenericArgument<any>[] | undefined
    {
        return this.serializerContextOptions.genericArguments ?? this.propertyMetadata?.genericArguments ?? this.typeMetadata?.genericArguments;
    }

    /**
     * Sets generic arguments.
     * 
     * @returns Nothing.
     */
    public set genericArguments(genericArguments: GenericArgument<any>[] | undefined)
    {
        this.serializerContextOptions.genericArguments = genericArguments;

        this.configureGenericMaps();

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
     * @returns {Injector|undefined} Injector or undefined
     */
    public get injector(): Injector | undefined
    {
        return this.serializerContextOptions.injector ?? this.propertyMetadata?.injector ?? this.typeMetadata?.injector;
    }

    /**
     * Sets injector.
     * 
     * @returns Nothing.
     */
    public set injector(injector: Injector | undefined)
    {
        this.serializerContextOptions.injector = injector;
        
        return;
    }

    /**
     * Gets log.
     * 
     * @returns {Log}
     */
    public get log(): Log
    {
        return this.serializerContextOptions.log ?? this.propertyMetadata?.log ?? this.typeMetadata?.log ?? new Log(LogLevel.Error);
    }

    /**
     * Sets log.
     * 
     * @returns Nothing.
     */
    public set log(log: Log)
    {
        this.serializerContextOptions.log = log;
        
        return;
    }

    /**
     * Gets naming convention.
     * 
     * @returns {NamingConvention|undefined} Naming convention or undefined.
     */
    public get namingConvention(): NamingConvention | undefined
    {
        return this.serializerContextOptions.namingConvention ?? this.propertyMetadata?.namingConvention ?? this.typeMetadata?.namingConvention;
    }

    /**
     * Sets naming convention.
     * 
     * @returns Nothing.
     */
    public set namingConvention(namingConvention: NamingConvention | undefined)
    {
        this.serializerContextOptions.namingConvention = namingConvention;
        
        return;
    }

    /**
     * Gets metadata path for logging.
     * 
     * @returns {string}
     */
    public get path(): string
    {
        if (!Fn.isNil(this.propertyMetadata))
        {
            return `${this.propertyMetadata.declaringTypeMetadata.name}.${this.propertyMetadata.name}`;
        }

        if (!Fn.isNil(this.typeMetadata))
        {
            return this.typeMetadata.name;
        }

        return 'Unknown';
    }

    /**
     * Gets property metadata.
     * 
     * @returns {PropertyMetadata<any, TType>|undefined} Property metadata or undefined.
     */
    public get propertyMetadata(): PropertyMetadata<any, TType> | undefined
    {
        return this.serializerContextOptions.propertyMetadata;
    }

    /**
     * Sets property metadata.
     * 
     * @returns Nothing.
     */
    public set propertyMetadata(propertyMetadata: PropertyMetadata<any, TType> | undefined)
    {
        this.serializerContextOptions.propertyMetadata = propertyMetadata;

        return;
    }

    /**
     * Gets serializer.
     * 
     * @returns {Serializer<TType>|undefined} Serializer or undefined.
     */
    public get serializer(): Serializer<TType> | undefined
    {
        return this.serializerContextOptions.serializer ?? this.propertyMetadata?.serializer ?? this.typeMetadata?.serializer;
    }

    /**
     * Sets serializer.
     * 
     * @returns Nothing.
     */
    public set serializer(serializer: Serializer<TType> | undefined)
    {
        this.serializerContextOptions.serializer = serializer;
        
        return;
    }

    /**
     * Gets type metadata.
     * 
     * @returns {TypeMetadata<TType>|undefined} Type metadata or undefined.
     */
    public get typeMetadata(): TypeMetadata<TType> | undefined
    {
        return this.serializerContextOptions.typeMetadata;
    }

    /**
     * Sets type metadata.
     * 
     * @returns Nothing.
     */
    public set typeMetadata(typeMetadata: TypeMetadata<TType> | undefined)
    {
        this.serializerContextOptions.typeMetadata = typeMetadata;

        return;
    }

    /**
     * Gets indicator if default value should be used.
     * 
     * @returns {boolean|undefined} True when type should use default value. False otherwise.
     */
    public get useDefaultValue(): boolean | undefined
    {
        return this.serializerContextOptions.useDefaultValue ?? this.propertyMetadata?.useDefaultValue ?? this.typeMetadata?.useDefaultValue;
    }

    /**
     * Sets indicator if default value should be used.
     * 
     * @returns Nothing.
     */
    public set useDefaultValue(useDefaultValue: boolean | undefined)
    {
        this.serializerContextOptions.useDefaultValue = useDefaultValue;
        
        return;
    }

    /**
     * Gets indicator if implicit conversion should be used.
     * 
     * @returns {boolean} True when type should use implicit conversion. False otherwise.
     */
    public get useImplicitConversion(): boolean | undefined
    {
        return this.serializerContextOptions.useImplicitConversion ?? this.propertyMetadata?.useImplicitConversion ?? this.typeMetadata?.useImplicitConversion;
    }

    /**
     * Sets indicator if implicit conversion should be used.
     * 
     * @returns Nothing.
     */
    public set useImplicitConversion(useImplicitConversion: boolean | undefined)
    {
        this.serializerContextOptions.useImplicitConversion = useImplicitConversion;
        
        return;
    }

    /**
     * Configures generic maps based on current generic arguments.
     * 
     * @returns {SerializerContext<TType>} Serializer context.
     */
    private configureGenericMaps(): SerializerContext<TType>
    {
        const genericArguments = this.genericArguments;

        this.genericTypeMetadataMap.clear();
        this.genericSerializerContextMap.clear();

        if (Fn.isNil(genericArguments))
        {
            return this;
        }

        for (let i = 0; i < genericArguments.length; i++)
        {
            const genericArgument          = genericArguments[i];
            const genericTypeArgument      = Fn.isArray(genericArgument) ? genericArgument[0] : genericArgument;
            const genericGenericArguments  = Fn.isArray(genericArgument) ? genericArgument[1] : undefined;
            const typeMetadata             = this.defineTypeMetadata(genericTypeArgument);
            const serializerContextOptions = Fn.assign({}, this.serializerContextOptions, { genericArguments: genericGenericArguments }) as SerializerContextOptions<any>;
            const serializerContext        = typeMetadata.defineSerializerContext(serializerContextOptions);

            this.genericTypeMetadataMap.set(i, typeMetadata);
            this.genericSerializerContextMap.set(i, serializerContext);
        }

        return this;
    }

    /**
     * Configures serializer context based on provided options.
     * 
     * @param {SerializerContextOptions<TType>} serializerContextOptions Serializer context options.
     * 
     * @returns {SerializerContext<TType>} Current instance of serializer context.
     */
    public configure(serializerContextOptions: SerializerContextOptions<TType>): SerializerContext<TType>
    {
        if (!Fn.isUndefined(serializerContextOptions.customData))
        {
            this.customData = serializerContextOptions.customData;
        }

        if (!Fn.isUndefined(serializerContextOptions.defaultValue)) 
        {
            this.defaultValue = serializerContextOptions.defaultValue;
        }

        if (!Fn.isUndefined(serializerContextOptions.factory)) 
        {
            this.factory = serializerContextOptions.factory;
        }

        if (!Fn.isUndefined(serializerContextOptions.genericArguments)) 
        {
            this.genericArguments = serializerContextOptions.genericArguments;
        }

        if (!Fn.isUndefined(serializerContextOptions.injector))
        {
            this.injector = serializerContextOptions.injector;
        }

        if (!Fn.isUndefined(serializerContextOptions.log))
        {
            this.log = serializerContextOptions.log;
        }

        if (!Fn.isUndefined(serializerContextOptions.namingConvention))
        {
            this.namingConvention = serializerContextOptions.namingConvention;
        }

        if (!Fn.isUndefined(serializerContextOptions.propertyMetadata)) 
        {
            this.propertyMetadata = serializerContextOptions.propertyMetadata;
        }

        if (!Fn.isUndefined(serializerContextOptions.serializer)) 
        {
            this.serializer = serializerContextOptions.serializer;
        }

        if (!Fn.isUndefined(serializerContextOptions.typeMetadata)) 
        {
            this.typeMetadata = serializerContextOptions.typeMetadata;
        }

        if (!Fn.isUndefined(serializerContextOptions.useDefaultValue)) 
        {
            this.useDefaultValue = serializerContextOptions.useDefaultValue;
        }

        if (!Fn.isUndefined(serializerContextOptions.useImplicitConversion)) 
        {
            this.useImplicitConversion = serializerContextOptions.useImplicitConversion;
        }

        return this;
    }
}
