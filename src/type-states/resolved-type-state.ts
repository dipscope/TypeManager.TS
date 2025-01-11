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

/**
 * Represents resolved type state.
 * 
 * @type {ResolvedTypeState<TObject>}
 */
export class ResolvedTypeState<TObject> implements TypeState<TObject>
{
    /**
     * Type metadata for which state is defined.
     * 
     * @type {TypeMetadata<TObject>}
     */
    public readonly typeMetadata: TypeMetadata<TObject>;

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
     * Serialized default value.
     * 
     * @type {DefaultValue}
     */
    public readonly serializedDefaultValue: DefaultValue;
    
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
     * Deserialized default value.
     * 
     * @type {DefaultValue}
     */
    public readonly deserializedDefaultValue: DefaultValue;

    /**
     * Deserialized default value resolver.
     * 
     * @type {DefaultValueResolver}
     */
    public readonly deserializedDefaultValueResolver: DefaultValueResolver;

    /**
     * Discriminant.
     * 
     * @type {Discriminant}
     */
    public readonly discriminant: Discriminant;

    /**
     * Discriminator.
     * 
     * @type {Discriminator}
     */
    public readonly discriminator: Discriminator;

    /**
     * Factory.
     * 
     * @type {Factory}
     */
    public readonly factory: Factory;

    /**
     * Injectable value.
     * 
     * @type {Factory}
     */
    public readonly injectable: boolean;

    /**
     * Injector.
     * 
     * @type {Injector}
     */
    public readonly injector: Injector;

    /**
     * Logger.
     * 
     * @type {Logger}
     */
    public readonly logger: Logger;
    
    /**
     * Naming convention.
     * 
     * @type {Optional<NamingConvention>}
     */
    public readonly namingConvention: Optional<NamingConvention>;

    /**
     * Indicator if current type metadata is polymorphic.
     * 
     * @type {boolean}
     */
    public readonly polymorphic: boolean;

    /**
     * Type metadata map.
     * 
     * @type {ReadonlyMap<TypeFn<any>, TypeMetadata<any>>}
     */
    public readonly typeMetadataMap: ReadonlyMap<TypeFn<any>, TypeMetadata<any>>;

    /**
     * Indicator if discriminator should be preserved.
     * 
     * @type {boolean}
     */
    public readonly preserveDiscriminator: boolean;

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
     * Property sorter.
     * 
     * @type {Optional<PropertySorter>}
     */
    public readonly propertySorter: Optional<PropertySorter>;

    /**
     * Sorted property metadatas.
     * 
     * @type {ReadonlyArray<PropertyMetadata<TObject, any>>}
     */
    public readonly sortedPropertyMetadatas: ReadonlyArray<PropertyMetadata<TObject, any>>;

    /**
     * Inject sorter.
     * 
     * @type {Optional<InjectSorter>}
     */
    public readonly injectSorter: Optional<InjectSorter>;

    /**
     * Sorted inject metadatas.
     * 
     * @type {ReadonlyArray<InjectMetadata<TObject, any>>}
     */
    public readonly sortedInjectMetadatas: ReadonlyArray<InjectMetadata<TObject, any>>;

    /**
     * Parent type arguments.
     * 
     * @type {ReadonlyArray<TypeArgument<any>>}
     */
    public readonly parentTypeArguments: ReadonlyArray<TypeArgument<any>>;
    
    /**
     * Parent type metadatas.
     * 
     * @type {ReadonlyArray<TypeMetadata<any>>}
     */
    public readonly parentTypeMetadatas: ReadonlyArray<TypeMetadata<any>>;

    /**
     * Own parent type metadatas.
     * 
     * @type {ReadonlyArray<TypeMetadata<any>>}
     */
    public readonly ownParentTypeMetadatas: ReadonlyArray<TypeMetadata<any>>;

    /**
     * Child type metadatas.
     * 
     * @type {ReadonlyArray<TypeMetadata<any>>}
     */
    public readonly childTypeMetadatas: ReadonlyArray<TypeMetadata<any>>;
    
    /**
     * Own child type metadatas.
     * 
     * @type {ReadonlyArray<TypeMetadata<any>>}
     */
    public readonly ownChildTypeMetadatas: ReadonlyArray<TypeMetadata<any>>;

    /**
     * Property options map.
     * 
     * @type {ReadonlyMap<PropertyName, PropertyOptions<any>>}
     */
    public readonly propertyOptionsMap: ReadonlyMap<PropertyName, PropertyOptions<any>>;

    /**
     * Property metadata map.
     * 
     * @type {ReadonlyMap<PropertyName, PropertyMetadata<TObject, any>>}
     */
    public readonly propertyMetadataMap: ReadonlyMap<PropertyName, PropertyMetadata<TObject, any>>;

    /**
     * Own property metadata map.
     * 
     * @type {ReadonlyMap<PropertyName, PropertyMetadata<TObject, any>>}
     */
    public readonly ownPropertyMetadataMap: ReadonlyMap<PropertyName, PropertyMetadata<TObject, any>>;

    /**
     * Inject options map.
     * 
     * @type {ReadonlyMap<InjectIndex, PropertyOptions<any>>}
     */
    public readonly injectOptionsMap: ReadonlyMap<InjectIndex, InjectOptions<any>>;

    /**
     * Inject metadata map.
     * 
     * @type {ReadonlyMap<InjectIndex, InjectMetadata<TObject, any>>}
     */
    public readonly injectMetadataMap: ReadonlyMap<InjectIndex, InjectMetadata<TObject, any>>;

    /**
     * Constructor.
     * 
     * @param {TypeMetadata<TObject>} typeMetadata Type metadata for which state is defined.
     * @param {Optional<Alias>} alias Alias.
     * @param {ReadonlyMap<CustomKey<any>, CustomValue>} customValueMap Custom value map.
     * @param {NullValueResolver} serializedNullValueResolver Serialized null value resolver.
     * @param {DefaultValue} serializedDefaultValue Serialized default value.
     * @param {DefaultValueResolver} serializedDefaultValueResolver Serialized default value resolver.
     * @param {NullValueResolver} deserializedNullValueResolver Deserialized null value resolver.
     * @param {DefaultValue} deserializedDefaultValue Deserialized default value.
     * @param {DefaultValueResolver} deserializedDefaultValueResolver Deserialized default value resolver.
     * @param {Discriminant} discriminant Discriminant.
     * @param {Discriminator} discriminator Discriminator.
     * @param {Factory} factory Factory.
     * @param {boolean} injectable Injectable value.
     * @param {Injector} injector Injector.
     * @param {Logger} logger Logger.
     * @param {Optional<NamingConvention>} namingConvention Naming convention.
     * @param {boolean} polymorphic Indicator if current type metadata is polymorphic.
     * @param {ReadonlyMap<TypeFn<any>, TypeMetadata<any>>} typeMetadataMap Type metadata map.
     * @param {boolean} preserveDiscriminator Indicator if discriminator should be preserved.
     * @param {ReferenceHandler} referenceHandler Reference handler.
     * @param {Serializer<TObject>} serializer Serializer.
     * @param {boolean} preserveNull Indicator if null value should be preserved.
     * @param {boolean} useDefaultValue Indicator if default value should be used.
     * @param {boolean} useImplicitConversion Indicator if implicit conversion should be used.
     * @param {Optional<PropertySorter>} propertySorter Property sorter.
     * @param {ReadonlyArray<PropertyMetadata<TObject, any>>} sortedPropertyMetadatas Sorted property metadatas.
     * @param {Optional<InjectSorter>} injectSorter Inject sorter.
     * @param {ReadonlyArray<InjectMetadata<TObject, any>>} sortedInjectMetadatas Sorted inject metadatas.
     * @param {ReadonlyArray<TypeArgument<any>>} parentTypeArguments Parent type arguments.
     * @param {ReadonlyArray<TypeMetadata<any>>} parentTypeMetadatas Parent type metadatas.
     * @param {ReadonlyArray<TypeMetadata<any>>} ownParentTypeMetadatas Own parent type metadatas.
     * @param {ReadonlyArray<TypeMetadata<any>>} childTypeMetadatas Child type metadatas.
     * @param {ReadonlyArray<TypeMetadata<any>>} ownChildTypeMetadatas Own child type metadatas.
     * @param {ReadonlyMap<PropertyName, PropertyOptions<any>>} propertyOptionsMap Property options map.
     * @param {ReadonlyMap<PropertyName, PropertyMetadata<TObject, any>>} propertyMetadataMap Property metadata map.
     * @param {ReadonlyMap<PropertyName, PropertyMetadata<TObject, any>>} ownPropertyMetadataMap Own property metadata map.
     * @param {ReadonlyMap<InjectIndex, PropertyOptions<any>>} injectOptionsMap Inject options map.
     * @param {ReadonlyMap<InjectIndex, InjectMetadata<TObject, any>>} injectMetadataMap Inject metadata map.
     */
    public constructor(
        typeMetadata: TypeMetadata<TObject>,
        alias: Optional<Alias>,
        customValueMap: ReadonlyMap<CustomKey<any>, CustomValue>,
        serializedNullValueResolver: NullValueResolver,
        serializedDefaultValue: DefaultValue,
        serializedDefaultValueResolver: DefaultValueResolver,
        deserializedNullValueResolver: NullValueResolver,
        deserializedDefaultValue: DefaultValue,
        deserializedDefaultValueResolver: DefaultValueResolver,
        discriminant: Discriminant,
        discriminator: Discriminator,
        factory: Factory,
        injectable: boolean,
        injector: Injector,
        logger: Logger,
        namingConvention: Optional<NamingConvention>,
        polymorphic: boolean,
        typeMetadataMap: ReadonlyMap<TypeFn<any>, TypeMetadata<any>>,
        preserveDiscriminator: boolean,
        referenceHandler: ReferenceHandler,
        serializer: Serializer<TObject>,
        preserveNull: boolean,
        useDefaultValue: boolean,
        useImplicitConversion: boolean,
        propertySorter: Optional<PropertySorter>,
        sortedPropertyMetadatas: ReadonlyArray<PropertyMetadata<TObject, any>>,
        injectSorter: Optional<InjectSorter>,
        sortedInjectMetadatas: ReadonlyArray<InjectMetadata<TObject, any>>,
        parentTypeArguments: ReadonlyArray<TypeArgument<any>>,
        parentTypeMetadatas: ReadonlyArray<TypeMetadata<any>>,
        ownParentTypeMetadatas: ReadonlyArray<TypeMetadata<any>>,
        childTypeMetadatas: ReadonlyArray<TypeMetadata<any>>,
        ownChildTypeMetadatas: ReadonlyArray<TypeMetadata<any>>,
        propertyOptionsMap: ReadonlyMap<PropertyName, PropertyOptions<any>>,
        propertyMetadataMap: ReadonlyMap<PropertyName, PropertyMetadata<TObject, any>>,
        ownPropertyMetadataMap: ReadonlyMap<PropertyName, PropertyMetadata<TObject, any>>,
        injectOptionsMap: ReadonlyMap<InjectIndex, PropertyOptions<any>>,
        injectMetadataMap: ReadonlyMap<InjectIndex, InjectMetadata<TObject, any>>
    ) 
    {
        this.typeMetadata = typeMetadata;
        this.alias = alias;
        this.customValueMap = customValueMap;
        this.serializedNullValueResolver = serializedNullValueResolver;
        this.serializedDefaultValue = serializedDefaultValue;
        this.serializedDefaultValueResolver = serializedDefaultValueResolver;
        this.deserializedNullValueResolver = deserializedNullValueResolver;
        this.deserializedDefaultValue = deserializedDefaultValue;
        this.deserializedDefaultValueResolver = deserializedDefaultValueResolver;
        this.discriminant = discriminant;
        this.discriminator = discriminator;
        this.factory = factory;
        this.injectable = injectable;
        this.injector = injector;
        this.logger = logger;
        this.namingConvention = namingConvention;
        this.polymorphic = polymorphic;
        this.typeMetadataMap = typeMetadataMap;
        this.preserveDiscriminator = preserveDiscriminator;
        this.referenceHandler = referenceHandler;
        this.serializer = serializer;
        this.preserveNull = preserveNull;
        this.useDefaultValue = useDefaultValue;
        this.useImplicitConversion = useImplicitConversion;
        this.propertySorter = propertySorter;
        this.sortedPropertyMetadatas = sortedPropertyMetadatas;
        this.injectSorter = injectSorter;
        this.sortedInjectMetadatas = sortedInjectMetadatas;
        this.parentTypeArguments = parentTypeArguments;
        this.parentTypeMetadatas = parentTypeMetadatas;
        this.ownParentTypeMetadatas = ownParentTypeMetadatas;
        this.childTypeMetadatas = childTypeMetadatas;
        this.ownChildTypeMetadatas = ownChildTypeMetadatas;
        this.propertyOptionsMap = propertyOptionsMap;
        this.propertyMetadataMap = propertyMetadataMap;
        this.ownPropertyMetadataMap = ownPropertyMetadataMap;
        this.injectOptionsMap = injectOptionsMap;
        this.injectMetadataMap = injectMetadataMap;

        return;
    }
}
