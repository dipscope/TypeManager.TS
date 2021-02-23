import { Fn } from './../core/fn';
import { TypeLike } from './../core/type-like';
import { TypeContext } from './../core/type-context';
import { TypeContextEntry } from './../core/type-context-entry';
import { Serializer } from './../core/serializer';
import { SerializerContext } from './../core/serializer-context';

/**
 * Reference resolver function which can be returned during serialization or 
 * deserialization to get reference at a later time due to circular dependency.
 * 
 * @type {ReferenceResolver}
 */
export type ReferenceResolver = () => TypeLike<Record<string, any>>;

/**
 * Callback function which is called when circular references can be resolved for 
 * a certain object.
 * 
 * @type {Callback}
 */
export type Callback = () => void;

/**
 * Default object serializer.
 * 
 * @type {ObjectSerializer}
 */
export class ObjectSerializer implements Serializer<Record<string, any>>
{
    /**
     * Object serializer accepts special arguments to handle object references. 
     * This key is required to separate instances after code minification and module separation.
     * 
     * @type {string}
     */
    public readonly serializerKey: string = '__TMObjectSerializer__';

    /**
     * Serializes provided value.
     * 
     * @param {TypeLike<Record<string, any>>} x Some value.
     * @param {SerializerContext<Record<string, any>>} serializerContext Serializer context.
     * @param {WeakMap<any, any>} referenceMap Map to track object references.
     * @param {WeakMap<any, Callback[]>} callbackMap Map with callbacks for deferred property assignment on circular reference.
     * @param {string} path JSON path for provided value. $ means a root.
     * 
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(
        x: TypeLike<Record<string, any>>, 
        serializerContext: SerializerContext<Record<string, any>>,
        referenceMap: WeakMap<any, any> = new WeakMap<any, any>(),
        callbackMap: WeakMap<any, Callback[]> = new WeakMap<any, Callback[]>(),
        path: string = '$'
    ): TypeLike<any>
    {
        if (Fn.isUndefined(x))
        {
            return serializerContext.defaultValue;
        }

        if (Fn.isNull(x))
        {
            return null;
        }

        if (Fn.isArray(x))
        {
            const typeArray = x;

            return this.defineReference(typeArray, referenceMap, callbackMap, path, () =>
            {
                const objectArray = [] as TypeLike<Record<string, any>>[];

                for (let i = 0; i < typeArray.length; i++)
                {
                    const value = this.serialize(typeArray[i], serializerContext, referenceMap, callbackMap, `${path}[${i}]`);

                    if (Fn.isFunction(value))
                    {
                        this.pushCallback(typeArray[i], callbackMap, () => 
                        {
                            objectArray[i] = value();
                        });

                        continue;
                    }

                    objectArray[i] = value;
                }

                return objectArray;
            });
        }

        if (Fn.isObject(x))
        {
            const typeMetadata = serializerContext.typeMetadata;

            if (Fn.isNil(typeMetadata))
            {
                if (serializerContext.log.errorEnabled)
                {
                    serializerContext.log.error(`${serializerContext.path}: Cannot define type metadata during serializing value as object!`, x);
                }

                return undefined;
            }

            const type = x;

            return this.defineReference(type, referenceMap, callbackMap, path, () => 
            {
                const object = {} as Record<string, any>;
    
                for (const propertyMetadata of typeMetadata.propertyMetadataMap.values())
                {
                    if (propertyMetadata.serializationConfigured && !propertyMetadata.serializable)
                    {
                        continue;
                    }
    
                    const namingConvention         = propertyMetadata.namingConvention ?? typeMetadata.namingConvention;
                    const propertyNameByConvention = namingConvention ? namingConvention.convert(propertyMetadata.name) : propertyMetadata.name;
                    const propertyName             = propertyMetadata.alias ?? propertyNameByConvention;
                    const propertyValue            = type[propertyMetadata.name];
                    const propertySerializer       = propertyMetadata.serializer;
    
                    if (Fn.isNil(propertySerializer))
                    {
                        let value = propertyValue;
    
                        if (Fn.isUndefined(value))
                        {
                            value = propertyMetadata.defaultValue;
                        }
    
                        object[propertyName] = value;
    
                        continue;
                    }
    
                    if (Fn.isObject(propertyValue) && this.isObjectSerializer(propertySerializer))
                    {
                        const value = propertySerializer.serialize(propertyValue, propertyMetadata, referenceMap, callbackMap, `${path}['${propertyName}']`);

                        if (Fn.isFunction(value))
                        {
                            this.pushCallback(propertyValue, callbackMap, () =>
                            {
                                const referenceObject = referenceMap.get(type);

                                if (!Fn.isNil(referenceObject))
                                {
                                    referenceObject[propertyName] = value();
                                }
                            });

                            continue;
                        }

                        object[propertyName] = value;
    
                        continue;
                    }
    
                    object[propertyName] = propertySerializer.serialize(propertyValue, propertyMetadata);
                }

                return object;
            });
        }

        if (serializerContext.log.errorEnabled)
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot serialize value as object!`, x);
        }

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<Record<string, any>>} serializerContext Serializer context.
     * @param {WeakMap<any, any>} referenceMap Map to track object references.
     * @param {WeakMap<any, Callback[]>} callbackMap Map with callbacks for deferred property assignment on circular reference.
     * @param {TypeLike<any>} $ Root object.
     * 
     * @returns {TypeLike<Record<string, any>>} Deserialized value or undefined.
     */
    public deserialize(
        x: TypeLike<any>,
        serializerContext: SerializerContext<Record<string, any>>, 
        referenceMap: WeakMap<any, any> = new WeakMap<any, any>(),
        callbackMap: WeakMap<any, Callback[]> = new WeakMap<any, Callback[]>(),
        $: TypeLike<any> = x
    ): TypeLike<Record<string, any>>
    {
        if (Fn.isUndefined(x))
        {
            return serializerContext.defaultValue;
        }

        if (Fn.isNull(x))
        {
            return null;
        }

        if (Fn.isArray(x))
        {
            const objectArray = x;

            return this.restoreReference(objectArray, referenceMap, callbackMap, $, () =>
            {
                const typeArray = [] as TypeLike<Record<string, any>>[];

                for (let i = 0; i < objectArray.length; i++)
                {
                    const value = this.deserialize(objectArray[i], serializerContext, referenceMap, callbackMap, $);

                    if (Fn.isFunction(value))
                    {
                        this.pushCallback(objectArray[i], callbackMap, () => 
                        {
                            typeArray[i] = value();
                        });

                        continue;
                    }

                    typeArray[i] = value;
                }

                return typeArray;
            });
        }

        if (Fn.isObject(x))
        {
            const typeMetadata = serializerContext.typeMetadata;
            
            if (Fn.isNil(typeMetadata))
            {
                if (serializerContext.log.errorEnabled)
                {
                    serializerContext.log.error(`${serializerContext.path}: Cannot define type metadata during deserializing value as object!`, x);
                }

                return undefined;
            }

            const object = x;

            return this.restoreReference(object, referenceMap, callbackMap, $, () =>
            {
                const typeContext = new TypeContext(typeMetadata);

                for (const propertyMetadata of typeMetadata.propertyMetadataMap.values())
                {
                    const namingConvention         = propertyMetadata.namingConvention ?? typeMetadata.namingConvention;
                    const propertyNameByConvention = namingConvention ? namingConvention.convert(propertyMetadata.name) : propertyMetadata.name;
                    const propertyName             = propertyMetadata.alias ?? propertyNameByConvention;
                    const propertyValue            = object[propertyName];

                    if (propertyMetadata.serializationConfigured && !propertyMetadata.deserializable)
                    {
                        continue;
                    }

                    const propertySerializer = propertyMetadata.serializer;

                    if (Fn.isNil(propertySerializer))
                    {
                        let value = propertyValue;

                        if (Fn.isUndefined(value))
                        {
                            value = propertyMetadata.defaultValue;
                        }

                        typeContext.set(propertyMetadata.name, new TypeContextEntry(propertyMetadata.name, value, propertyMetadata));
                        typeContext.set(propertyName, new TypeContextEntry(propertyName, value, propertyMetadata));

                        continue;
                    }

                    if (Fn.isObject(propertyValue) && this.isObjectSerializer(propertySerializer))
                    {
                        const value = propertySerializer.deserialize(propertyValue, propertyMetadata, referenceMap, callbackMap, $);

                        if (Fn.isFunction(value))
                        {
                            this.pushCallback(propertyValue, callbackMap, () =>
                            {
                                const referenceType = referenceMap.get(object);

                                if (!Fn.isNil(referenceType))
                                {
                                    referenceType[propertyMetadata.name] = value();
                                }
                            });

                            continue;
                        }

                        typeContext.set(propertyMetadata.name, new TypeContextEntry(propertyMetadata.name, value, propertyMetadata));
                        typeContext.set(propertyName, new TypeContextEntry(propertyName, value, propertyMetadata));

                        continue;
                    }

                    const value = propertySerializer.deserialize(propertyValue, propertyMetadata);

                    typeContext.set(propertyMetadata.name, new TypeContextEntry(propertyMetadata.name, value, propertyMetadata));
                    typeContext.set(propertyName, new TypeContextEntry(propertyName, value, propertyMetadata));
                }

                for (const propertyName in object)
                {
                    if (object.hasOwnProperty(propertyName))
                    {
                        typeContext.set(propertyName, new TypeContextEntry(propertyName, object[propertyName]));
                    }
                }

                const factory  = serializerContext.factory ?? typeMetadata.factory;
                const injector = serializerContext.injector ?? typeMetadata.injector;
                const type     = factory.build(typeContext, injector);

                return type;
            });
        }
        
        if (serializerContext.log.errorEnabled)
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot deserialize value as object!`, x);
        }

        return undefined;
    }

    /**
     * Checks if provided serializer is an object serializer.
     * 
     * @param {Serializer<any>} serializer Any serializer.
     * 
     * @returns {boolean} True when serializer is an object serializer. False otherwise.
     */
    private isObjectSerializer(serializer: Serializer<any>): serializer is ObjectSerializer
    {
        const unknownSerilizer = serializer as any;

        return Fn.isObject(unknownSerilizer) && unknownSerilizer['serializerKey'] === this.serializerKey;
    }

    /**
     * Pushes callback for provided key.
     * 
     * @param {TypeLike<Record<string, any>>} key Callback map key.
     * @param {WeakMap<any, Callback[]>} callbackMap Map with callbacks for deferred property assignment on circular reference.
     * @param {Callback} callback Callback function.
     * 
     * @returns {void}
     */
    protected pushCallback(key: TypeLike<Record<string, any>>, callbackMap: WeakMap<any, Callback[]>, callback: Callback): void
    {
        let callbacks = callbackMap.get(key);

        if (Fn.isNil(callbacks))
        {
            callbacks = [];

            callbackMap.set(key, callbacks);
        }

        callbacks.push(callback);

        return;
    }

    /**
     * Resolves callbacks for provided key.
     * 
     * @param {TypeLike<Record<string, any>>} key Callback map key.
     * @param {WeakMap<any, Callback[]>} callbackMap Map with callbacks for deferred property assignment on circular reference.
     * 
     * @returns {void}
     */
    protected resolveCallbacks(key: TypeLike<Record<string, any>>, callbackMap: WeakMap<any, Callback[]>): void
    {
        const callbacks = callbackMap.get(key);

        if (Fn.isNil(callbacks))
        {
            return;
        }

        for (const callback of callbacks)
        {
            callback();
        }

        return;
    }

    /**
     * Defines object reference for provided key. 
     * 
     * Called during serialization. If no reference is available then initializer function
     * will be called.
     * 
     * @param {TypeLike<Record<string, any>>} key Reference map key.
     * @param {WeakMap<any, any>} referenceMap Reference map.
     * @param {WeakMap<any, Callback[]>} callbackMap Map with callbacks for deferred property assignment on circular reference.
     * @param {string} path JSON path for provided value.
     * @param {Function} initializer Arrow function to initialize an object.
     * 
     * @returns {TypeLike<Record<string, any>>|ReferenceResolver} Object reference or reference resolver for a key.
     */
    protected defineReference(
        key: TypeLike<Record<string, any>>,
        referenceMap: WeakMap<any, any>,
        callbackMap: WeakMap<any, Callback[]>,
        path: string,
        initializer: () => TypeLike<Record<string, any>>
    ): TypeLike<Record<string, any>> | ReferenceResolver
    {
        const reference = referenceMap.get(key);

        if (Fn.isNil(reference))
        {
            referenceMap.set(key, key);

            const value = initializer();

            referenceMap.set(key, value);

            this.resolveCallbacks(key, callbackMap);

            return value;
        }

        if (reference === key || Fn.isNil(path))
        {
            return () => referenceMap.get(key);
        }

        return reference;
    }

    /**
     * Restores object reference for provided key. 
     * 
     * Called during deserialization. If no reference is available then initializer function
     * will be called.
     * 
     * @param {TypeLike<Record<string, any>>} key Reference map key.
     * @param {WeakMap<any, any>} referenceMap Reference map.
     * @param {WeakMap<any, Callback[]>} callbackMap Map with callbacks for deferred property assignment on circular reference.
     * @param {TypeLike<Record<string, any>>} $ Root JSON object.
     * @param {Function} initializer Arrow function to initialize an object.
     * 
     * @returns {TypeLike<Record<string, any>>|ReferenceResolver} Object reference or reference resolver for a key.
     */
    protected restoreReference(
        key: TypeLike<Record<string, any>>,
        referenceMap: WeakMap<any, any>,
        callbackMap: WeakMap<any, Callback[]>,
        $: TypeLike<Record<string, any>>,
        initializer: () => TypeLike<Record<string, any>>
    ): TypeLike<Record<string, any>> | ReferenceResolver
    {
        const reference = referenceMap.get(key);

        if (Fn.isNil(reference))
        {
            referenceMap.set(key, key);

            const value = initializer();

            referenceMap.set(key, value);

            this.resolveCallbacks(key, callbackMap);

            return value;
        }

        if (reference === key || Fn.isNil($))
        {
             return () => referenceMap.get(key);
        }

        return reference;
    }
}
