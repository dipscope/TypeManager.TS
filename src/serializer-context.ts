import { Discriminant } from './discriminant';
import { Discriminator } from './discriminator';
import { Factory } from './factory';
import { GenericMetadata } from './generic-metadata';
import { Injector } from './injector';
import { Logger } from './logger';
import { Nullable } from './nullable';
import { Optional } from './optional';
import { PropertyState } from './property-state';
import { ReferenceCallback } from './reference-callback';
import { ReferenceHandler } from './reference-handler';
import { ReferenceKey } from './reference-key';
import { ReferenceValue } from './reference-value';
import { ReferenceValueGetter } from './reference-value-getter';
import { ReferenceValueSetter } from './reference-value-setter';
import { Serializer } from './serializer';
import { TypeFn } from './type-fn';
import { TypeLike } from './type-like';
import { TypeMetadata } from './type-metadata';
import { TypeState } from './type-state';

/**
 * Serializer context of a certain type.
 * 
 * @type {SerializerContext<TObject>}
 */
export class SerializerContext<TObject>
{
    /**
     * Serializer context root.
     * 
     * This is a value passed to the root serializer.
     * 
     * @type {any}
     */
    public readonly $: any;

    /**
     * Reference map.
     * 
     * Used to preserve object references.
     * 
     * @type {Map<ReferenceKey, ReferenceValue>}
     */
    public readonly referenceMap: Map<ReferenceKey, ReferenceValue>;

    /**
     * Reference callback map.
     * 
     * Used to assign object references in a later time due to circular dependency.
     * 
     * @type {Map<ReferenceKey, Array<ReferenceCallback>>}
     */
    public readonly referenceCallbackMap: Map<ReferenceKey, Array<ReferenceCallback>>;

    /**
     * Parent serializer context.
     * 
     * Present when any serializer defines child context.
     * 
     * @type {Optional<SerializerContext<any>>}
     */
    public readonly parentSerializerContext: Optional<SerializerContext<any>>;

    /**
     * Json path key.
     * 
     * @type {any}
     */
    public jsonPathKey: any;

    /**
     * Type state.
     * 
     * @type {TypeState<TObject>}
     */
    public typeState: TypeState<TObject>;

    /**
     * Property state.
     * 
     * @type {TypeState<TObject>}
     */
    public genericMetadatas: ReadonlyArray<GenericMetadata<any>>;

    /**
     * Property state.
     * 
     * @type {Optional<PropertyState<any, TObject>>}
     */
    public propertyState: Optional<PropertyState<any, TObject>>;

    /**
     * Reference value setter.
     * 
     * @type {Optional<ReferenceValueSetter>}
     */
    public referenceValueSetter: Optional<ReferenceValueSetter>;

    /**
     * Constructor.
     * 
     * @param {any} $ Serializer context root.
     * @param {Map<ReferenceKey, ReferenceValue>} referenceMap Reference map.
     * @param {Map<ReferenceKey, Array<ReferenceCallback>>} referenceCallbackMap Reference callback map.
     * @param {Optional<SerializerContext<any>>} parentSerializerContext Parent serializer context.
     * @param {any} jsonPathKey Json path key.
     * @param {TypeState<TObject>} typeState Type state.
     * @param {ReadonlyArray<GenericMetadata<any>>} genericMetadatas Generic metadatas.
     * @param {Optional<PropertyState<any, TObject>>} propertyState Property state.
     * @param {Optional<ReferenceValueSetter>} referenceValueSetter Reference value setter.
     */
    public constructor(
        $: any,
        referenceMap: Map<ReferenceKey, ReferenceValue>,
        referenceCallbackMap: Map<ReferenceKey, Array<ReferenceCallback>>,
        parentSerializerContext: Optional<SerializerContext<any>>,
        jsonPathKey: any,
        typeState: TypeState<TObject>,
        genericMetadatas: ReadonlyArray<GenericMetadata<any>>,
        propertyState: Optional<PropertyState<any, TObject>>,
        referenceValueSetter: Optional<ReferenceValueSetter>
    )
    {
        this.$ = $;
        this.referenceMap = referenceMap,
        this.referenceCallbackMap = referenceCallbackMap;
        this.parentSerializerContext = parentSerializerContext;
        this.jsonPathKey = jsonPathKey;
        this.typeState = typeState;
        this.genericMetadatas = genericMetadatas;
        this.propertyState = propertyState;
        this.referenceValueSetter = referenceValueSetter;

        return;
    }

    /**
     * Gets json path from serializer context root.
     * 
     * @returns {string} Json path.
     */
    public get jsonPath(): string
    {
        const jsonPathKey = this.jsonPathKey;
        const parentSerializerContext = this.parentSerializerContext;

        if (parentSerializerContext === undefined)
        {
            return `${jsonPathKey}`;
        }

        if (typeof jsonPathKey === 'number')
        {
            return `${parentSerializerContext.jsonPath}[${jsonPathKey}]`;
        }

        return `${parentSerializerContext.jsonPath}['${jsonPathKey}']`;
    }

    /**
     * Gets serialized null value.
     * 
     * @returns {Nullable<any>} Resolved serialized null value or undefined.
     */
    public get serializedNullValue(): Nullable<any>
    {
        if (this.preserveNull)
        {
            return null;
        }

        return this.serializedDefaultValue;
    }

    /**
     * Gets serialized default value.
     * 
     * @returns {Optional<any>} Resolved serialized default value or undefined.
     */
    public get serializedDefaultValue(): Optional<any>
    {
        if (this.useDefaultValue)
        {
            return this.propertyState?.serializedDefaultValueResolver() ?? this.typeState.serializedDefaultValueResolver();
        }

        return undefined;
    }
    
    /**
     * Gets deserialized null value.
     * 
     * @returns {Nullable<any>} Resolved deserialized null value or undefined.
     */
    public get deserializedNullValue(): Nullable<any>
    {
        if (this.preserveNull)
        {
            return null;
        }

        return this.deserializedDefaultValue;
    }

    /**
     * Gets deserialized default value.
     * 
     * @returns {Optional<any>} Resolved deserialized default value or undefined.
     */
    public get deserializedDefaultValue(): Optional<any>
    {
        if (this.useDefaultValue)
        {
            return this.propertyState?.deserializedDefaultValueResolver() ?? this.typeState.deserializedDefaultValueResolver();
        }
        
        return undefined;
    }

    /**
     * Gets discriminant.
     * 
     * @returns {Discriminant} Discriminant.
     */
    public get discriminant(): Discriminant
    {
        return this.typeState.discriminant;
    }

    /**
     * Gets discriminator.
     * 
     * @returns {Discriminator} Discriminator.
     */
    public get discriminator(): Discriminator
    {
        return this.typeState.discriminator;
    }

    /**
     * Gets factory.
     * 
     * @returns {Factory} Factory.
     */
    public get factory(): Factory
    {
        return this.typeState.factory;
    }

    /**
     * Gets injector.
     * 
     * @returns {Injector} Injector
     */
    public get injector(): Injector
    {
        return this.typeState.injector;
    }

    /**
     * Gets logger.
     * 
     * @returns {Logger} Logger instance.
     */
    public get logger(): Logger
    {
        return this.typeState.logger;
    }

    /**
     * Gets indicator if context is polymorphic.
     * 
     * @returns {boolean} True when context is polymorphic. False otherwise.
     */
    public get polymorphic(): boolean
    {
        return this.typeState.polymorphic;
    }

    /**
     * Gets indicator if discriminator should be preserved.
     * 
     * @returns {boolean} True when discriminator should be preserved. False otherwise.
     */
    public get preserveDiscriminator(): boolean 
    {
        return this.typeState.preserveDiscriminator;
    }

    /**
     * Gets reference handler.
     * 
     * @returns {ReferenceHandler} Reference handler.
     */
    public get referenceHandler(): ReferenceHandler
    {
        return this.propertyState?.referenceHandler ?? this.typeState.referenceHandler;
    }

    /**
     * Gets serializer.
     * 
     * @returns {Serializer<TObject>} Serializer.
     */
    public get serializer(): Serializer<TObject>
    {
        return this.propertyState?.serializer ?? this.typeState.serializer;
    }

    /**
     * Gets type metadata.
     * 
     * @returns {TypeMetadata<TObject>} Type metadata.
     */
    public get typeMetadata(): TypeMetadata<TObject>
    {
        return this.typeState.typeMetadata;
    }

    /**
     * Gets indicator if null value should be preserved.
     * 
     * @returns {boolean} True when null value should be preserved. False otherwise.
     */
    public get preserveNull(): boolean
    {
        return this.propertyState?.preserveNull ?? this.typeState.preserveNull;
    }

    /**
     * Gets indicator if default value should be used.
     * 
     * @returns {boolean} True when type should use default value. False otherwise.
     */
    public get useDefaultValue(): boolean
    {
        return this.propertyState?.useDefaultValue ?? this.typeState.useDefaultValue;
    }

    /**
     * Gets indicator if implicit conversion should be used.
     * 
     * @returns {boolean} True when type should use implicit conversion. False otherwise.
     */
    public get useImplicitConversion(): boolean
    {
        return this.propertyState?.useImplicitConversion ?? this.typeState.useImplicitConversion;
    }

    /**
     * Serializes provided value using context.
     * 
     * @param {TypeLike<TObject>} x Some value.
     * 
     * @returns {TypeLike<any>} Value serialized by context.
     */
    public serialize(x: TypeLike<TObject>): TypeLike<any>
    {
        return this.serializer.serialize(x, this);
    }

    /**
     * Deserializes provided value using context.
     * 
     * @param {TypeLike<any>} x Some value.
     * 
     * @returns {TypeLike<TObject>} Value deserialized by context.
     */
    public deserialize(x: TypeLike<any>): TypeLike<TObject>
    {
        return this.serializer.deserialize(x, this);
    }

    /**
     * Defines reference. 
     * 
     * May be called during serialization to define reference.
     * 
     * @param {ReferenceKey} referenceKey Reference key.
     * @param {ReferenceValueGetter} referenceValueGetter Reference value getter.
     * 
     * @returns {ReferenceValue} Reference value.
     */
    public defineReference(referenceKey: ReferenceKey, referenceValueGetter: ReferenceValueGetter): ReferenceValue
    {
        return this.referenceHandler.define(this, referenceKey, referenceValueGetter);
    }

    /**
     * Restores reference.
     * 
     * May be called during deserialization to restore reference.
     * 
     * @param {ReferenceKey} referenceKey Reference key.
     * @param {ReferenceValueGetter} referenceValueGetter Reference value getter.
     * 
     * @returns {ReferenceValue} Reference value.
     */
    public restoreReference(referenceKey: ReferenceKey, referenceValueGetter: ReferenceValueGetter): ReferenceValue
    {
        return this.referenceHandler.restore(this, referenceKey, referenceValueGetter);
    }
    
    /**
     * Registers callback for provided reference key.
     * 
     * May be called by reference handlers to register a callback resolver for a circular reference.
     * 
     * @param {ReferenceKey} referenceKey Reference key.
     * 
     * @returns {void}
     */
    public registerReferenceCallback(referenceKey: ReferenceKey): void
    {
        const referenceValueSetter = this.referenceValueSetter;

        if (referenceValueSetter === undefined)
        {
            return;
        }

        const jsonPathKey = this.jsonPathKey;

        this.pushReferenceCallback(referenceKey, () =>
        {
            const referenceValue = this.referenceMap.get(referenceKey);

            referenceValueSetter(referenceValue, jsonPathKey);
        });

        return;
    }

    /**
     * Pushes callback for provided reference key.
     * 
     * Called by reference handlers during handling of circular references.
     * 
     * @param {ReferenceKey} referenceKey Reference key.
     * @param {ReferenceCallback} referenceCallback Reference callback.
     * 
     * @returns {void}
     */
    public pushReferenceCallback(referenceKey: ReferenceKey, referenceCallback: ReferenceCallback): void
    {
        let referenceCallbacks = this.referenceCallbackMap.get(referenceKey);

        if (referenceCallbacks === undefined)
        {
            referenceCallbacks = new Array<ReferenceCallback>();

            this.referenceCallbackMap.set(referenceKey, referenceCallbacks);
        }

        referenceCallbacks.push(referenceCallback);

        return;
    }

    /**
     * Resolves callbacks for provided reference key.
     * 
     * May be called by reference handlers when circular references can be resolved.
     * 
     * @param {ReferenceKey} referenceKey Reference key.
     * 
     * @returns {void}
     */
    public resolveReferenceCallbacks(referenceKey: ReferenceKey): void
    {
        const referenceCallbacks = this.referenceCallbackMap.get(referenceKey);

        if (referenceCallbacks === undefined)
        {
            return;
        }
        
        for (let i = 0; i < referenceCallbacks.length; i++)
        {
            referenceCallbacks[i]();
        }

        return;
    }

    /**
     * Defines child serializer context.
     * 
     * Called by serializers on drill down.
     * 
     * @returns {SerializerContext<any>} Child serializer context.
     */
    public defineChildSerializerContext(): SerializerContext<any>
    {
        return new SerializerContext(
            this.$, 
            this.referenceMap, 
            this.referenceCallbackMap,
            this,
            this.jsonPathKey,
            this.typeState,
            this.genericMetadatas,
            this.propertyState,
            this.referenceValueSetter
        );
    }

    /**
     * Defines generic serializer context.
     * 
     * Called by serializers which work with generics.
     * 
     * @param {number} genericIndex Generic index.
     * 
     * @returns {SerializerContext<any>} Generic serializer context.
     */
    public defineGenericSerializerContext(genericIndex: number): SerializerContext<any>
    {
        const genericMetadata = this.genericMetadatas[genericIndex];

        if (genericMetadata === undefined)
        {
            throw new Error(`${this.jsonPath}: cannot define generic metadata for index ${genericIndex}. This is usually caused by invalid configuration.`);
        }

        const typeMetadata = genericMetadata[0];
        const genericMetadatas = genericMetadata[1];

        return new SerializerContext(
            this.$, 
            this.referenceMap, 
            this.referenceCallbackMap, 
            this.parentSerializerContext,
            this.jsonPath,
            typeMetadata.typeState,
            genericMetadatas,
            undefined,
            this.referenceValueSetter
        );
    }

    /**
     * Defines polymorphic serializer context.
     * 
     * Called by serializers which work with polymorphic types.
     * 
     * @param {TypeFn<any>|Record<string, any>} x Type function or record.
     * 
     * @returns {SerializerContext<any>} Polymorphic serializer context.
     */
    public definePolymorphicSerializerContext(x: TypeFn<any> | Record<string, any>): SerializerContext<any>
    {
        if (typeof x === 'function')
        {
            return this.definePolymorphicSerializerContextByTypeFn(x);
        }

        return this.definePolymorphicSerializerContextByDiscriminant(x);
    }

    /**
     * Defines polymorphic serializer context by type function.
     * 
     * @param {TypeFn<any>|Record<string, any>} x Type function or record.
     * 
     * @returns {SerializerContext<any>} Polymorphic serializer context.
     */
    private definePolymorphicSerializerContextByTypeFn(x: TypeFn<any> | Record<string, any>): SerializerContext<any>
    {
        const typeFn = x as TypeFn<any>;
        const typeMetadata = this.typeState.typeMetadataMap.get(typeFn);

        if (typeMetadata === undefined)
        {
            throw new Error(`${this.jsonPath}: cannot define discriminant of polymorphic type. This is usually caused by invalid configuration.`);
        }

        return new SerializerContext(
            this.$, 
            this.referenceMap, 
            this.referenceCallbackMap,
            this.parentSerializerContext,
            this.jsonPathKey,
            typeMetadata.typeState,
            this.genericMetadatas,
            this.propertyState,
            this.referenceValueSetter
        );
    }

    /**
     * Defines polymorphic serializer context by discriminant.
     * 
     * @param {TypeFn<any>|Record<string, any>} x Type function or record.
     * 
     * @returns {SerializerContext<any>} Polymorphic serializer context.
     */
    private definePolymorphicSerializerContextByDiscriminant(x: TypeFn<any> | Record<string, any>): SerializerContext<any>
    {
        const record = x as Record<string, any>;
        const childTypeMetadatas = this.typeState.childTypeMetadatas;

        for (let i = 0; i < childTypeMetadatas.length; i++)
        {
            const childTypeState = childTypeMetadatas[i].typeState;

            if (record[childTypeState.discriminator] === childTypeState.discriminant)
            {
                return new SerializerContext(
                    this.$, 
                    this.referenceMap, 
                    this.referenceCallbackMap,
                    this.parentSerializerContext,
                    this.jsonPathKey,
                    childTypeState,
                    this.genericMetadatas,
                    this.propertyState,
                    this.referenceValueSetter
                );
            }
        }

        throw new Error(`${this.jsonPath}: cannot define discriminant of polymorphic type. This is usually caused by invalid configuration.`);
    }
}
