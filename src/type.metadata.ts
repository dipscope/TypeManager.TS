import { Fn } from './utils';
import { TypeSerializer } from './type.serializer';
import { TypeOptions } from './type.options';
import { TypeCtor } from './type.ctor';
import { TypeFactory } from './type.factory';
import { TypeMetadataResolver } from './type.metadata.resolver';
import { PropertyMetadata } from './property.metadata';
import { PropertyOptions } from './property.options';
import { TypeOptionsBase } from './type.options.base';
import { TypeInjector } from './type.injector';
import { InjectMetadata } from './inject.metadata';
import { InjectOptions } from './inject.options';
import { CustomData } from './custom.data';

/**
 * Main class used to describe a certain type.
 * 
 * @type {TypeMetadata<TType>}
 */
export class TypeMetadata<TType>
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
     * Type metadata resolver.
     * 
     * @type {TypeMetadataResolver<any>}
     */
    public readonly typeMetadataResolver: TypeMetadataResolver<any>;

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
     * @param {TypeCtor<TType>} typeCtor Type constructor function.
     * @param {TypeMetadataResolver<any>} typeMetadataResolver Type declaration.
     * @param {TypeOptionsBase<TType>} typeOptionsBase Type options used by default.
     * @param {TypeOptions<TType>} typeOptions Type options.
     */
    public constructor(typeCtor: TypeCtor<TType>, typeMetadataResolver: TypeMetadataResolver<any>, typeOptionsBase: TypeOptionsBase<TType>, typeOptions: TypeOptions<TType>)
    {
        const injectTypeCtors = (Fn.extractOwnReflectMetadata('design:paramtypes', typeCtor) ?? []) as TypeCtor<any>[];

        this.name                 = Fn.nameOf(typeCtor);
        this.typeCtor             = typeCtor;
        this.typeMetadataResolver = typeMetadataResolver;
        this.typeOptionsBase      = typeOptionsBase;
        this.typeOptions          = {};

        this.configure(typeOptions);

        for (let injectIndex = 0; injectIndex < injectTypeCtors.length; injectIndex++)
        {
            this.configureInjectMetadata(injectIndex, { typeCtor: injectTypeCtors[injectIndex] });
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
        return this.typeOptions.alias;
    }

    /**
     * Gets current custom data.
     * 
     * @returns {CustomData} Custom data.
     */
    public get customData(): CustomData
    {
        const customData = Fn.assign({}, this.typeOptionsBase.customData);

        return Fn.assign(customData, this.typeOptions.customData ?? {});
    }

    /**
     * Gets current default value.
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
     * Gets current injectable value.
     * 
     * @returns {boolean} Injectable indicator.
     */
    public get injectable(): boolean
    {
        return this.typeOptions.injectable ?? false;
    }

    /**
     * Gets metadata path for logging.
     * 
     * @returns {string}
     */
    public get path(): string
    {
        return this.name;
    }

    /**
     * Gets current type factory.
     * 
     * @returns {TypeFactory<TType>} Type factory.
     */
    public get typeFactory(): TypeFactory<TType>
    {
        return this.typeOptions.typeFactory ?? this.typeOptionsBase.typeFactory;
    }

    /**
     * Gets current type injector.
     * 
     * @returns {TypeInjector} Type injector.
     */
    public get typeInjector(): TypeInjector
    {
        return this.typeOptions.typeInjector ?? this.typeOptionsBase.typeInjector;
    }

    /**
     * Gets current type serializer.
     * 
     * @returns {TypeSerializer<TType>} Type serializer.
     */
    public get typeSerializer(): TypeSerializer<TType>
    {
        return this.typeOptions.typeSerializer ?? this.typeOptionsBase.typeSerializer;
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
     * Clones current metadata instance.
     * 
     * @returns {TypeMetadata<TType>} Clone of current metadata instance.
     */
    public clone(): TypeMetadata<TType>
    {
        const typeOptions  = Fn.assign({}, this.typeOptions) as TypeOptions<TType>;
        const typeMetadata = new TypeMetadata(this.typeCtor, this.typeMetadataResolver, this.typeOptionsBase, typeOptions);
        
        if (Fn.isNil(typeOptions.injectOptionsMap))
        {
            typeOptions.injectOptionsMap = new Map<number, InjectOptions<any>>();
        }

        for (const injectMetadata of this.injectMetadataMap.values())
        {
            const injectOptions = Fn.assign({}, injectMetadata.injectOptions) as InjectOptions<any>;

            typeOptions.injectOptionsMap.set(injectMetadata.index, injectOptions);
        }

        if (Fn.isNil(typeOptions.propertyOptionsMap))
        {
            typeOptions.propertyOptionsMap = new Map<string, PropertyOptions<any>>();
        }

        for (const propertyMetadata of this.propertyMetadataMap.values())
        {
            const propertyOptions = Fn.assign({}, propertyMetadata.propertyOptions) as PropertyOptions<any>;

            typeOptions.propertyOptionsMap.set(propertyMetadata.name, propertyOptions);
        }

        return typeMetadata.configure(typeOptions);
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
     * Configures type options custom data.
     * 
     * @param {CustomData} customData Custom data.
     * 
     * @returns {TypeMetadata<TType>} Configured property metadata.
     */
    public configureTypeOptionsCustomData(customData: CustomData): TypeMetadata<TType>
    {
        if (Fn.isNil(this.typeOptions.customData))
        {
            this.typeOptions.customData = {};
        }

        Fn.assign(this.typeOptions.customData, customData);

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
            this.configureTypeOptionsCustomData(typeOptions.customData);
        }

        if (!Fn.isUndefined(typeOptions.defaultValue)) 
        {
            this.typeOptions.defaultValue = typeOptions.defaultValue;
        }

        if (!Fn.isUndefined(typeOptions.injectable))
        {
            this.typeOptions.injectable = typeOptions.injectable;
        }

        if (!Fn.isUndefined(typeOptions.useDefaultValue)) 
        {
            this.typeOptions.useDefaultValue = typeOptions.useDefaultValue;
        }

        if (!Fn.isUndefined(typeOptions.useImplicitConversion)) 
        {
            this.typeOptions.useImplicitConversion = typeOptions.useImplicitConversion;
        }

        if (!Fn.isUndefined(typeOptions.typeFactory)) 
        {
            this.typeOptions.typeFactory = typeOptions.typeFactory;
        }

        if (!Fn.isUndefined(typeOptions.typeInjector))
        {
            this.typeOptions.typeInjector = typeOptions.typeInjector;
        }

        if (!Fn.isUndefined(typeOptions.typeSerializer)) 
        {
            this.typeOptions.typeSerializer = typeOptions.typeSerializer;
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
