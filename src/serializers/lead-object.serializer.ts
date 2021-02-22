import { Fn } from './../core/fn';
import { TypeLike } from './../core/type-like';
import { ObjectSerializer, ReferenceResolver, Callback } from './object.serializer';

/**
 * Lead object serializer handles references using object mapping. If circular reference is
 * detected the it will be setted to undefined so only first occurance is handled.
 * 
 * @type {LeadObjectSerializer}
 */
export class LeadObjectSerializer extends ObjectSerializer
{
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
            return undefined;
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
             return undefined;
        }

        return reference;
    }
}
