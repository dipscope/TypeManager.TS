import { Alias } from '../alias';
import { CustomKey } from '../custom-key';
import { CustomValue } from '../custom-value';
import { DefaultValueResolver } from '../default-value-resolver';
import { GenericArgument } from '../generic-argument';
import { GenericMetadata } from '../generic-metadata';
import { NamingConvention } from '../naming-convention';
import { NullValueResolver } from '../null-value-resolver';
import { Optional } from '../optional';
import { PropertyMetadata } from '../property-metadata';
import { PropertyName } from '../property-name';
import { PropertyState } from '../property-state';
import { ReferenceHandler } from '../reference-handler';
import { Serializer } from '../serializer';
import { TypeArgument } from '../type-argument';
import { TypeMetadata } from '../type-metadata';
import { ResolvedPropertyState } from './resolved-property-state';

/**
 * Represents unresolved property state.
 * 
 * @type {UnresolvedPropertyState<TDeclaringObject, TObject>}
 */
export class UnresolvedPropertyState<TDeclaringObject, TObject> implements PropertyState<TDeclaringObject, TObject>
{
    /**
     * Property metadata for which state is defined.
     * 
     * @type {PropertyMetadata<TDeclaringObject, TObject>}
     */
    public readonly propertyMetadata: PropertyMetadata<TDeclaringObject, TObject>;

    /**
     * Resolved property state.
     * 
     * @type {ResolvedPropertyState<TDeclaringObject, TObject>}
     */
    private resolvedPropertyState?: ResolvedPropertyState<TDeclaringObject, TObject>;

    /**
     * Constructor.
     * 
     * @param {PropertyMetadata<TDeclaringObject, TObject>} propertyMetadata Property metadata for which state is defined.
     */
    public constructor(propertyMetadata: PropertyMetadata<TDeclaringObject, TObject>)
    {
        this.propertyMetadata = propertyMetadata;

        return;
    }

    /**
     * Gets alias.
     * 
     * @returns {Optional<Alias>} Optional alias.
     */
    public get alias(): Optional<Alias>
    {
        let resolvedPropertyState = this.resolvedPropertyState;

        if (resolvedPropertyState === undefined)
        {
            resolvedPropertyState = this.propertyMetadata.resolvePropertyState();

            this.resolvedPropertyState = resolvedPropertyState;
        }

        return resolvedPropertyState.alias;
    }

    /**
     * Gets custom value map.
     * 
     * @returns {ReadonlyMap<CustomKey<any>, CustomValue>} Custom value map.
     */
    public get customValueMap(): ReadonlyMap<CustomKey<any>, CustomValue>
    {
        let resolvedPropertyState = this.resolvedPropertyState;

        if (resolvedPropertyState === undefined)
        {
            resolvedPropertyState = this.propertyMetadata.resolvePropertyState();

            this.resolvedPropertyState = resolvedPropertyState;
        }

        return resolvedPropertyState.customValueMap;
    }

    /**
     * Gets serialized null value resolver.
     * 
     * @returns {NullValueResolver} Serialized null value resolver.
     */
    public get serializedNullValueResolver(): NullValueResolver
    {
        let resolvedPropertyState = this.resolvedPropertyState;

        if (resolvedPropertyState === undefined)
        {
            resolvedPropertyState = this.propertyMetadata.resolvePropertyState();

            this.resolvedPropertyState = resolvedPropertyState;
        }

        return resolvedPropertyState.serializedNullValueResolver;
    }

    /**
     * Gets serialized default value resolver.
     * 
     * @returns {DefaultValueResolver} Default value resolver.
     */
    public get serializedDefaultValueResolver(): DefaultValueResolver
    {
        let resolvedPropertyState = this.resolvedPropertyState;

        if (resolvedPropertyState === undefined)
        {
            resolvedPropertyState = this.propertyMetadata.resolvePropertyState();

            this.resolvedPropertyState = resolvedPropertyState;
        }

        return resolvedPropertyState.serializedDefaultValueResolver;
    }

    /**
     * Gets deserialized null value resolver.
     * 
     * @returns {NullValueResolver} Deserialized null value resolver.
     */
    public get deserializedNullValueResolver(): NullValueResolver
    {
        let resolvedPropertyState = this.resolvedPropertyState;

        if (resolvedPropertyState === undefined)
        {
            resolvedPropertyState = this.propertyMetadata.resolvePropertyState();

            this.resolvedPropertyState = resolvedPropertyState;
        }

        return resolvedPropertyState.deserializedNullValueResolver;
    }

    /**
     * Gets deserialized default value resolver.
     * 
     * @returns {DefaultValueResolver} Deserialized default value resolver.
     */
    public get deserializedDefaultValueResolver(): DefaultValueResolver
    {
        let resolvedPropertyState = this.resolvedPropertyState;

        if (resolvedPropertyState === undefined)
        {
            resolvedPropertyState = this.propertyMetadata.resolvePropertyState();

            this.resolvedPropertyState = resolvedPropertyState;
        }

        return resolvedPropertyState.deserializedDefaultValueResolver;
    }

    /**
     * Gets serialized property name.
     * 
     * @returns {PropertyName} Serialized property name.
     */
    public get serializedPropertyName(): PropertyName
    {
        let resolvedPropertyState = this.resolvedPropertyState;

        if (resolvedPropertyState === undefined)
        {
            resolvedPropertyState = this.propertyMetadata.resolvePropertyState();

            this.resolvedPropertyState = resolvedPropertyState;
        }

        return resolvedPropertyState.serializedPropertyName;
    }

    /**
     * Gets deserialized property name.
     * 
     * @returns {PropertyName} Deserialized property name.
     */
    public get deserializedPropertyName(): PropertyName
    {
        let resolvedPropertyState = this.resolvedPropertyState;

        if (resolvedPropertyState === undefined)
        {
            resolvedPropertyState = this.propertyMetadata.resolvePropertyState();

            this.resolvedPropertyState = resolvedPropertyState;
        }

        return resolvedPropertyState.deserializedPropertyName;
    }

    /**
     * Gets serializable value.
     * 
     * @returns {boolean} Serializable value.
     */
    public get serializable(): boolean
    {
        let resolvedPropertyState = this.resolvedPropertyState;

        if (resolvedPropertyState === undefined)
        {
            resolvedPropertyState = this.propertyMetadata.resolvePropertyState();

            this.resolvedPropertyState = resolvedPropertyState;
        }

        return resolvedPropertyState.serializable;
    }

    /**
     * Gets deserializable value.
     * 
     * @returns {boolean} Deserializable value.
     */
    public get deserializable(): boolean
    {
        let resolvedPropertyState = this.resolvedPropertyState;

        if (resolvedPropertyState === undefined)
        {
            resolvedPropertyState = this.propertyMetadata.resolvePropertyState();

            this.resolvedPropertyState = resolvedPropertyState;
        }

        return resolvedPropertyState.deserializable;
    }

    /**
     * Gets generic arguments.
     * 
     * @returns {ReadonlyArray<GenericArgument<any>>} Generic arguments.
     */
    public get genericArguments(): ReadonlyArray<GenericArgument<any>>
    {
        let resolvedPropertyState = this.resolvedPropertyState;

        if (resolvedPropertyState === undefined)
        {
            resolvedPropertyState = this.propertyMetadata.resolvePropertyState();

            this.resolvedPropertyState = resolvedPropertyState;
        }

        return resolvedPropertyState.genericArguments;
    }

    /**
     * Gets generic metadatas.
     * 
     * @returns {ReadonlyArray<GenericMetadata<any>>} Generic metadatas.
     */
    public get genericMetadatas(): ReadonlyArray<GenericMetadata<any>>
    {
        let resolvedPropertyState = this.resolvedPropertyState;

        if (resolvedPropertyState === undefined)
        {
            resolvedPropertyState = this.propertyMetadata.resolvePropertyState();

            this.resolvedPropertyState = resolvedPropertyState;
        }

        return resolvedPropertyState.genericMetadatas;
    }

    /**
     * Gets naming convention.
     * 
     * @returns {Optional<NamingConvention>} Naming convention.
     */
    public get namingConvention(): Optional<NamingConvention>
    {
        let resolvedPropertyState = this.resolvedPropertyState;

        if (resolvedPropertyState === undefined)
        {
            resolvedPropertyState = this.propertyMetadata.resolvePropertyState();

            this.resolvedPropertyState = resolvedPropertyState;
        }

        return resolvedPropertyState.namingConvention;
    }

    /**
     * Gets reference handler.
     * 
     * @returns {ReferenceHandler} Reference handler.
     */
    public get referenceHandler(): ReferenceHandler
    {
        let resolvedPropertyState = this.resolvedPropertyState;

        if (resolvedPropertyState === undefined)
        {
            resolvedPropertyState = this.propertyMetadata.resolvePropertyState();

            this.resolvedPropertyState = resolvedPropertyState;
        }

        return resolvedPropertyState.referenceHandler;
    }
    
    /**
     * Gets serializer.
     * 
     * @returns {Serializer<TObject>} Serializer.
     */
    public get serializer(): Serializer<TObject>
    {
        let resolvedPropertyState = this.resolvedPropertyState;

        if (resolvedPropertyState === undefined)
        {
            resolvedPropertyState = this.propertyMetadata.resolvePropertyState();

            this.resolvedPropertyState = resolvedPropertyState;
        }

        return resolvedPropertyState.serializer;
    }

    /**
     * Gets type argument.
     * 
     * @returns {TypeArgument<TObject>} Type argument.
     */
    public get typeArgument(): TypeArgument<TObject>
    {
        let resolvedPropertyState = this.resolvedPropertyState;

        if (resolvedPropertyState === undefined)
        {
            resolvedPropertyState = this.propertyMetadata.resolvePropertyState();

            this.resolvedPropertyState = resolvedPropertyState;
        }

        return resolvedPropertyState.typeArgument;
    }

    /**
     * Gets type metadata.
     * 
     * @returns {TypeMetadata<TObject>} Type metadata.
     */
    public get typeMetadata(): TypeMetadata<TObject>
    {
        let resolvedPropertyState = this.resolvedPropertyState;

        if (resolvedPropertyState === undefined)
        {
            resolvedPropertyState = this.propertyMetadata.resolvePropertyState();

            this.resolvedPropertyState = resolvedPropertyState;
        }

        return resolvedPropertyState.typeMetadata;
    }

    /**
     * Gets indicator if null value should be preserved.
     * 
     * @returns {boolean} Preserve null indicator.
     */
    public get preserveNull(): boolean
    {
        let resolvedPropertyState = this.resolvedPropertyState;

        if (resolvedPropertyState === undefined)
        {
            resolvedPropertyState = this.propertyMetadata.resolvePropertyState();

            this.resolvedPropertyState = resolvedPropertyState;
        }

        return resolvedPropertyState.preserveNull;
    }

    /**
     * Gets indicator if default value should be used.
     * 
     * @returns {boolean} Use default value indicator.
     */
    public get useDefaultValue(): boolean
    {
        let resolvedPropertyState = this.resolvedPropertyState;

        if (resolvedPropertyState === undefined)
        {
            resolvedPropertyState = this.propertyMetadata.resolvePropertyState();

            this.resolvedPropertyState = resolvedPropertyState;
        }

        return resolvedPropertyState.useDefaultValue;
    }

    /**
     * Gets indicator if implicit conversion should be used.
     * 
     * @returns {boolean} Use implicit conversion indicator.
     */
    public get useImplicitConversion(): boolean
    {
        let resolvedPropertyState = this.resolvedPropertyState;

        if (resolvedPropertyState === undefined)
        {
            resolvedPropertyState = this.propertyMetadata.resolvePropertyState();

            this.resolvedPropertyState = resolvedPropertyState;
        }

        return resolvedPropertyState.useImplicitConversion;
    }
}
