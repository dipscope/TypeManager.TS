import { MethodName } from './method-name';
import { SerializerHandler } from './serializer-handler';

/**
 * Serializer callback function which is called by serializer during serialization and deserialization.
 * Can be an instance method name or a handler for which instance is provided.
 * 
 * @type {SerializerCallback<TObject>}
 */
export type SerializerCallback<TObject> = MethodName | SerializerHandler<TObject>;
