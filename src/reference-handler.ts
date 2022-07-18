import { ReferenceKey } from './reference-key';
import { ReferenceValue } from './reference-value';
import { ReferenceValueGetter } from './reference-value-getter';
import { SerializerContext } from './serializer-context';

/**
 * Reference handler to resolve object references.
 * 
 * @type {ReferenceHandler}
 */
export interface ReferenceHandler
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
    define(serializerContext: SerializerContext<any>, referenceKey: ReferenceKey, referenceValueGetter: ReferenceValueGetter): ReferenceValue;

    /**
     * Restores reference. Called during deserialization.
     * 
     * @param {SerializerContext<any>} serializerContext Serializer context.
     * @param {ReferenceKey} referenceKey Reference which acts as a key. This is basically a deserializing object.
     * @param {ReferenceValueGetter} referenceValueGetter Function to get a reference value when one is not yet present for a key.
     * 
     * @returns {ReferenceValue} Resolved reference value.
     */
    restore(serializerContext: SerializerContext<any>, referenceKey: ReferenceKey, referenceValueGetter: ReferenceValueGetter): ReferenceValue;
}
