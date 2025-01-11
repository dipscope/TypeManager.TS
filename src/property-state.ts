import { Alias } from './alias';
import { CustomKey } from './custom-key';
import { CustomValue } from './custom-value';
import { DefaultValueResolver } from './default-value-resolver';
import { GenericArgument } from './generic-argument';
import { GenericMetadata } from './generic-metadata';
import { NamingConvention } from './naming-convention';
import { NullValueResolver } from './null-value-resolver';
import { Optional } from './optional';
import { PropertyMetadata } from './property-metadata';
import { PropertyName } from './property-name';
import { ReferenceHandler } from './reference-handler';
import { Serializer } from './serializer';
import { TypeArgument } from './type-argument';
import { TypeMetadata } from './type-metadata';

/**
 * Represents a property state at a certain moment in time.
 * 
 * @type {PropertyState<TDeclaringObject, TObject>}
 */
export interface PropertyState<TDeclaringObject, TObject>
{
    /**
     * Property metadata for which state is defined.
     * 
     * @type {PropertyMetadata<TDeclaringObject, TObject>}
     */
    readonly propertyMetadata: PropertyMetadata<TDeclaringObject, TObject>;
    
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
     * Deserialized default value resolver.
     * 
     * @type {DefaultValueResolver}
     */
    readonly deserializedDefaultValueResolver: DefaultValueResolver;

    /**
     * Serialized property name.
     * 
     * @type {PropertyName}
     */
    readonly serializedPropertyName: PropertyName;

    /**
     * Deserialized property name.
     * 
     * @type {PropertyName}
     */
    readonly deserializedPropertyName: PropertyName;

    /**
     * Serializable value.
     * 
     * @type {boolean}
     */
    readonly serializable: boolean;

    /**
     * Deserializable value.
     * 
     * @type {boolean}
     */
    readonly deserializable: boolean;

    /**
     * Generic arguments.
     * 
     * @type {ReadonlyArray<GenericArgument<any>>}
     */
    readonly genericArguments: ReadonlyArray<GenericArgument<any>>;
    
    /**
     * Generic metadatas.
     * 
     * @type {ReadonlyArray<GenericMetadata<any>>}
     */
    readonly genericMetadatas: ReadonlyArray<GenericMetadata<any>>;

    /**
     * Naming convention.
     * 
     * @type {Optional<NamingConvention>}
     */
    readonly namingConvention: Optional<NamingConvention>;

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
     * Type argument.
     * 
     * @type {TypeArgument<TObject>}
     */
    readonly typeArgument: TypeArgument<TObject>;

    /**
     * Type metadata.
     * 
     * @type {TypeMetadata<TObject>}
     */
    readonly typeMetadata: TypeMetadata<TObject>;

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
}
