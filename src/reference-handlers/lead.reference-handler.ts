import { Fn } from '../core/fn';
import { ReferenceHandler } from '../core/reference-handler';
import { ReferenceKey } from '../core/reference-key';
import { ReferenceValue } from '../core/reference-value';
import { ReferenceValueInitializer } from '../core/reference-value-initializer';
import { ReferenceValueResolver } from '../core/reference-value-resolver';
import { SerializerContext } from '../core/serializer-context';

/**
 * Lead reference handler preserves references except circular. If circular reference is detected the it will 
 * be setted to undefined so only first occurance is handled.
 * 
 * @type {LeadReferenceHandler}
 */
export class LeadReferenceHandler implements ReferenceHandler
{
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
        const referenceValue = referenceMap.get(referenceKey);

        if (Fn.isNil(referenceValue))
        {
            referenceMap.set(referenceKey, referenceKey);

            const value = referenceValueInitializer();

            referenceMap.set(referenceKey, value);

            serializerContext.resolveReferenceCallbacks(referenceKey);

            return value;
        }

        if (referenceValue === referenceKey)
        {
            return undefined;
        }

        return referenceValue;
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
        const referenceMap = serializerContext.referenceMap;
        const referenceValue = referenceMap.get(referenceKey);

        if (Fn.isNil(referenceValue))
        {
            referenceMap.set(referenceKey, referenceKey);

            const value = referenceValueInitializer();

            referenceMap.set(referenceKey, value);

            serializerContext.resolveReferenceCallbacks(referenceKey);

            return value;
        }

        if (referenceValue === referenceKey)
        {
            return undefined;
        }

        return referenceValue;
    }
}
