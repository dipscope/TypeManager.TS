import { Alias } from './alias';
import { CustomData } from './custom-data';
import { Factory } from './factory';
import { Fn } from './fn';
import { GenericArgument } from './generic-argument';
import { GenericMetadata } from './generic-metadata';
import { InjectMetadata } from './inject-metadata';
import { InjectOptions } from './inject-options';
import { Injector } from './injector';
import { Log } from './log';
import { Metadata } from './metadata';
import { NamingConvention } from './naming-convention';
import { PropertyMetadata } from './property-metadata';
import { PropertyOptions } from './property-options';
import { Serializer } from './serializer';
import { SerializerContext } from './serializer-context';
import { SerializerContextOptions } from './serializer-context-options';
import { TypeCtor } from './type-ctor';
import { TypeMetadataResolver } from './type-metadata-resolver';
import { TypeOptions } from './type-options';
import { TypeOptionsBase } from './type-options-base';

/**
 * Main class used to describe a certain type.
 * 
 * @type {TypeMetadata<TType>}
 */
export class TypeMetadata<TType> extends Metadata
{
    /**
     * Constructor function name. 
     * 
     * Defined at runtime based on the constructor function.
     * 
     * @type {string}
     */
    public readonly name: string;

    /**
     * Type constructor function.
     * 
     * @type {TypeCtor<TType>}
     */
    public readonly typeCtor: TypeCtor<TType>;

    /**
     * Type options used by default.
     * 
     * @type {TypeOptionsBase<TType>}
     */
    public readonly typeOptionsBase: TypeOptionsBase<TType>;

    /**
     * Type options.
     * 
     * @type {TypeOptions<TType>}
     */
    public readonly typeOptions: TypeOptions<TType>;

    /**
     * Properties defined for a type. Map key is a property name.
     * 
     * @type {Map<string, PropertyMetadata<TType, any>>}
     */
    public readonly propertyMetadataMap: Map<string, PropertyMetadata<TType, any>> = new Map<string, PropertyMetadata<TType, any>>();

    /**
     * Injections defined for a type. Map key is an injection index.
     * 
     * @type {Map<number, InjectMetadata<TType, any>>}
     */
    public readonly injectMetadataMap: Map<number, InjectMetadata<TType, any>> = new Map<number, InjectMetadata<TType, any>>();

    /**
     * Constructor.
     * 
     * @param {TypeCtorResolver<any>} typeCtorResolver Type constructor resolver.
     * @param {TypeMetadataResolver<any>} typeMetadataResolver Type metadata resolver.
     * @param {TypeCtor<TType>} typeCtor Type constructor function.
     * @param {TypeOptionsBase<TType>} typeOptionsBase Type options used by default.
     * @param {TypeOptions<TType>} typeOptions Type options.
     */
    public constructor(typeMetadataResolver: TypeMetadataResolver<any>, typeCtor: TypeCtor<TType>, typeOptionsBase: TypeOptionsBase<TType>, typeOptions: TypeOptions<TType>)
    {
        super(typeMetadataResolver);

        this.name            = Fn.nameOf(typeCtor);
        this.typeCtor        = typeCtor;
        this.typeOptionsBase = typeOptionsBase;
        this.typeOptions     = {};

        this.configure(typeOptions);

        return;
    }

    /**
     * Gets alias.
     * 
     * @returns {Alias|undefined} Alias or undefined.
     */
    public get alias(): Alias | undefined
    {
        return this.typeOptions.alias;
    }

    /**
     * Sets alias.
     * 
     * @returns Nothing.
     */
    public set alias(alias: Alias | undefined)
    {
        this.typeOptions.alias = alias;

        return;
    }

    /**
     * Gets custom data.
     * 
     * @returns {CustomData|undefined} Custom data or undefined.
     */
    public get customData(): CustomData | undefined
    {
        const typeCustomData     = this.typeOptionsBase.customData;
        const typeBaseCustomData = this.typeOptionsBase.customData;

        if (Fn.isNil(typeCustomData) && Fn.isNil(typeBaseCustomData))
        {
            return undefined;
        }

        const customData = {};

        if (Fn.isObject(typeBaseCustomData))
        {
            Fn.assign(customData, typeBaseCustomData);
        }

        if (Fn.isObject(typeCustomData))
        {
            Fn.assign(customData, typeCustomData);
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
            this.typeOptions.customData = customData;

            return;
        }

        if (Fn.isNil(this.typeOptions.customData))
        {
            this.typeOptions.customData = {};
        }

        Fn.assign(this.typeOptions.customData, customData);

        return;
    }

    /**
     * Gets default value.
     * 
     * @returns {any|undefined} Resolved default value or undefined.
     */
    public get defaultValue(): any | undefined
    {
        const defaultValue = this.typeOptions.defaultValue ?? this.typeOptionsBase.defaultValue;

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
        this.typeOptions.defaultValue = defaultValue;

        return;
    }

    /**
     * Gets factory.
     * 
     * @returns {Factory<TType>|undefined} Factory or undefined.
     */
    public get factory(): Factory<TType> | undefined
    {
        return this.typeOptions.factory ?? this.typeOptionsBase.factory;
    }

    /**
     * Sets factory.
     * 
     * @returns Nothing.
     */
    public set factory(factory: Factory<TType> | undefined)
    {
        this.typeOptions.factory = factory;
        
        return;
    }

    /**
     * Gets generic arguments.
     * 
     * @returns {GenericArgument<any>[]|undefined} Generic arguments or undefined.
     */
    public get genericArguments(): GenericArgument<any>[] | undefined
    {
        return this.typeOptions.genericArguments;
    }

    /**
     * Sets generic arguments.
     * 
     * @returns Nothing.
     */
    public set genericArguments(genericArguments: GenericArgument<any>[] | undefined)
    {
        this.typeOptions.genericArguments = genericArguments;

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
     * Gets injectable value.
     * 
     * @returns {boolean|undefined} Injectable indicator or undefined.
     */
    public get injectable(): boolean | undefined
    {
        return this.typeOptions.injectable;
    }

    /**
     * Sets injectable value.
     * 
     * @returns Nothing.
     */
    public set injectable(injectable: boolean | undefined)
    {
        this.typeOptions.injectable = injectable;
        
        return;
    }

    /**
     * Gets injector.
     * 
     * @returns {Injector|undefined} Injector or undefined.
     */
    public get injector(): Injector | undefined
    {
        return this.typeOptions.injector ?? this.typeOptionsBase.injector;
    }

    /**
     * Sets injector.
     * 
     * @returns Nothing.
     */
    public set injector(injector: Injector | undefined)
    {
        this.typeOptions.injector = injector;
        
        return;
    }

    /**
     * Gets log.
     * 
     * @returns {Log|undefined}
     */
    public get log(): Log | undefined
    {
        return this.typeOptions.log ?? this.typeOptionsBase.log;
    }

    /**
     * Sets log.
     * 
     * @returns Nothing.
     */
    public set log(log: Log | undefined)
    {
        this.typeOptions.log = log;
        
        return;
    }

    /**
     * Gets naming convention.
     * 
     * @returns {NamingConvention|undefined}
     */
    public get namingConvention(): NamingConvention | undefined
    {
        return this.typeOptions.namingConvention ?? this.typeOptionsBase.namingConvention;
    }

    /**
     * Sets naming convention.
     * 
     * @returns Nothing.
     */
    public set namingConvention(namingConvention: NamingConvention | undefined)
    {
        this.typeOptions.namingConvention = namingConvention;
        
        return;
    }

    /**
     * Gets current serializer.
     * 
     * @returns {Serializer<TType>|undefined} Serializer or undefined.
     */
    public get serializer(): Serializer<TType> | undefined
    {
        return this.typeOptions.serializer ?? this.typeOptionsBase.serializer;
    }

    /**
     * Sets serializer.
     * 
     * @returns Nothing.
     */
    public set serializer(serializer: Serializer<TType> | undefined)
    {
        this.typeOptions.serializer = serializer;
        
        return;
    }

    /**
     * Gets indicator if default value should be used.
     * 
     * @returns {boolean|undefined} True when type should use default value. False otherwise.
     */
    public get useDefaultValue(): boolean | undefined
    {
        return this.typeOptions.useDefaultValue ?? this.typeOptionsBase.useDefaultValue;
    }

    /**
     * Sets indicator if default value should be used.
     * 
     * @returns Nothing.
     */
    public set useDefaultValue(useDefaultValue: boolean | undefined)
    {
        this.typeOptions.useDefaultValue = useDefaultValue;
        
        return;
    }

    /**
     * Gets indicator if implicit conversion should be used.
     * 
     * @returns {boolean|undefined} True when type should use implicit conversion. False otherwise.
     */
    public get useImplicitConversion(): boolean | undefined
    {
        return this.typeOptions.useImplicitConversion ?? this.typeOptionsBase.useImplicitConversion;
    }

    /**
     * Sets indicator if implicit conversion should be used.
     * 
     * @returns Nothing.
     */
    public set useImplicitConversion(useImplicitConversion: boolean | undefined)
    {
        this.typeOptions.useImplicitConversion = useImplicitConversion;
        
        return;
    }

    /**
     * Defines serializer context of type metadata.
     * 
     * @param {SerializerContextOptions<TType>} serializerContextOptions Serializer context options.
     * 
     * @returns {SerializerContext<TType>} Serializer context of current type metadata.
     */
    public defineSerializerContext(serializerContextOptions: SerializerContextOptions<TType>): SerializerContext<TType>
    {
        serializerContextOptions.typeMetadata     = this;
        serializerContextOptions.propertyMetadata = undefined;

        return new SerializerContext(this.typeMetadataResolver, serializerContextOptions);
    }

    /**
     * Extracts reflect metadata.
     * 
     * @returns {TypeMetadata<TType>}
     */
    public extractReflectMetadata(): TypeMetadata<TType>
    {
        if (this.typeCtor.length === 0)
        {
            return this;
        }

        const injectTypeCtors = (Fn.extractOwnReflectMetadata('design:paramtypes', this.typeCtor) ?? []) as TypeCtor<any>[];

        for (let injectIndex = 0; injectIndex < injectTypeCtors.length; injectIndex++)
        {
            if (!this.injectMetadataMap.has(injectIndex))
            {
                this.configureInjectMetadata(injectIndex, { typeCtor: injectTypeCtors[injectIndex] });
            }
        }

        return this;
    }

    /**
     * Configures certain property metadata.
     * 
     * @param {string} propertyName Property name. 
     * @param {PropertyOptions<TPropertyType>} propertyOptions Property options.
     * 
     * @returns {PropertyMetadata<TType, TPropertyType>} Configured property metadata.
     */
    public configurePropertyMetadata<TPropertyType>(propertyName: string, propertyOptions: PropertyOptions<TPropertyType>): PropertyMetadata<TType, TPropertyType>
    {
        let propertyMetadata = this.propertyMetadataMap.get(propertyName);

        if (Fn.isNil(propertyMetadata))
        {
            propertyMetadata = new PropertyMetadata(this.typeMetadataResolver, this, propertyName, propertyOptions);
            
            this.propertyMetadataMap.set(propertyName, propertyMetadata);

            return propertyMetadata;
        }

        return propertyMetadata.configure(propertyOptions);
    }

    /**
     * Configures certain inject metadata.
     * 
     * @param {number} injectIndex Inject index. 
     * @param {InjectOptions<TInjectType>} injectOptions Inject options.
     * 
     * @returns {InjectMetadata<TType, TInjectType>} Configured inject metadata.
     */
    public configureInjectMetadata<TInjectType>(injectIndex: number, injectOptions: InjectOptions<TInjectType>): InjectMetadata<TType, TInjectType>
    {
        let injectMetadata = this.injectMetadataMap.get(injectIndex);

        if (Fn.isNil(injectMetadata))
        {
            injectMetadata = new InjectMetadata(this.typeMetadataResolver, this, injectIndex, injectOptions);
            
            this.injectMetadataMap.set(injectIndex, injectMetadata);

            return injectMetadata;
        }

        return injectMetadata.configure(injectOptions);
    }

    /**
     * Configures property metadata map.
     * 
     * @param {Map<string, PropertyOptions<TPropertyType>>} propertyOptionsMap Property options map.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    public configurePropertyMetadataMap<TPropertyType>(propertyOptionsMap: Map<string, PropertyOptions<TPropertyType>>): TypeMetadata<TType>
    {
        propertyOptionsMap.forEach((propertyOptions, propertyName) =>
        {
            this.configurePropertyMetadata(propertyName, propertyOptions);
        });

        return this;
    }

    /**
     * Configures inject metadata map.
     * 
     * @param {Map<number, InjectOptions<TInjectType>>} injectOptionsMap Inject options map.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    public configureInjectMetadataMap<TInjectType>(injectOptionsMap: Map<number, InjectOptions<TInjectType>>): TypeMetadata<TType>
    {
        injectOptionsMap.forEach((injectOptions, injectIndex) =>
        {
            this.configureInjectMetadata(injectIndex, injectOptions);
        });

        return this;
    }

    /**
     * Configures type metadata based on provided options.
     * 
     * @param {TypeOptions<TType>} typeOptions Type options.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    public configure(typeOptions: TypeOptions<TType>): TypeMetadata<TType>
    {
        if (!Fn.isUndefined(typeOptions.alias)) 
        {
            this.alias = typeOptions.alias;
        }

        if (!Fn.isUndefined(typeOptions.customData))
        {
            this.customData = typeOptions.customData;
        }

        if (!Fn.isUndefined(typeOptions.defaultValue)) 
        {
            this.defaultValue = typeOptions.defaultValue;
        }

        if (!Fn.isUndefined(typeOptions.factory)) 
        {
            this.factory = typeOptions.factory;
        }

        if (!Fn.isUndefined(typeOptions.genericArguments)) 
        {
            this.genericArguments = typeOptions.genericArguments;
        }

        if (!Fn.isUndefined(typeOptions.injectable))
        {
            this.injectable = typeOptions.injectable;
        }

        if (!Fn.isUndefined(typeOptions.injector))
        {
            this.injector = typeOptions.injector;
        }

        if (!Fn.isUndefined(typeOptions.log))
        {
            this.log = typeOptions.log;
        }

        if (!Fn.isUndefined(typeOptions.namingConvention))
        {
            this.namingConvention = typeOptions.namingConvention;
        }

        if (!Fn.isUndefined(typeOptions.serializer)) 
        {
            this.serializer = typeOptions.serializer;
        }

        if (!Fn.isUndefined(typeOptions.useDefaultValue)) 
        {
            this.useDefaultValue = typeOptions.useDefaultValue;
        }

        if (!Fn.isUndefined(typeOptions.useImplicitConversion)) 
        {
            this.useImplicitConversion = typeOptions.useImplicitConversion;
        }

        if (!Fn.isUndefined(typeOptions.propertyOptionsMap))
        {
            this.configurePropertyMetadataMap(typeOptions.propertyOptionsMap);
        }

        if (!Fn.isUndefined(typeOptions.injectOptionsMap))
        {
            this.configureInjectMetadataMap(typeOptions.injectOptionsMap);
        }

        return this;
    }
}
