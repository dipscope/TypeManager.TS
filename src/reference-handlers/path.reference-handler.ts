import { Fn } from '../core/fn';
import { ReferenceHandler } from '../core/reference-handler';
import { ReferenceKey } from '../core/reference-key';
import { ReferenceValue } from '../core/reference-value';
import { ReferenceValueInitializer } from '../core/reference-value-initializer';
import { ReferenceValueResolver } from '../core/reference-value-resolver';
import { SerializerContext } from '../core/serializer-context';

/**
 * Path reference handler preserves references using JSONPath.
 * 
 * @type {PathReferenceHandler}
 */
export class PathReferenceHandler implements ReferenceHandler
{
     /**
     * The eval function is used to locate the values described by JSONPath. This regular expression is used 
     * to assure that the JSONPath is extremely well formed.
     * 
     * @type {RegExp}
     */
    public readonly pathRegExp: RegExp = new RegExp('^\\$(?:\\[(?:\\d+|"(?:[^\\\\"\\u0000-\\u001f]|\\\\(?:[\\\\"\\/bfnrt]|u[0-9a-zA-Z]{4}))*")\\])*$');

    /**
     * Defines reference. Called during serialization.
     * 
     * @param {SerializerContext<any>} serializerContext Serializer context.
     * @param {ReferenceKey} referenceKey Reference which acts as a key. This is basically a serializing object.
     * @param {ReferenceValueInitializer} referenceValueInitializer Function to initialize a reference value when one is not yet present for a key.
     * 
     * @returns {ReferenceValue|ReferenceValueResolver} Resolved reference value or reference resolver when circular dependency is detected.
     */
    public define(serializerContext: SerializerContext<any>, referenceKey: ReferenceKey, referenceValueInitializer: ReferenceValueInitializer): ReferenceValue | ReferenceValueResolver
    {
        const referenceMap = serializerContext.referenceMap;
        const referencePath = referenceMap.get(referenceKey);

        if (Fn.isNil(referencePath))
        {
            referenceMap.set(referenceKey, serializerContext.path);

            const value = referenceValueInitializer();

            serializerContext.resolveReferenceCallbacks(referenceKey);

            return value;
        }

        return { $ref: referencePath };
    }

    /**
     * Restores reference. Called during deserialization.
     * 
     * @param {SerializerContext<any>} serializerContext Serializer context.
     * @param {ReferenceKey} referenceKey Reference which acts as a key. This is basically a deserializing object.
     * @param {ReferenceValueInitializer} referenceValueInitializer Function to initialize a reference value when one is not yet present for a key.
     * 
     * @returns {ReferenceValue|ReferenceValueResolver} Resolved reference value or reference resolver when circular dependency is detected.
     */
    public restore(serializerContext: SerializerContext<any>, referenceKey: ReferenceKey, referenceValueInitializer: ReferenceValueInitializer): ReferenceValue | ReferenceValueResolver
    {
        const $ = serializerContext.$;
        const referenceMap = serializerContext.referenceMap;
        const object = referenceKey as any;
        const referencePath = object.$ref as string;
        const referenceTarget = Fn.isString(referencePath) && Fn.isObject($) && this.pathRegExp.test(referencePath) ? eval(referencePath) : referenceKey;
        const referenceValue = referenceMap.get(referenceTarget);

        if (Fn.isNil(referenceValue))
        {
            referenceMap.set(referenceTarget, referenceTarget);

            const value = referenceValueInitializer();

            referenceMap.set(referenceTarget, value);

            serializerContext.resolveReferenceCallbacks(referenceTarget);

            return value;
        }
        
        if (referenceTarget !== referenceKey) 
        {
            serializerContext.pushReferenceCallback(referenceTarget, () =>
            {
                serializerContext.resolveReferenceCallbacks(referenceKey);
            });
        }

        if (referenceTarget === referenceValue)
        {
             return () => referenceMap.get(referenceTarget);
        }

        return referenceValue;
    }
}
