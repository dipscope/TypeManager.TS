import { Fn } from './utils';
import { TypeSerializer } from './type.serializer';
import { TypeOptions } from './type.options';
import { TypeDeclaration } from './type.declaration';
import { TypeCtor } from './type.ctor';
import { TypeFactory } from './type.factory';
import { TypeMetadataResolver } from './type.metadata.resolver';
import { PropertyMetadata } from './property.metadata';
import { PropertyOptions } from './property.options';
import { TypeOptionsBase } from './type.options.base';
import { TypeInjector } from './type.injector';
import { InjectMetadata } from './inject.metadata';
import { InjectOptions } from './inject.options';

/**
 * Main class used to describe a certain type.
 * 
 * @type {TypeMetadata}
 */
export class TypeMetadata
{
    /**
     * Type alias.
     * 
     * Can be used to resolve a type at runtime instead of type resolver function.
     * 
     * @type {string}
     */
    public alias?: string;

    /**
     * Default value for undefined ones.
     * 
     * Assigned only when use default value option is true.
     * 
     * @type {any}
     */
    public defaultValue?: any;

    /**
     * Injectable type?
     * 
     * @type {boolean}
     */
    public injectable?: boolean;

    /**
     * Constructor function name. 
     * 
     * Defined at runtime based on the constructor function.
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
     * Type constructor function.
     * 
     * @type {TypeCtor}
     */
    public typeCtor: TypeCtor;

    /**
     * Type declaration.
     * 
     * Metadata can be declared explicitly by developer of implicitly at runtime.
     * 
     * @type {TypeDeclaration}
     */
    public typeDeclaration: TypeDeclaration;

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
     * Type metadata resolver.
     * 
     * @type {TypeMetadataResolver}
     */
    public typeMetadataResolver: TypeMetadataResolver;

    /**
     * Type options used by default.
     * 
     * @type {TypeOptionsBase}
     */
    public typeOptionsBase: TypeOptionsBase;

    /**
     * Serializer used to serialize and deserialize a type.
     * 
     * @type {TypeSerializer}
     */
    public typeSerializer?: TypeSerializer;

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
     * @param {TypeDeclaration} typeDeclaration Type declaration.
     * @param {TypeMetadataResolver} typeMetadataResolver Type declaration.
     */
    public constructor(typeCtor: TypeCtor, typeOptionsBase: TypeOptionsBase, typeDeclaration: TypeDeclaration, typeMetadataResolver: TypeMetadataResolver)
    {
        const injectTypeCtors = (Fn.extractOwnReflectMetadata('design:paramtypes', typeCtor.prototype) ?? []) as TypeCtor[];

        injectTypeCtors.forEach((injectTypeCtor, injectIndex) => 
        {
            this.configureInjectMetadata(injectIndex, { typeCtor: injectTypeCtor });
        });

        this.name                 = Fn.nameOf(typeCtor);
        this.typeCtor             = typeCtor;
        this.typeOptionsBase      = typeOptionsBase;
        this.typeDeclaration      = typeDeclaration;
        this.typeMetadataResolver = typeMetadataResolver;
        
        return;
    }

    /**
     * Checks if type metadata was declared explicitly.
     * 
     * @returns {boolean} True when declared explicitly. False otherwise.
     */
    public get declaredExplicitly(): boolean
    {
        return this.typeDeclaration === TypeDeclaration.Explicit;
    }

    /**
     * Checks if type metadata was declared implicitly.
     * 
     * @returns {boolean} True when declared implicitly. False otherwise.
     */
    public get declaredImplicitly(): boolean
    {
        return this.typeDeclaration === TypeDeclaration.Implicit;
    }

    /**
     * Resolves type metadata for provided type constructor.
     * 
     * @param {TypeCtor} typeCtor Type constructor function.
     * 
     * @returns {TypeMetadata}
     */
    public resolveTypeMetadata(typeCtor: TypeCtor): TypeMetadata
    {
        return this.typeMetadataResolver(typeCtor);
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
     * @returns {void}
     */
    public configurePropertyMetadataMap(propertyOptionsMap: Map<string, PropertyOptions>): void
    {
        propertyOptionsMap.forEach((propertyOptions, propertyName) =>
        {
            this.configurePropertyMetadata(propertyName, propertyOptions);
        });

        return;
    }

    /**
     * Configures inject metadata map.
     * 
     * @param {Map<number, InjectOptions>} injectOptionsMap Inject options map.
     * 
     * @returns {void}
     */
    public configureInjectMetadataMap(injectOptionsMap: Map<number, InjectOptions>): void
    {
        injectOptionsMap.forEach((injectOptions, injectIndex) =>
        {
            this.configureInjectMetadata(injectIndex, injectOptions);
        });

        return;
    }

    /**
     * Configures type metadata based on provided options.
     * 
     * @param {TypeOptions} typeOptions Type options.
     * 
     * @returns {TypeMetadata} Instance of type metadata.
     */
    public configure(typeOptions: TypeOptions): TypeMetadata
    {
        if (!Fn.isUndefined(typeOptions.alias)) 
        {
            this.alias = typeOptions.alias;
        }

        if (!Fn.isUndefined(typeOptions.defaultValue)) 
        {
            this.defaultValue = typeOptions.defaultValue;
        }

        if (!Fn.isUndefined(typeOptions.injectable))
        {
            this.injectable = typeOptions.injectable;
        }

        if (!Fn.isUndefined(typeOptions.useDefaultValue)) 
        {
            this.useDefaultValue = typeOptions.useDefaultValue;
        }

        if (!Fn.isUndefined(typeOptions.useImplicitConversion)) 
        {
            this.useImplicitConversion = typeOptions.useImplicitConversion;
        }

        if (!Fn.isUndefined(typeOptions.typeFactory)) 
        {
            this.typeFactory = typeOptions.typeFactory;
        }

        if (!Fn.isUndefined(typeOptions.typeInjector))
        {
            this.typeInjector = typeOptions.typeInjector;
        }

        if (!Fn.isUndefined(typeOptions.typeSerializer)) 
        {
            this.typeSerializer = typeOptions.typeSerializer;
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
