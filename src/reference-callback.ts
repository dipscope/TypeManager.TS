/**
 * Reference callback function which is called when circular references can be resolved for 
 * a certain object. May be created by serializers for serializer contexts.
 * 
 * @type {ReferenceCallback}
 */
export type ReferenceCallback = () => void;
