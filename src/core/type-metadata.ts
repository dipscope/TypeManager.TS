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
import { ReferenceHandler } from './reference-handler';
import { Serializer } from './serializer';
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
     * Reflects inject metadata.
     * 
     * Used to configure inject metadata based on reflect metadata as inject decorators may be omitted.
     * 
     * @returns {TypeMetadata<TType>} Current instance of type metadata.
     */
    public reflectInjectMetadata(): TypeMetadata<TType>
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
            propertyMetadata = new PropertyMetadata(this, propertyName, propertyOptions);
            
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
            injectMetadata = new InjectMetadata(this, injectIndex, injectOptions);
            
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
