import { GenericArgument } from './generic-argument';
import { PropertyMetadata } from './property-metadata';
import { ReferenceCallback } from './reference-callback';
import { ReferenceKey } from './reference-key';
import { ReferenceValue } from './reference-value';
import { TypeMetadata } from './type-metadata';

/**
 * Serializer context options.
 * 
 * @type {SerializerContextOptions<TType>}
 */
export interface SerializerContextOptions<TType>
{
    /**
     * Serializer context root.
     * 
     * This is a value passed to the root serializer.
     * 
     * @type {any}
     */
    $: any;

    /**
     * Generic arguments.
     * 
     * @type {GenericArgument<any>[]}
     */
    genericArguments?: GenericArgument<any>[];

    /**
     * JSONPath from serializer context root.
     * 
     * Indicates a place where serialization is performed.
     * 
     * @type {string}
     */
    path: string;

    /**
     * Property metadata.
     * 
     * @type {PropertyMetadata<any, TType>}
     */
    propertyMetadata?: PropertyMetadata<any, TType>;

    /**
     * Reference callback map.
     * 
     * Used to assign object references in a later time due to circular dependency.
     * 
     * @type {WeakMap<ReferenceKey, ReferenceCallback[]>}
     */
    referenceCallbackMap: WeakMap<ReferenceKey, ReferenceCallback[]>;

    /**
     * Reference map.
     * 
     * Used to preserve object references.
     * 
     * @type {WeakMap<ReferenceKey, ReferenceValue>}
     */
    referenceMap: WeakMap<ReferenceKey, ReferenceValue>;
    
    /**
     * Type metadata.
     * 
     * @type {TypeMetadata<TType>}
     */
    typeMetadata: TypeMetadata<TType>;
}
