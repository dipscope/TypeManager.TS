import { isNil } from 'lodash';
import { ReferenceHandler } from '../reference-handler';
import { ReferenceKey } from '../reference-key';
import { ReferenceValue } from '../reference-value';
import { ReferenceValueGetter } from '../reference-value-getter';
import { SerializerContext } from '../serializer-context';

/**
 * Direct reference handler which preserves references as is.
 * 
 * @type {DirectReferenceHandler}
 */
export class DirectReferenceHandler implements ReferenceHandler
{
    /**
     * Defines reference. Called during serialization.
     * 
     * @param {SerializerContext<any>} serializerContext Serializer context.
     * @param {ReferenceKey} referenceKey Reference which acts as a key. This is basically a serializing object.
     * @param {ReferenceValueGetter} referenceValueGetter Function to get a reference value when one is not yet present for a key.
     * 
     * @returns {ReferenceValue} Resolved reference value.
     */
    public define(serializerContext: SerializerContext<any>, referenceKey: ReferenceKey, referenceValueGetter: ReferenceValueGetter): ReferenceValue
    {
        const referenceMap = serializerContext.referenceMap;
        const referenceValue = referenceMap.get(referenceKey);

        if (isNil(referenceValue))
        {
            referenceMap.set(referenceKey, referenceKey);

            const value = referenceValueGetter();

            referenceMap.set(referenceKey, value);

            serializerContext.resolveReferenceCallbacks(referenceKey);

            return value;
        }

        if (referenceValue === referenceKey)
        {
            serializerContext.registerReferenceCallback(referenceKey);

            return undefined;
        }

        return referenceValue;
    }

    /**
     * Restores reference. Called during deserialization.
     * 
     * @param {SerializerContext<any>} serializerContext Serializer context.
     * @param {ReferenceKey} referenceKey Reference which acts as a key. This is basically a deserializing object.
     * @param {ReferenceValueGetter} referenceValueGetter Function to get a reference value when one is not yet present for a key.
     * 
     * @returns {ReferenceValue} Resolved reference value.
     */
    public restore(serializerContext: SerializerContext<any>, referenceKey: ReferenceKey, referenceValueGetter: ReferenceValueGetter): ReferenceValue
    {
        const referenceMap = serializerContext.referenceMap;
        const referenceValue = referenceMap.get(referenceKey);

        if (isNil(referenceValue))
        {
            referenceMap.set(referenceKey, referenceKey);

            const value = referenceValueGetter();

            referenceMap.set(referenceKey, value);

            serializerContext.resolveReferenceCallbacks(referenceKey);

            return value;
        }

        if (referenceValue === referenceKey)
        {
            serializerContext.registerReferenceCallback(referenceKey);

            return undefined;
        }

        return referenceValue;
    }
}
