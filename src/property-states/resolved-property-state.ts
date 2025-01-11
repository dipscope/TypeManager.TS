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

/**
 * Represents resolved property state.
 * 
 * @type {ResolvedPropertyState<TDeclaringObject, TObject>}
 */
export class ResolvedPropertyState<TDeclaringObject, TObject> implements PropertyState<TDeclaringObject, TObject>
{
    /**
     * Property metadata for which state is defined.
     * 
     * @type {PropertyMetadata<TDeclaringObject, TObject>}
     */
    public readonly propertyMetadata: PropertyMetadata<TDeclaringObject, TObject>;

    /**
     * Alias.
     * 
     * @type {Optional<Alias>}
     */
    public readonly alias: Optional<Alias>;

    /**
     * Custom value map.
     * 
     * @type {ReadonlyMap<CustomKey<any>, CustomValue>}
     */
    public readonly customValueMap: ReadonlyMap<CustomKey<any>, CustomValue>;

    /**
     * Serialized null value resolver.
     * 
     * @type {NullValueResolver}
     */
    public readonly serializedNullValueResolver: NullValueResolver;

    /**
     * Serialized default value resolver.
     * 
     * @type {DefaultValueResolver}
     */
    public readonly serializedDefaultValueResolver: DefaultValueResolver;

    /**
     * Deserialized null value resolver.
     * 
     * @type {NullValueResolver}
     */
    public readonly deserializedNullValueResolver: NullValueResolver;

    /**
     * Deserialized default value resolver.
     * 
     * @type {DefaultValueResolver}
     */
    public readonly deserializedDefaultValueResolver: DefaultValueResolver;

    /**
     * Serialized property name.
     * 
     * @type {PropertyName}
     */
    public readonly serializedPropertyName: PropertyName;

    /**
     * Deserialized property name.
     * 
     * @type {PropertyName}
     */
    public readonly deserializedPropertyName: PropertyName;

    /**
     * Serializable value.
     * 
     * @type {boolean}
     */
    public readonly serializable: boolean;

    /**
     * Deserializable value.
     * 
     * @type {boolean}
     */
    public readonly deserializable: boolean;

    /**
     * Generic arguments.
     * 
     * @type {ReadonlyArray<GenericArgument<any>>}
     */
    public readonly genericArguments: ReadonlyArray<GenericArgument<any>>;

    /**
     * Generic metadatas.
     * 
     * @type {ReadonlyArray<GenericMetadata<any>>}
     */
    public readonly genericMetadatas: ReadonlyArray<GenericMetadata<any>>;

    /**
     * Naming convention.
     * 
     * @type {Optional<NamingConvention>}
     */
    public readonly namingConvention: Optional<NamingConvention>;

    /**
     * Reference handler.
     * 
     * @type {ReferenceHandler}
     */
    public readonly referenceHandler: ReferenceHandler;
    
    /**
     * Serializer.
     * 
     * @type {Serializer<TObject>}
     */
    public readonly serializer: Serializer<TObject>;

    /**
     * Type argument.
     * 
     * @type {TypeArgument<TObject>}
     */
    public readonly typeArgument: TypeArgument<TObject>;

    /**
     * Type metadata.
     * 
     * @type {TypeMetadata<TObject>}
     */
    public readonly typeMetadata: TypeMetadata<TObject>;

    /**
     * Indicator if null value should be preserved.
     * 
     * @type {boolean}
     */
    public readonly preserveNull: boolean;

    /**
     * Indicator if default value should be used.
     * 
     * @type {boolean}
     */
    public readonly useDefaultValue: boolean;

    /**
     * Indicator if implicit conversion should be used.
     * 
     * @type {boolean}
     */
    public readonly useImplicitConversion: boolean;

    /**
     * Constructor.
     * 
     * @param {PropertyMetadata<TDeclaringObject, TObject>} propertyMetadata Property metadata for which state is defined.
     * @param {Optional<Alias>} alias Alias.
     * @param {ReadonlyMap<CustomKey<any>, CustomValue>} customValueMap Custom value map.
     * @param {NullValueResolver} serializedNullValueResolver Serialized null value resolver.
     * @param {DefaultValueResolver} serializedDefaultValueResolver Serialized default value resolver.
     * @param {NullValueResolver} deserializedNullValueResolver Deserialized null value resolver.
     * @param {DefaultValueResolver} deserializedDefaultValueResolver Deserialized default value resolver.
     * @param {PropertyName} serializedPropertyName Serialized property name.
     * @param {PropertyName} deserializedPropertyName Deserialized property name.
     * @param {boolean} serializable Serializable value.
     * @param {boolean} deserializable Deserializable value.
     * @param {ReadonlyArray<GenericArgument<any>>} genericArguments Generic arguments.
     * @param {ReadonlyArray<GenericMetadata<any>>} genericMetadatas Generic metadatas.
     * @param {Optional<NamingConvention>} namingConvention Naming convention.
     * @param {ReferenceHandler} referenceHandler Reference handler.
     * @param {Serializer<TObject>} serializer Serializer.
     * @param {TypeArgument<TObject>} typeArgument Type argument.
     * @param {TypeMetadata<TObject>} typeMetadata Type metadata.
     * @param {boolean} preserveNull Indicator if null value should be preserved.
     * @param {boolean} useDefaultValue Indicator if default value should be used.
     * @param {boolean} useImplicitConversion Indicator if implicit conversion should be used.
     */
    public constructor(
        propertyMetadata: PropertyMetadata<TDeclaringObject, TObject>,
        alias: Optional<Alias>,
        customValueMap: ReadonlyMap<CustomKey<any>, CustomValue>,
        serializedNullValueResolver: NullValueResolver,
        serializedDefaultValueResolver: DefaultValueResolver,
        deserializedNullValueResolver: NullValueResolver,
        deserializedDefaultValueResolver: DefaultValueResolver,
        serializedPropertyName: PropertyName,
        deserializedPropertyName: PropertyName,
        serializable: boolean,
        deserializable: boolean,
        genericArguments: ReadonlyArray<GenericArgument<any>>,
        genericMetadatas: ReadonlyArray<GenericMetadata<any>>,
        namingConvention: Optional<NamingConvention>,
        referenceHandler: ReferenceHandler,
        serializer: Serializer<TObject>,
        typeArgument: TypeArgument<TObject>,
        typeMetadata: TypeMetadata<TObject>,
        preserveNull: boolean,
        useDefaultValue: boolean,
        useImplicitConversion: boolean
    )
    {
        this.propertyMetadata = propertyMetadata;
        this.alias = alias;
        this.customValueMap = customValueMap;
        this.serializedNullValueResolver = serializedNullValueResolver;
        this.serializedDefaultValueResolver = serializedDefaultValueResolver;
        this.deserializedNullValueResolver = deserializedNullValueResolver;
        this.deserializedDefaultValueResolver = deserializedDefaultValueResolver;
        this.serializedPropertyName = serializedPropertyName;
        this.deserializedPropertyName = deserializedPropertyName;
        this.serializable = serializable;
        this.deserializable = deserializable;
        this.genericArguments = genericArguments;
        this.genericMetadatas = genericMetadatas;
        this.namingConvention = namingConvention;
        this.referenceHandler = referenceHandler;
        this.serializer = serializer;
        this.typeArgument = typeArgument;
        this.typeMetadata = typeMetadata;
        this.preserveNull = preserveNull;
        this.useDefaultValue = useDefaultValue;
        this.useImplicitConversion = useImplicitConversion;

        return;
    }
}
