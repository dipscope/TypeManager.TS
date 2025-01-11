import { TypeMetadata } from './type-metadata';

/**
 * Generic metadata used to describe a generic type.
 * 
 * @type {GenericMetadata<TObject>}
 */
export type GenericMetadata<TObject> = [TypeMetadata<TObject>, ReadonlyArray<GenericMetadata<any>>];
