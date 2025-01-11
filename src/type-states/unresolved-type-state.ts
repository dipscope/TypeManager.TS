import { Alias } from '../alias';
import { CustomKey } from '../custom-key';
import { CustomValue } from '../custom-value';
import { DefaultValue } from '../default-value';
import { DefaultValueResolver } from '../default-value-resolver';
import { Discriminant } from '../discriminant';
import { Discriminator } from '../discriminator';
import { Factory } from '../factory';
import { InjectIndex } from '../inject-index';
import { InjectMetadata } from '../inject-metadata';
import { InjectOptions } from '../inject-options';
import { InjectSorter } from '../inject-sorter';
import { Injector } from '../injector';
import { Logger } from '../logger';
import { NamingConvention } from '../naming-convention';
import { NullValueResolver } from '../null-value-resolver';
import { Optional } from '../optional';
import { PropertyMetadata } from '../property-metadata';
import { PropertyName } from '../property-name';
import { PropertyOptions } from '../property-options';
import { PropertySorter } from '../property-sorter';
import { ReferenceHandler } from '../reference-handler';
import { Serializer } from '../serializer';
import { TypeArgument } from '../type-argument';
import { TypeFn } from '../type-fn';
import { TypeMetadata } from '../type-metadata';
import { TypeState } from '../type-state';
import { ResolvedTypeState } from './resolved-type-state';

/**
 * Represents unresolved type state.
 * 
 * @type {UnresolvedTypeState<TObject>}
 */
export class UnresolvedTypeState<TObject> implements TypeState<TObject>
{
    /**
     * Type metadata for which state is defined.
     * 
     * @type {TypeMetadata<TObject>}
     */
    public readonly typeMetadata: TypeMetadata<TObject>;

    /**
     * Resolved type state.
     * 
     * @type {ResolvedTypeState<TObject>}
     */
    private resolvedTypeState?: ResolvedTypeState<TObject>;

    /**
     * Constructor.
     * 
     * @param {TypeMetadata<TObject>} typeMetadata Type metadata for which state is defined.
     */
    public constructor(typeMetadata: TypeMetadata<TObject>)
    {
        this.typeMetadata = typeMetadata;

        return;
    }

    /**
     * Gets alias.
     * 
     * @returns {Optional<Alias>} Alias.
     */
    public get alias(): Optional<Alias>
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.alias;
    }

    /**
     * Gets custom value map.
     * 
     * @returns {ReadonlyMap<CustomKey<any>, CustomValue>} Custom value map.
     */
    public get customValueMap(): ReadonlyMap<CustomKey<any>, CustomValue>
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.customValueMap;
    }

    /**
     * Gets serialized null value resolver.
     * 
     * @returns {NullValueResolver} Serialized null value resolver.
     */
    public get serializedNullValueResolver(): NullValueResolver
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.serializedNullValueResolver;
    }

    /**
     * Gets serialized default value.
     * 
     * @returns {DefaultValue} Serialized default value.
     */
    public get serializedDefaultValue(): DefaultValue
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.serializedDefaultValue;
    }

    /**
     * Gets serialized default value resolver.
     * 
     * @returns {DefaultValueResolver} Serialized default value resolver.
     */
    public get serializedDefaultValueResolver(): DefaultValueResolver
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.serializedDefaultValueResolver;
    }

    /**
     * Gets deserialized null value resolver.
     * 
     * @returns {NullValueResolver} Deserialized null value resolver.
     */
    public get deserializedNullValueResolver(): NullValueResolver
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.deserializedNullValueResolver;
    }

    /**
     * Gets deserialized default value.
     * 
     * @returns {DefaultValue} Serialized default value.
     */
    public get deserializedDefaultValue(): DefaultValue
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.deserializedDefaultValue;
    }

    /**
     * Gets deserialized default value resolver.
     * 
     * @returns {DefaultValueResolver} Deserialized default value resolver.
     */
    public get deserializedDefaultValueResolver(): DefaultValueResolver
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.deserializedDefaultValueResolver;
    }

    /**
     * Gets discriminant.
     * 
     * @returns {Discriminant} Discriminant.
     */
    public get discriminant(): Discriminant
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.discriminant;
    }

    /**
     * Gets discriminator.
     * 
     * @returns {Discriminator} Discriminator.
     */
    public get discriminator(): Discriminator
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.discriminator;
    }

    /**
     * Gets factory.
     * 
     * @returns {Factory} Factory.
     */
    public get factory(): Factory
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.factory;
    }

    /**
     * Gets injectable value.
     * 
     * @returns {boolean} Injectable value.
     */
    public get injectable(): boolean
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.injectable;
    }

    /**
     * Gets injector.
     * 
     * @returns {Injector} Injector.
     */
    public get injector(): Injector
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.injector;
    }

    /**
     * Gets logger.
     * 
     * @returns {Logger} Logger.
     */
    public get logger(): Logger
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.logger;
    }

    /**
     * Gets naming convention.
     * 
     * @returns {Optional<NamingConvention>} Naming convention.
     */
    public get namingConvention(): Optional<NamingConvention>
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.namingConvention;
    }

    /**
     * Gets indicator if current type metadata is polymorphic.
     * 
     * @returns {boolean} Indicator if polymorphic.
     */
    public get polymorphic(): boolean
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.polymorphic;
    }
    
    /**
     * Gets type metadata map.
     * 
     * @returns {ReadonlyMap<TypeFn<any>, TypeMetadata<any>>} Type metadata map.
     */
    public get typeMetadataMap(): ReadonlyMap<TypeFn<any>, TypeMetadata<any>>
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.typeMetadataMap;
    }
    
    /**
     * Gets indicator if discriminator should be preserved.
     * 
     * @returns {boolean} Preserve discriminator.
     */
    public get preserveDiscriminator(): boolean
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.preserveDiscriminator;
    }

    /**
     * Gets reference handler.
     * 
     * @returns {ReferenceHandler} Reference handler.
     */
    public get referenceHandler(): ReferenceHandler
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.referenceHandler;
    }

    /**
     * Gets serializer.
     * 
     * @returns {Serializer<TObject>} Serializer.
     */
    public get serializer(): Serializer<TObject>
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.serializer;
    }

    /**
     * Gets indicator if null value should be preserved.
     * 
     * @returns {boolean} Preserve null value.
     */
    public get preserveNull(): boolean
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.preserveNull;
    }

    /**
     * Gets indicator if default value should be used.
     * 
     * @returns {boolean} Use default value.
     */
    public get useDefaultValue(): boolean
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.useDefaultValue;
    }

    /**
     * Gets indicator if implicit conversion should be used.
     * 
     * @returns {boolean} Use implicit conversion.
     */
    public get useImplicitConversion(): boolean
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.useImplicitConversion;
    }

    /**
     * Gets property sorter.
     * 
     * @returns {Optional<PropertySorter>} Property sorter.
     */
    public get propertySorter(): Optional<PropertySorter>
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.propertySorter;
    }

    /**
     * Gets sorted property metadatas.
     * 
     * @returns {ReadonlyArray<PropertyMetadata<TObject, any>>} Sorted property metadatas.
     */
    public get sortedPropertyMetadatas(): ReadonlyArray<PropertyMetadata<TObject, any>>
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.sortedPropertyMetadatas;
    }

    /**
     * Gets inject sorter.
     * 
     * @returns {Optional<InjectSorter>} Inject sorter.
     */
    public get injectSorter(): Optional<InjectSorter>
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.injectSorter;
    }

    /**
     * Gets sorted inject metadatas.
     * 
     * @returns {ReadonlyArray<InjectMetadata<TObject, any>>} Sorted inject metadatas.
     */
    public get sortedInjectMetadatas(): ReadonlyArray<InjectMetadata<TObject, any>>
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.sortedInjectMetadatas;
    }

    /**
     * Gets parent type arguments.
     * 
     * @returns {ReadonlyArray<TypeArgument<any>>} Parent type arguments.
     */
    public get parentTypeArguments(): ReadonlyArray<TypeArgument<any>>
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.parentTypeArguments;
    }

    /**
     * Gets parent type metadatas.
     * 
     * @returns {ReadonlyArray<TypeMetadata<any>>} Parent type metadatas.
     */
    public get parentTypeMetadatas(): ReadonlyArray<TypeMetadata<any>>
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.parentTypeMetadatas;
    }

    /**
     * Gets own parent type metadatas.
     * 
     * @returns {ReadonlyArray<TypeMetadata<any>>} Own parent type metadatas.
     */
    public get ownParentTypeMetadatas(): ReadonlyArray<TypeMetadata<any>>
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.ownParentTypeMetadatas;
    }

    /**
     * Gets child type metadatas.
     * 
     * @returns {ReadonlyArray<TypeMetadata<any>>} Child type metadatas.
     */
    public get childTypeMetadatas(): ReadonlyArray<TypeMetadata<any>>
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.childTypeMetadatas;
    }

    /**
     * Gets own child type metadatas.
     * 
     * @returns {ReadonlyArray<TypeMetadata<any>>} Own child type metadatas.
     */
    public get ownChildTypeMetadatas(): ReadonlyArray<TypeMetadata<any>>
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.ownChildTypeMetadatas;
    }

    /**
     * Gets property options map.
     * 
     * @returns {ReadonlyMap<PropertyName, PropertyOptions<any>>} Property options map.
     */
    public get propertyOptionsMap(): ReadonlyMap<PropertyName, PropertyOptions<any>>
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.propertyOptionsMap;
    }

    /**
     * Gets property metadata map.
     * 
     * @returns {ReadonlyMap<PropertyName, PropertyMetadata<TObject, any>>} Property metadata map.
     */
    public get propertyMetadataMap(): ReadonlyMap<PropertyName, PropertyMetadata<TObject, any>>
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.propertyMetadataMap;
    }

    /**
     * Gets own property metadata map.
     * 
     * @returns {ReadonlyMap<PropertyName, PropertyMetadata<TObject, any>>} Own property metadata map.
     */
    public get ownPropertyMetadataMap(): ReadonlyMap<PropertyName, PropertyMetadata<TObject, any>>
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.ownPropertyMetadataMap;
    }

    /**
     * Gets inject options map.
     * 
     * @returns {ReadonlyMap<InjectIndex, InjectOptions<any>>} Inject options map.
     */
    public get injectOptionsMap(): ReadonlyMap<InjectIndex, InjectOptions<any>>
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();

            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.injectOptionsMap;
    }

    /**
     * Gets inject metadata map.
     * 
     * @returns {ReadonlyMap<InjectIndex, InjectMetadata<TObject, any>>} Inject metadata map.
     */
    public get injectMetadataMap(): ReadonlyMap<InjectIndex, InjectMetadata<TObject, any>>
    {
        let resolvedTypeState = this.resolvedTypeState;

        if (resolvedTypeState === undefined)
        {
            resolvedTypeState = this.typeMetadata.resolveTypeState();
            
            this.resolvedTypeState = resolvedTypeState;
        }

        return resolvedTypeState.injectMetadataMap;
    }
}
