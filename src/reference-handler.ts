import { ReferenceKey } from './reference-key';
import { ReferenceValue } from './reference-value';
import { ReferenceValueInitializer } from './reference-value-initializer';
import { ReferenceValueResolver } from './reference-value-resolver';
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
     * @param {ReferenceValueInitializer} referenceValueInitializer Function to initialize a reference value when one is not yet present for a key.
     * 
     * @returns {ReferenceValue|ReferenceValueResolver} Resolved reference value or reference resolver when circular dependency is detected.
     */
    define(serializerContext: SerializerContext<any>, referenceKey: ReferenceKey, referenceValueInitializer: ReferenceValueInitializer): ReferenceValue | ReferenceValueResolver;

    /**
     * Restores reference. Called during deserialization.
     * 
     * @param {SerializerContext<any>} serializerContext Serializer context.
     * @param {ReferenceKey} referenceKey Reference which acts as a key. This is basically a deserializing object.
     * @param {ReferenceValueInitializer} referenceValueInitializer Function to initialize a reference value when one is not yet present for a key.
     * 
     * @returns {ReferenceValue|ReferenceValueResolver} Resolved reference value or reference resolver when circular dependency is detected.
     */
    restore(serializerContext: SerializerContext<any>, referenceKey: ReferenceKey, referenceValueInitializer: ReferenceValueInitializer): ReferenceValue | ReferenceValueResolver;
}
