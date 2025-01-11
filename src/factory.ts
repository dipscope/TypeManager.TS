import { PropertyName } from 'lodash';
import { Injector } from './injector';
import { TypeEntry } from './type-entry';
import { TypeMetadata } from './type-metadata';

/**
 * Factory for building types.
 * 
 * @type {Factory}
 */
export interface Factory
{
    /**
     * Builds type described by provided type context.
     * 
     * @param {TypeMetadata<TObject>} typeMetadata Type metadata.
     * @param {ReadonlyMap<PropertyName, TypeEntry<TObject, any>>} typeEntryMap Type entry map.
     * @param {Injector} injector Injector.
     * 
     * @returns {TObject} Object instance described by provided type context.
     */
    build<TObject>(typeMetadata: TypeMetadata<TObject>, typeEntryMap: ReadonlyMap<PropertyName, TypeEntry<TObject, any>>, injector: Injector): TObject;
}
