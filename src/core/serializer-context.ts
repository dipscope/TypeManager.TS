import { CustomData } from './custom-data';
import { Discriminant } from './discriminant';
import { Discriminator } from './discriminator';
import { Factory } from './factory';
import { Fn } from './fn';
import { GenericArgument } from './generic-argument';
import { GenericMetadata } from './generic-metadata';
import { Injector } from './injector';
import { Log } from './log';
import { Metadata } from './metadata';
import { NamingConvention } from './naming-convention';
import { PropertyMetadata } from './property-metadata';
import { ReferenceCallback } from './reference-callback';
import { ReferenceHandler } from './reference-handler';
import { ReferenceKey } from './reference-key';
import { ReferenceValue } from './reference-value';
import { ReferenceValueInitializer } from './reference-value-initializer';
import { ReferenceValueResolver } from './reference-value-resolver';
import { Serializer } from './serializer';
import { SerializerContextOptions } from './serializer-context-options';
import { TypeFn } from './type-fn';
import { TypeLike } from './type-like';
import { TypeMetadata } from './type-metadata';

/**
 * Serializer context of a certain type.
 * 
 * @type {SerializerContext<TType>}
 */
export class SerializerContext<TType> extends Metadata
{
    /**
     * Serializer context options.
     * 
     * @type {SerializerContext<TType>}
     */
    public readonly serializerContextOptions: SerializerContextOptions<TType>;

    /**
     * Constructor.
     * 
     * @param {SerializerContextOptions<TType>} serializerContextOptions Serializer context options.
     */
    public constructor(serializerContextOptions: SerializerContextOptions<TType>)
    {
        super(serializerContextOptions.typeMetadata.typeMetadataResolver);

        this.serializerContextOptions = serializerContextOptions;

        return;
    }

    /**
     * Gets serializer context root.
     * 
     * @returns {any} Serializer context root.
     */
    public get $(): any
    {
        return this.serializerContextOptions.$;
    }

    /**
     * Gets custom data.
     * 
     * @returns {CustomData} Custom data.
     */
    public get customData(): CustomData
    {
        const customData                = {};
        const typeCustomData            = this.typeMetadata.customData;
        const propertyCustomData        = this.propertyMetadata?.customData;

        if (!Fn.isNil(typeCustomData))
        {
            Fn.assign(customData, typeCustomData);
        }

        if (!Fn.isNil(propertyCustomData))
        {
            Fn.assign(customData, propertyCustomData);
        }

        return customData;
    }

    /**
     * Gets default value.
     * 
     * @returns {any|undefined} Resolved default value or undefined.
     */
    public get defaultValue(): any | undefined
    {
        const defaultValue = this.propertyMetadata?.defaultValue ?? this.typeMetadata.defaultValue;

        if (this.useDefaultValue)
        {
            return Fn.isFunction(defaultValue) ? defaultValue() : defaultValue;
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
        return this.typeMetadata.discriminant;
    }

    /**
     * Gets discriminant map.
     * 
     * @returns {Map<TypeFn<any>, Discriminant>} Discriminant map.
     */
    public get discriminantMap(): Map<TypeFn<any>, Discriminant>
    {
        return this.typeMetadata.discriminantMap;
    }

    /**
     * Gets discriminator.
     * 
     * @returns {Discriminator} Discriminator.
     */
    public get discriminator(): Discriminator
    {
        return this.typeMetadata.discriminator;
    }

    /**
     * Gets factory.
     * 
     * @returns {Factory} Factory.
     */
    public get factory(): Factory
    {
        return this.typeMetadata.factory;
    }

    /**
     * Gets generic arguments.
     * 
     * @returns {GenericArgument<any>[]|undefined} Generic arguments or undefined.
     */
    public get genericArguments(): GenericArgument<any>[] | undefined
    {
        return this.serializerContextOptions.genericArguments ?? this.propertyMetadata?.genericArguments ?? this.typeMetadata.genericArguments;
    }

    /**
     * Gets generic metadatas.
     * 
     * @returns {GenericMetadata<any>[]|undefined} Generic metadatas.
     */
    public get genericMetadatas(): GenericMetadata<any>[] | undefined
    {
        const genericArguments = this.genericArguments;

        if (Fn.isNil(genericArguments))
        {
            return undefined;
        }

        return this.defineGenericMetadatas(genericArguments);
    }

    /**
     * Gets injector.
     * 
     * @returns {Injector} Injector
     */
    public get injector(): Injector
    {
        return this.typeMetadata.injector;
    }

    /**
     * Gets log.
     * 
     * @returns {Log} Log instance.
     */
    public get log(): Log
    {
        return this.typeMetadata.log;
    }

    /**
     * Gets context name.
     * 
     * @returns {string} Context name.
     */
    public get name(): string
    {
        if (Fn.isNil(this.propertyMetadata))
        {
            return this.typeMetadata.typeName;
        }

        return `${this.propertyMetadata.declaringTypeMetadata.typeName}.${this.propertyMetadata.propertyName}`;
    }

    /**
     * Gets naming convention.
     * 
     * @returns {NamingConvention|undefined} Naming convention or undefined.
     */
    public get namingConvention(): NamingConvention | undefined
    {
        return this.propertyMetadata?.namingConvention ?? this.typeMetadata.namingConvention;
    }

    /**
     * Gets JSONPath from serializer context root.
     * 
     * @returns {string} Path.
     */
    public get path(): string
    {
        return this.serializerContextOptions.path;
    }

    /**
     * Gets indicator if context is polymorphic.
     * 
     * @returns {boolean} True when context is polymorphic. False otherwise.
     */
    public get polymorphic(): boolean
    {
        return this.typeMetadata.polymorphic;
    }

    /**
     * Gets property metadata.
     * 
     * @returns {PropertyMetadata<any, TType>|undefined} Property metadata or undefined.
     */
    public get propertyMetadata(): PropertyMetadata<any, TType> | undefined
    {
        return this.serializerContextOptions.propertyMetadata;
    }

    /**
     * Gets indicator if discriminator should be preserved.
     * 
     * @returns {boolean} True when discriminator should be preserved. False otherwise.
     */
    public get preserveDiscriminator(): boolean 
    {
        return this.typeMetadata.preserveDiscriminator;
    }

    /**
     * Gets reference handler.
     * 
     * @returns {ReferenceHandler} Reference handler.
     */
    public get referenceHandler(): ReferenceHandler
    {
        return this.propertyMetadata?.referenceHandler ?? this.typeMetadata.referenceHandler;
    }

    /**
     * Gets reference callback map.
     * 
     * @returns {WeakMap<ReferenceKey, ReferenceCallback[]>} Reference callback map.
     */
    public get referenceCallbackMap(): WeakMap<ReferenceKey, ReferenceCallback[]>
    {
        return this.serializerContextOptions.referenceCallbackMap;
    }

    /**
     * Gets reference map.
     * 
     * @returns {WeakMap<ReferenceKey, ReferenceValue>} Reference map.
     */
    public get referenceMap(): WeakMap<ReferenceKey, ReferenceValue>
    {
        return this.serializerContextOptions.referenceMap;
    }

    /**
     * Gets serializer.
     * 
     * @returns {Serializer<TType>} Serializer.
     */
    public get serializer(): Serializer<TType>
    {
        return this.propertyMetadata?.serializer ?? this.typeMetadata.serializer;
    }

    /**
     * Gets type metadata.
     * 
     * @returns {TypeMetadata<TType>} Type metadata.
     */
    public get typeMetadata(): TypeMetadata<TType>
    {
        return this.serializerContextOptions.typeMetadata;
    }

    /**
     * Gets indicator if default value should be used.
     * 
     * @returns {boolean} True when type should use default value. False otherwise.
     */
    public get useDefaultValue(): boolean
    {
        return this.propertyMetadata?.useDefaultValue ?? this.typeMetadata.useDefaultValue;
    }

    /**
     * Gets indicator if implicit conversion should be used.
     * 
     * @returns {boolean} True when type should use implicit conversion. False otherwise.
     */
    public get useImplicitConversion(): boolean
    {
        return this.propertyMetadata?.useImplicitConversion ?? this.typeMetadata.useImplicitConversion;
    }

    /**
     * Serializes provided value using context.
     * 
     * @param {TypeLike<TType>} x Some value.
     * 
     * @returns {TypeLike<any>} Value serialized by context.
     */
    public serialize(x: TypeLike<TType>): TypeLike<any>
    {
        return this.serializer.serialize(x, this);
    }

    /**
     * Deserializes provided value using context.
     * 
     * @param {TypeLike<any>} x Some value.
     * 
     * @returns {TypeLike<TType>} Value deserialized by context.
     */
    public deserialize(x: TypeLike<any>): TypeLike<TType>
    {
        return this.serializer.deserialize(x, this);
    }

    /**
     * Defines reference. 
     * 
     * May be called during serialization to define reference.
     * 
     * @param {ReferenceKey} referenceKey Reference key.
     * @param {ReferenceValueInitializer} referenceValueInitializer Reference value initializer.
     * 
     * @returns {ReferenceValue|ReferenceValueResolver} Reference value or reference value resolver when circular dependency is detected.
     */
    public defineReference(referenceKey: ReferenceKey, referenceValueInitializer: ReferenceValueInitializer): ReferenceValue | ReferenceValueResolver
    {
        return this.referenceHandler.define(this, referenceKey, referenceValueInitializer);
    }

    /**
     * Restores reference.
     * 
     * May be called during deserialization to restore reference.
     * 
     * @param {ReferenceKey} referenceKey Reference key.
     * @param {ReferenceValueInitializer} referenceValueInitializer Reference value initializer.
     * 
     * @returns {ReferenceValue|ReferenceValueResolver} Reference value or reference value resolver when circular dependency is detected.
     */
    public restoreReference(referenceKey: ReferenceKey, referenceValueInitializer: ReferenceValueInitializer): ReferenceValue | ReferenceValueResolver
    {
        return this.referenceHandler.restore(this, referenceKey, referenceValueInitializer);
    }

    /**
     * Pushes callback for provided reference key.
     * 
     * Called by serializers during handling of circular references.
     * 
     * @param {ReferenceKey} referenceKey Reference key.
     * @param {ReferenceCallback} referenceCallback Reference callback.
     * 
     * @returns {void}
     */
    public pushReferenceCallback(referenceKey: ReferenceKey, referenceCallback: ReferenceCallback): void
    {
        let referenceCallbacks = this.referenceCallbackMap.get(referenceKey);

        if (Fn.isNil(referenceCallbacks))
        {
            referenceCallbacks = [];

            this.referenceCallbackMap.set(referenceKey, referenceCallbacks);
        }

        referenceCallbacks.push(referenceCallback);

        return;
    }

    /**
     * Resolves callbacks for provided reference key.
     * 
     * Called by reference handlers when circular references can be resolved.
     * 
     * @param {ReferenceKey} referenceKey Reference key.
     * 
     * @returns {void}
     */
    public resolveReferenceCallbacks(referenceKey: ReferenceKey): void
    {
        const referenceCallbacks = this.referenceCallbackMap.get(referenceKey);

        if (Fn.isNil(referenceCallbacks))
        {
            return;
        }

        for (const referenceCallback of referenceCallbacks)
        {
            referenceCallback();
        }

        return;
    }

    /**
     * Defines child serializer context.
     * 
     * Called by serializers on context change.
     * 
     * @param {Partial<SerializerContextOptions<any>>} childSerializerContextOptions Partial of serializer context options to override.
     * 
     * @returns {SerializerContext<any>} Child serializer context.
     */
    public defineChildSerializerContext(childSerializerContextOptions: Partial<SerializerContextOptions<any>>): SerializerContext<any>
    {
        const serializerContextOptions = Object.assign({}, this.serializerContextOptions, childSerializerContextOptions);

        return new SerializerContext(serializerContextOptions);
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
        const genericArguments = this.genericArguments;

        if (Fn.isNil(genericArguments))
        {
            throw new Error(`${this.path}: Cannot define generic arguments! This is usually caused by invalid configuration!`);
        }

        const genericArgument = genericArguments[genericIndex];

        if (Fn.isNil(genericArgument))
        {
            throw new Error(`${this.path}: Cannot define generic argument for index ${genericIndex}! This is usually caused by invalid configuration!`);
        }

        const genericTypeArgument     = Fn.isArray(genericArgument) ? genericArgument[0] : genericArgument;
        const genericGenericArguments = Fn.isArray(genericArgument) ? genericArgument[1] : undefined;
        const typeMetadata            = this.defineTypeMetadata(genericTypeArgument);

        return this.defineChildSerializerContext({
            typeMetadata:     typeMetadata,
            genericArguments: genericGenericArguments,
            propertyMetadata: undefined
        });
    }

    /**
     * Defines polymorphic serializer context by type function.
     * 
     * @param {TypeFn<any>} typeFn Type function.
     * 
     * @returns {SerializerContext<any>} Polymorphic serializer context.
     */
    private definePolymorphicSerializerContextByTypeFn(typeFn: TypeFn<any>): SerializerContext<any>
    {
        const discriminant = this.discriminantMap.get(typeFn);

        if (Fn.isNil(discriminant))
        {
            throw new Error(`${this.path}: Cannot define discriminant of polymorphic type! This is usually caused by invalid configuration!`);
        }

        const typeMetadata = this.defineTypeMetadata(typeFn);

        return this.defineChildSerializerContext({
            typeMetadata: typeMetadata
        });
    }

    /**
     * Defines polymorphic serializer context by discriminant.
     * 
     * @param {Record<string, any>} record Some record.
     * 
     * @returns {SerializerContext<any>} Polymorphic serializer context.
     */
    private definePolymorphicSerializerContextByDiscriminant(record: Record<string, any>): SerializerContext<any>
    {
        for (const [typeCtor, discriminant] of this.discriminantMap)
        {
            const typeMetadata = this.defineTypeMetadata(typeCtor);

            if (record[typeMetadata.discriminator] === discriminant)
            {
                return this.defineChildSerializerContext({
                    typeMetadata: typeMetadata
                });
            }
        }
        
        throw new Error(`${this.path}: Cannot define discriminant of polymorphic type! This is usually caused by invalid configuration!`);
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
        return Fn.isCtor(x) ? this.definePolymorphicSerializerContextByTypeFn(x) : this.definePolymorphicSerializerContextByDiscriminant(x);
    }
}
