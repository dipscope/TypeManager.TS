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
 * @type {TypeMetadata}
 */
export class TypeMetadata
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
     * @type {TypeCtor}
     */
    public readonly typeCtor: TypeCtor;

    /**
     * Type metadata resolver.
     * 
     * @type {TypeMetadataResolver}
     */
    public readonly typeMetadataResolver: TypeMetadataResolver;

    /**
     * Type options used by default.
     * 
     * @type {TypeOptionsBase}
     */
    public readonly typeOptionsBase: TypeOptionsBase;

    /**
     * Type options.
     * 
     * @type {TypeOptions}
     */
    public readonly typeOptions: TypeOptions = {};

    /**
     * Properties defined for a type. Map key is a property name.
     * 
     * @type {Map<string, PropertyMetadata>}
     */
    public readonly propertyMetadataMap: Map<string, PropertyMetadata> = new Map<string, PropertyMetadata>();

    /**
     * Injections defined for a type. Map key is an injection index.
     * 
     * @type {Map<number, InjectMetadata>}
     */
    public readonly injectMetadataMap: Map<number, InjectMetadata> = new Map<number, InjectMetadata>();

    /**
     * Constructor.
     * 
     * @param {TypeCtor} typeCtor Type constructor function.
     * @param {TypeOptionsBase} typeOptionsBase Type options used by default.
     * @param {TypeMetadataResolver} typeMetadataResolver Type declaration.
     */
    public constructor(typeCtor: TypeCtor, typeOptionsBase: TypeOptionsBase, typeMetadataResolver: TypeMetadataResolver)
    {
        const injectTypeCtors = (Fn.extractOwnReflectMetadata('design:paramtypes', typeCtor.prototype) ?? []) as TypeCtor[];

        injectTypeCtors.forEach((injectTypeCtor, injectIndex) => 
        {
            this.configureInjectMetadata(injectIndex, { typeCtor: injectTypeCtor });
        });

        this.name                 = Fn.nameOf(typeCtor);
        this.typeCtor             = typeCtor;
        this.typeOptionsBase      = typeOptionsBase;
        this.typeMetadataResolver = typeMetadataResolver;
        
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
        return this.typeOptions.customData ?? this.typeOptionsBase.customData;
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
     * Gets current type factory.
     * 
     * @returns {TypeFactory} Type factory.
     */
    public get typeFactory(): TypeFactory
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
     * @returns {TypeSerializer} Type serializer.
     */
    public get typeSerializer(): TypeSerializer
    {
        return this.typeOptions.typeSerializer ?? this.typeOptionsBase.typeSerializer;
    }

    /**
     * Resolves type metadata for provided type constructor.
     * 
     * @param {TypeCtor} typeCtor Type constructor function.
     * 
     * @returns {TypeMetadata} Resolved type metadata.
     */
    public resolveTypeMetadata(typeCtor: TypeCtor): TypeMetadata
    {
        return this.typeMetadataResolver(typeCtor);
    }

    /**
     * Clones current metadata instance.
     * 
     * @returns {TypeMetadata} Clone of current metadata instance.
     */
    public clone(): TypeMetadata
    {
        const typeMetadata = new TypeMetadata(this.typeCtor, this.typeOptionsBase, this.typeMetadataResolver);
        const typeOptions  = Fn.assign({}, this.typeOptions);

        if (Fn.isNil(typeOptions.injectOptionsMap))
        {
            typeOptions.injectOptionsMap = new Map<number, InjectOptions>();
        }

        for (const injectMetadata of this.injectMetadataMap.values())
        {
            const injectOptions = Fn.assign({}, injectMetadata.injectOptions);

            typeOptions.injectOptionsMap.set(injectMetadata.index, injectOptions);
        }

        if (Fn.isNil(typeOptions.propertyOptionsMap))
        {
            typeOptions.propertyOptionsMap = new Map<string, PropertyOptions>();
        }

        for (const propertyMetadata of this.propertyMetadataMap.values())
        {
            const propertyOptions = Fn.assign({}, propertyMetadata.propertyOptions);

            typeOptions.propertyOptionsMap.set(propertyMetadata.name, propertyOptions);
        }

        return typeMetadata.configure(typeOptions);
    }

    /**
     * Configures certain property metadata.
     * 
     * @param {string} propertyName Property name. 
     * @param {PropertyOptions} propertyOptions Property options.
     * 
     * @returns {PropertyMetadata} Configured property metadata.
     */
    public configurePropertyMetadata(propertyName: string, propertyOptions: PropertyOptions): PropertyMetadata
    {
        let propertyMetadata = this.propertyMetadataMap.get(propertyName);

        if (Fn.isNil(propertyMetadata))
        {
            propertyMetadata = new PropertyMetadata(this, propertyName);
            
            this.propertyMetadataMap.set(propertyName, propertyMetadata);
        }

        return propertyMetadata.configure(propertyOptions);
    }

    /**
     * Configures certain inject metadata.
     * 
     * @param {number} injectIndex Inject index. 
     * @param {InjectOptions} injectOptions Inject options.
     * 
     * @returns {InjectMetadata} Configured inject metadata.
     */
    public configureInjectMetadata(injectIndex: number, injectOptions: InjectOptions): InjectMetadata
    {
        let injectMetadata = this.injectMetadataMap.get(injectIndex);

        if (Fn.isNil(injectMetadata))
        {
            injectMetadata = new InjectMetadata(this, injectIndex);
            
            this.injectMetadataMap.set(injectIndex, injectMetadata);
        }

        return injectMetadata.configure(injectOptions);
    }

    /**
     * Configures property metadata map.
     * 
     * @param {Map<string, PropertyOptions>} propertyOptionsMap Property options map.
     * 
     * @returns {TypeMetadata} Current instance of type metadata.
     */
    public configurePropertyMetadataMap(propertyOptionsMap: Map<string, PropertyOptions>): TypeMetadata
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
     * @param {Map<number, InjectOptions>} injectOptionsMap Inject options map.
     * 
     * @returns {TypeMetadata} Current instance of type metadata.
     */
    public configureInjectMetadataMap(injectOptionsMap: Map<number, InjectOptions>): TypeMetadata
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
     * @returns {PropertyMetadata} Configured property metadata.
     */
    public configureTypeOptionsCustomData(customData: CustomData): TypeMetadata
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
     * @param {TypeOptions} typeOptions Type options.
     * 
     * @returns {TypeMetadata} Current instance of type metadata.
     */
    public configure(typeOptions: TypeOptions): TypeMetadata
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
