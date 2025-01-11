import { Alias } from './alias';
import { CustomKey } from './custom-key';
import { CustomValue } from './custom-value';
import { DefaultValue } from './default-value';
import { DefaultValueResolver } from './default-value-resolver';
import { Discriminant } from './discriminant';
import { Discriminator } from './discriminator';
import { Factory } from './factory';
import { InjectIndex } from './inject-index';
import { InjectMetadata } from './inject-metadata';
import { InjectOptions } from './inject-options';
import { InjectSorter } from './inject-sorter';
import { Injector } from './injector';
import { Logger } from './logger';
import { NamingConvention } from './naming-convention';
import { NullValueResolver } from './null-value-resolver';
import { Optional } from './optional';
import { PropertyMetadata } from './property-metadata';
import { PropertyName } from './property-name';
import { PropertyOptions } from './property-options';
import { PropertySorter } from './property-sorter';
import { ReferenceHandler } from './reference-handler';
import { Serializer } from './serializer';
import { TypeArgument } from './type-argument';
import { TypeFn } from './type-fn';
import { TypeMetadata } from './type-metadata';

/**
 * Represents a type state at a certain moment in time.
 * 
 * @type {TypeState<TObject>}
 */
export interface TypeState<TObject>
{
    /**
     * Type metadata for which state is defined.
     * 
     * @type {TypeMetadata<TObject>}
     */
    readonly typeMetadata: TypeMetadata<TObject>;

    /**
     * Alias.
     * 
     * @type {Optional<Alias>}
     */
    readonly alias: Optional<Alias>;

    /**
     * Custom value map.
     * 
     * @type {ReadonlyMap<CustomKey<any>, CustomValue>}
     */
    readonly customValueMap: ReadonlyMap<CustomKey<any>, CustomValue>;

    /**
     * Serialized null value resolver.
     * 
     * @type {NullValueResolver}
     */
    readonly serializedNullValueResolver: NullValueResolver;

    /**
     * Serialized default value.
     * 
     * @type {DefaultValue}
     */
    readonly serializedDefaultValue: DefaultValue;

    /**
     * Serialized default value resolver.
     * 
     * @type {DefaultValueResolver}
     */
    readonly serializedDefaultValueResolver: DefaultValueResolver;

    /**
     * Deserialized null value resolver.
     * 
     * @type {NullValueResolver}
     */
    readonly deserializedNullValueResolver: NullValueResolver;

    /**
     * Deserialized default value.
     * 
     * @type {DefaultValue}
     */
    readonly deserializedDefaultValue: DefaultValue;

    /**
     * Deserialized default value resolver.
     * 
     * @type {DefaultValueResolver}
     */
    readonly deserializedDefaultValueResolver: DefaultValueResolver;

    /**
     * Discriminant.
     * 
     * @type {Discriminant}
     */
    readonly discriminant: Discriminant;

    /**
     * Discriminator.
     * 
     * @type {Discriminator}
     */
    readonly discriminator: Discriminator;

    /**
     * Factory.
     * 
     * @type {Factory}
     */
    readonly factory: Factory;

    /**
     * Injectable value.
     * 
     * @type {Factory}
     */
    readonly injectable: boolean;

    /**
     * Injector.
     * 
     * @type {Injector}
     */
    readonly injector: Injector;

    /**
     * Logger.
     * 
     * @type {Logger}
     */
    readonly logger: Logger;
    
    /**
     * Naming convention.
     * 
     * @type {Optional<NamingConvention>}
     */
    readonly namingConvention: Optional<NamingConvention>;

    /**
     * Indicator if current type metadata is polymorphic.
     * 
     * @type {boolean}
     */
    readonly polymorphic: boolean;

    /**
     * Type metadata map.
     * 
     * @type {ReadonlyMap<TypeFn<any>, TypeMetadata<any>>}
     */
    readonly typeMetadataMap: ReadonlyMap<TypeFn<any>, TypeMetadata<any>>;
    
    /**
     * Indicator if discriminator should be preserved.
     * 
     * @type {boolean}
     */
    readonly preserveDiscriminator: boolean;

    /**
     * Reference handler.
     * 
     * @type {ReferenceHandler}
     */
    readonly referenceHandler: ReferenceHandler;
    
    /**
     * Serializer.
     * 
     * @type {Serializer<TObject>}
     */
    readonly serializer: Serializer<TObject>;

    /**
     * Indicator if null value should be preserved.
     * 
     * @type {boolean}
     */
    readonly preserveNull: boolean;

    /**
     * Indicator if default value should be used.
     * 
     * @type {boolean}
     */
    readonly useDefaultValue: boolean;

    /**
     * Indicator if implicit conversion should be used.
     * 
     * @type {boolean}
     */
    readonly useImplicitConversion: boolean;

    /**
     * Property sorter.
     * 
     * @type {Optional<PropertySorter>}
     */
    readonly propertySorter: Optional<PropertySorter>;

    /**
     * Sorted property metadatas.
     * 
     * @type {ReadonlyArray<PropertyMetadata<TObject, any>>}
     */
    readonly sortedPropertyMetadatas: ReadonlyArray<PropertyMetadata<TObject, any>>;

    /**
     * Inject sorter.
     * 
     * @type {Optional<InjectSorter>}
     */
    readonly injectSorter: Optional<InjectSorter>;

    /**
     * Sorted inject metadatas.
     * 
     * @type {ReadonlyArray<InjectMetadata<TObject, any>>}
     */
    readonly sortedInjectMetadatas: ReadonlyArray<InjectMetadata<TObject, any>>;

    /**
     * Parent type arguments.
     * 
     * @type {ReadonlyArray<TypeArgument<any>>}
     */
    readonly parentTypeArguments: ReadonlyArray<TypeArgument<any>>;

    /**
     * Parent type metadatas.
     * 
     * @type {ReadonlyArray<TypeMetadata<any>>}
     */
    readonly parentTypeMetadatas: ReadonlyArray<TypeMetadata<any>>;

    /**
     * Own parent type metadatas.
     * 
     * @type {ReadonlyArray<TypeMetadata<any>>}
     */
    readonly ownParentTypeMetadatas: ReadonlyArray<TypeMetadata<any>>;

    /**
     * Child type metadatas.
     * 
     * @type {ReadonlyArray<TypeMetadata<any>>}
     */
    readonly childTypeMetadatas: ReadonlyArray<TypeMetadata<any>>;
    
    /**
     * Own child type metadatas.
     * 
     * @type {ReadonlyArray<TypeMetadata<any>>}
     */
    readonly ownChildTypeMetadatas: ReadonlyArray<TypeMetadata<any>>;

    /**
     * Property options map.
     * 
     * @type {ReadonlyMap<PropertyName, PropertyOptions<any>>}
     */
    readonly propertyOptionsMap: ReadonlyMap<PropertyName, PropertyOptions<any>>;

    /**
     * Property metadata map.
     * 
     * @type {ReadonlyMap<PropertyName, PropertyMetadata<TObject, any>>}
     */
    readonly propertyMetadataMap: ReadonlyMap<PropertyName, PropertyMetadata<TObject, any>>;

    /**
     * Own property metadata map.
     * 
     * @type {ReadonlyMap<PropertyName, PropertyMetadata<TObject, any>>}
     */
    readonly ownPropertyMetadataMap: ReadonlyMap<PropertyName, PropertyMetadata<TObject, any>>;

    /**
     * Inject options map.
     * 
     * @type {ReadonlyMap<PropertyName, PropertyOptions<any>>}
     */
    readonly injectOptionsMap: ReadonlyMap<InjectIndex, InjectOptions<any>>;

    /**
     * Inject metadata map.
     * 
     * @type {ReadonlyMap<InjectIndex, InjectMetadata<TObject, any>>}
     */
    readonly injectMetadataMap: ReadonlyMap<InjectIndex, InjectMetadata<TObject, any>>;
}
