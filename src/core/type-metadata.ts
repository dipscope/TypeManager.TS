import { Alias } from './alias';
import { CustomData } from './custom-data';
import { Discriminant } from './discriminant';
import { Discriminator } from './discriminator';
import { Factory } from './factory';
import { Fn } from './fn';
import { GenericArgument } from './generic-argument';
import { GenericMetadata } from './generic-metadata';
import { InjectIndex } from './inject-index';
import { InjectMetadata } from './inject-metadata';
import { InjectOptions } from './inject-options';
import { Injector } from './injector';
import { Log } from './log';
import { Metadata } from './metadata';
import { NamingConvention } from './naming-convention';
import { PropertyMetadata } from './property-metadata';
import { PropertyName } from './property-name';
import { PropertyOptions } from './property-options';
import { ReferenceHandler } from './reference-handler';
import { Serializer } from './serializer';
import { TypeFn } from './type-fn';
import { TypeMetadataResolver } from './type-metadata-resolver';
import { TypeName } from './type-name';
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
     * Key to query type metadata from the prototypes.
     * 
     * @type {string}
     */
    public static readonly key: string = '__TMTypeMetadata__';

    /**
     * Parent type metadata.
     * 
     * @type {TypeMetadata<any>}
     */
    public readonly parentTypeMetadata?: TypeMetadata<any>;

    /**
     * Type name. 
     * 
     * Defined at runtime based on the constructor function.
     * 
     * @type {TypeName}
     */
    public readonly typeName: TypeName;

    /**
     * Type function.
     * 
     * @type {TypeFn<TType>}
     */
    public readonly typeFn: TypeFn<TType>;

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
     * Children type metadatas.
     * 
     * @type {Map<TypeFn<TType>, TypeMetadata<any>>}
     */
    public readonly childrenTypeMetadatas: Map<TypeFn<any>, TypeMetadata<any>> = new Map<TypeFn<any>, TypeMetadata<any>>();

    /**
     * Discriminant map.
     * 
     * @type {Map<TypeFn<any>, Discriminant>}
     */
    public readonly discriminantMap: Map<TypeFn<any>, Discriminant> = new Map<TypeFn<any>, Discriminant>();

    /**
     * Properties defined for a type.
     * 
     * @type {Map<PropertyName, PropertyMetadata<TType, any>>}
     */
    public readonly propertyMetadataMap: Map<PropertyName, PropertyMetadata<TType, any>> = new Map<PropertyName, PropertyMetadata<TType, any>>();

    /**
     * Injections defined for a type.
     * 
     * @type {Map<InjectIndex, InjectMetadata<TType, any>>}
     */
    public readonly injectMetadataMap: Map<InjectIndex, InjectMetadata<TType, any>> = new Map<InjectIndex, InjectMetadata<TType, any>>();

    /**
     * Constructor.
     * 
     * @param {TypeMetadataResolver<any>} typeMetadataResolver Type metadata resolver.
     * @param {TypeFn<any>} typeFn Type function.
     * @param {TypeOptionsBase<TType>} typeOptionsBase Type options used by default.
     * @param {TypeOptions<TType>} typeOptions Type options.
     */
    public constructor(typeMetadataResolver: TypeMetadataResolver<any>, typeFn: TypeFn<TType>, typeOptionsBase: TypeOptionsBase<TType>, typeOptions: TypeOptions<TType>)
    {
        super(typeMetadataResolver);

        this.parentTypeMetadata = typeFn.prototype[TypeMetadata.key];
        this.typeName           = Fn.nameOf(typeFn);
        this.typeFn             = typeFn;
        this.typeOptionsBase    = typeOptionsBase;
        this.typeOptions        = {};

        this.deriveParentTypeMetadataProperties();
        this.provideDiscriminant(this.typeFn, this.typeName);
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
     * Gets custom data.
     * 
     * @returns {CustomData} Custom data.
     */
    public get customData(): CustomData
    {
        const customData         = {};
        const typeBaseCustomData = this.typeOptionsBase.customData;
        const typeCustomData     = this.typeOptions.customData;
        
        if (!Fn.isNil(typeBaseCustomData))
        {
            Fn.assign(customData, typeBaseCustomData);
        }

        if (!Fn.isNil(typeCustomData))
        {
            Fn.assign(customData, typeCustomData);
        }

        return customData;
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
     * Gets discriminant.
     * 
     * @returns {Discriminant} Discriminant.
     */
    public get discriminant(): Discriminant
    {
        return this.typeOptions.discriminant ?? this.typeName;
    }

    /**
     * Gets discriminator.
     * 
     * @returns {Discriminator} Discriminator.
     */
    public get discriminator(): Discriminator
    {
        return this.typeOptions.discriminator ?? this.typeOptionsBase.discriminator;
    }

    /**
     * Gets factory.
     * 
     * @returns {Factory} Factory.
     */
    public get factory(): Factory
    {
        return this.typeOptions.factory ?? this.typeOptionsBase.factory;
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
     * Gets generic metadatas.
     * 
     * @returns {GenericMetadata<any>[]|undefined} Generic metadatas.
     */
    public get genericMetadatas(): GenericMetadata<any>[] | undefined
    {
        const genericArguments = this.genericArguments;

        if (Fn.isNil(genericArguments))
        {
            return undefined;
        }

        return this.defineGenericMetadatas(genericArguments);
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
     * Gets injector.
     * 
     * @returns {Injector} Injector.
     */
    public get injector(): Injector
    {
        return this.typeOptions.injector ?? this.typeOptionsBase.injector;
    }

    /**
     * Gets log.
     * 
     * @returns {Log} Log instance.
     */
    public get log(): Log
    {
        return this.typeOptions.log ?? this.typeOptionsBase.log;
    }

    /**
     * Gets naming convention.
     * 
     * @returns {NamingConvention|undefined} Naming convention or undefined.
     */
    public get namingConvention(): NamingConvention | undefined
    {
        return this.typeOptions.namingConvention ?? this.typeOptionsBase.namingConvention;
    }

    /**
     * Gets indicator if current type metadata is polymorphic.
     * 
     * @returns {boolean} True when type metadata is polymorphic. False otherwise.
     */
    public get polymorphic(): boolean
    {
        return this.discriminantMap.size > 1;
    }

    /**
     * Gets indicator if discriminator should be preserved.
     * 
     * @returns {boolean} True when discriminator should be preserved. False otherwise.
     */
    public get preserveDiscriminator(): boolean 
    {
        return this.typeOptions.preserveDiscriminator ?? this.typeOptionsBase.preserveDiscriminator;
    }

    /**
     * Gets reference handler.
     * 
     * @returns {ReferenceHandler} Reference handler.
     */
    public get referenceHandler(): ReferenceHandler
    {
        return this.typeOptions.referenceHandler ?? this.typeOptionsBase.referenceHandler;
    }

    /**
     * Gets serializer.
     * 
     * @returns {Serializer<TType>} Serializer.
     */
    public get serializer(): Serializer<TType>
    {
        return this.typeOptions.serializer ?? this.typeOptionsBase.serializer;
    }

    /**
     * Gets indicator if default value should be used.
     * 
     * @returns {boolean} True when type should use default value. False otherwise.
     */
    public get useDefaultValue(): boolean
    {
        return this.typeOptions.useDefaultValue ?? this.typeOptionsBase.useDefaultValue;
    }

    /**
     * Gets indicator if implicit conversion should be used.
     * 
     * @returns {boolean} True when type should use implicit conversion. False otherwise.
     */
    public get useImplicitConversion(): boolean
    {
        return this.typeOptions.useImplicitConversion ?? this.typeOptionsBase.useImplicitConversion;
    }

    /**
     * Derives parent type metadata properties.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    private deriveParentTypeMetadataProperties(): TypeMetadata<TType>
    {
        if (Fn.isNil(this.parentTypeMetadata)) 
        {
            return this;
        }

        for (const [propertyName, propertyMetadata] of this.parentTypeMetadata.propertyMetadataMap)
        {
            this.propertyMetadataMap.set(propertyName, propertyMetadata);
        }

        this.parentTypeMetadata.childrenTypeMetadatas.set(this.typeFn, this);

        return this;
    }

    /**
     * Reflects inject metadata.
     * 
     * Used to configure inject metadata based on reflect metadata as inject decorators may be omitted.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    public reflectInjectMetadata(): TypeMetadata<TType>
    {
        if (this.typeFn.length === 0)
        {
            return this;
        }

        const injectTypeFns = (Fn.extractOwnReflectMetadata('design:paramtypes', this.typeFn) ?? []) as TypeFn<any>[];

        for (let injectIndex = 0; injectIndex < injectTypeFns.length; injectIndex++)
        {
            if (!this.injectMetadataMap.has(injectIndex))
            {
                this.configureInjectMetadata(injectIndex, { typeFn: injectTypeFns[injectIndex] });
            }
        }

        return this;
    }

    /**
     * Provides discriminant.
     * 
     * @param {TypeFn<any>} typeFn Type function.
     * @param {Discriminant} discriminant Discriminant.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    private provideDiscriminant(typeFn: TypeFn<any>, discriminant: Discriminant): TypeMetadata<TType>
    {
        this.discriminantMap.set(typeFn, discriminant);

        if (!Fn.isNil(this.parentTypeMetadata))
        {
            this.parentTypeMetadata.provideDiscriminant(typeFn, discriminant);
        }

        return this;
    }

    /**
     * Configures discriminant.
     * 
     * @param {Discriminant} discriminant Discriminant.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    private configureDiscriminant(discriminant: Discriminant): TypeMetadata<TType>
    {
        this.typeOptions.discriminant = discriminant;

        this.provideDiscriminant(this.typeFn, discriminant);

        return this;
    }

    /**
     * Configures certain property metadata.
     * 
     * @param {PropertyName} propertyName Property name. 
     * @param {PropertyOptions<TPropertyType>} propertyOptions Property options.
     * 
     * @returns {PropertyMetadata<TType, TPropertyType>} Configured property metadata.
     */
    public configurePropertyMetadata<TPropertyType>(propertyName: PropertyName, propertyOptions: PropertyOptions<TPropertyType>): PropertyMetadata<TType, TPropertyType>
    {
        let propertyMetadata = this.propertyMetadataMap.get(propertyName);

        if (Fn.isNil(propertyMetadata))
        {
            propertyMetadata = new PropertyMetadata(this, propertyName, propertyOptions);
            
            this.propertyMetadataMap.set(propertyName, propertyMetadata);

            return propertyMetadata;
        }

        return propertyMetadata.configure(propertyOptions);
    }

    /**
     * Configures certain inject metadata.
     * 
     * @param {InjectIndex} injectIndex Inject index. 
     * @param {InjectOptions<TInjectType>} injectOptions Inject options.
     * 
     * @returns {InjectMetadata<TType, TInjectType>} Configured inject metadata.
     */
    public configureInjectMetadata<TInjectType>(injectIndex: InjectIndex, injectOptions: InjectOptions<TInjectType>): InjectMetadata<TType, TInjectType>
    {
        let injectMetadata = this.injectMetadataMap.get(injectIndex);

        if (Fn.isNil(injectMetadata))
        {
            injectMetadata = new InjectMetadata(this, injectIndex, injectOptions);
            
            this.injectMetadataMap.set(injectIndex, injectMetadata);

            return injectMetadata;
        }

        return injectMetadata.configure(injectOptions);
    }

    /**
     * Configures property metadata map.
     * 
     * @param {Map<PropertyName, PropertyOptions<TPropertyType>>} propertyOptionsMap Property options map.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    public configurePropertyMetadataMap<TPropertyType>(propertyOptionsMap: Map<PropertyName, PropertyOptions<TPropertyType>>): TypeMetadata<TType>
    {
        for (const [propertyName, propertyOptions] of propertyOptionsMap)
        {
            this.configurePropertyMetadata(propertyName, propertyOptions);
        }

        return this;
    }

    /**
     * Configures inject metadata map.
     * 
     * @param {Map<InjectIndex, InjectOptions<TInjectType>>} injectOptionsMap Inject options map.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    public configureInjectMetadataMap<TInjectType>(injectOptionsMap: Map<InjectIndex, InjectOptions<TInjectType>>): TypeMetadata<TType>
    {
        for (const [injectIndex, injectOptions] of injectOptionsMap)
        {
            this.configureInjectMetadata(injectIndex, injectOptions);
        }

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
            this.typeOptions.alias = typeOptions.alias;
        }

        if (!Fn.isUndefined(typeOptions.customData))
        {
            this.typeOptions.customData = typeOptions.customData;
        }

        if (!Fn.isUndefined(typeOptions.defaultValue)) 
        {
            this.typeOptions.defaultValue = typeOptions.defaultValue;
        }

        if (!Fn.isUndefined(typeOptions.discriminant))
        {
            this.configureDiscriminant(typeOptions.discriminant);
        }

        if (!Fn.isUndefined(typeOptions.discriminator)) 
        {
            this.typeOptions.discriminator = typeOptions.discriminator;
        }

        if (!Fn.isUndefined(typeOptions.factory)) 
        {
            this.typeOptions.factory = typeOptions.factory;
        }

        if (!Fn.isUndefined(typeOptions.genericArguments)) 
        {
            this.typeOptions.genericArguments = typeOptions.genericArguments;
        }

        if (!Fn.isUndefined(typeOptions.injectable))
        {
            this.typeOptions.injectable = typeOptions.injectable;
        }

        if (!Fn.isUndefined(typeOptions.injector))
        {
            this.typeOptions.injector = typeOptions.injector;
        }

        if (!Fn.isUndefined(typeOptions.log))
        {
            this.typeOptions.log = typeOptions.log;
        }

        if (!Fn.isUndefined(typeOptions.namingConvention))
        {
            this.typeOptions.namingConvention = typeOptions.namingConvention;
        }

        if (!Fn.isUndefined(typeOptions.preserveDiscriminator))
        {
            this.typeOptions.preserveDiscriminator = typeOptions.preserveDiscriminator;
        }

        if (!Fn.isUndefined(typeOptions.referenceHandler))
        {
            this.typeOptions.referenceHandler = typeOptions.referenceHandler;
        }

        if (!Fn.isUndefined(typeOptions.serializer)) 
        {
            this.typeOptions.serializer = typeOptions.serializer;
        }

        if (!Fn.isUndefined(typeOptions.useDefaultValue)) 
        {
            this.typeOptions.useDefaultValue = typeOptions.useDefaultValue;
        }

        if (!Fn.isUndefined(typeOptions.useImplicitConversion)) 
        {
            this.typeOptions.useImplicitConversion = typeOptions.useImplicitConversion;
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
