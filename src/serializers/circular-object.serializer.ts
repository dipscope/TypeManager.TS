import { Fn } from './../core/fn';
import { TypeLike } from './../core/type-like';
import { ObjectSerializer, ReferenceResolver, Callback } from './object.serializer';

/**
 * Circular object serializer handles references using JSONPath string that 
 * locates the first occurance.
 * 
 * @type {CircularObjectSerializer}
 */
export class CircularObjectSerializer extends ObjectSerializer
{
    /**
     * The eval function is used to locate the values described by JSONPath. This regular expression is used 
     * to assure that the JSONPath is extremely well formed.
     * 
     * @type {RegExp}
     */
    public readonly pathRegExp: RegExp = new RegExp('^\\$(?:\\[(?:\\d+|"(?:[^\\\\"\\u0000-\\u001f]|\\\\(?:[\\\\"\\/bfnrt]|u[0-9a-zA-Z]{4}))*")\\])*$');

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
        const referencePath = referenceMap.get(key);

        if (Fn.isNil(referencePath))
        {
            referenceMap.set(key, path);

            const value = initializer();

            this.resolveCallbacks(key, callbackMap);

            return value;
        }

        return { $ref: referencePath };
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
        const object        = key as any;
        const referencePath = object.$ref as string;
        const referenceKey  = Fn.isString(referencePath) && Fn.isObject($) && this.pathRegExp.test(referencePath) ? eval(referencePath) : key;
        const reference     = referenceMap.get(referenceKey);

        if (Fn.isNil(reference))
        {
            referenceMap.set(referenceKey, referenceKey);

            const value = initializer();

            referenceMap.set(referenceKey, value);

            this.resolveCallbacks(referenceKey, callbackMap);

            return value;
        }
        
        if (referenceKey !== key) 
        {
            this.pushCallback(referenceKey, callbackMap, () =>
            {
                this.resolveCallbacks(key, callbackMap);
            });
        }

        if (reference === referenceKey)
        {
             return () => referenceMap.get(referenceKey);
        }

        return reference;
    }
}
