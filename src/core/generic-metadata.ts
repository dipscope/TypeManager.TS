import { TypeMetadata } from './type-metadata';

/**
 * Generic metadata used to describe a generic type.
 * 
 * @type {GenericMetadata<TType>}
 */
export type GenericMetadata<TType> = [TypeMetadata<TType>, GenericMetadata<any>[]];
