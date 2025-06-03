/**
 * Serializer handler which is called by serializer during serialization and deserialization.
 * 
 * @type {SerializerHandler<TObject>}
 */
export type SerializerHandler<TObject> = (object: TObject) => void;
