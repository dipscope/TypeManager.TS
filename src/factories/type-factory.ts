import { Factory } from '../factory';
import { Injector } from '../injector';
import { PropertyName } from '../property-name';
import { TypeCtor } from '../type-ctor';
import { TypeEntry } from '../type-entry';
import { TypeMetadata } from '../type-metadata';

/**
 * Type factory.
 * 
 * @type {TypeFactory}
 */
export class TypeFactory implements Factory
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
    public build<TObject>(typeMetadata: TypeMetadata<TObject>, typeEntryMap: ReadonlyMap<PropertyName, TypeEntry<TObject, any>>, injector: Injector): TObject
    {
        const typeCtor = typeMetadata.typeFn as TypeCtor<TObject>;
        const typeState = typeMetadata.typeState;
        const injectedKeys = new Set<string>();
        const args = new Array<any>(typeCtor.length);

        for (let i = 0; i < typeState.sortedInjectMetadatas.length; i++)
        {
            const injectMetadata = typeState.sortedInjectMetadatas[i];
            const injectState = injectMetadata.injectState;
            const argKey = injectState.key;

            if (argKey === undefined)
            {
                args[injectMetadata.injectIndex] = injector.get(injectState.typeMetadata);

                continue;
            }

            const typeEntry = typeEntryMap.get(argKey);

            if (typeEntry !== undefined)
            {
                args[injectMetadata.injectIndex] = typeEntry.value;
            }

            injectedKeys.add(argKey);
        }
        
        const type = new typeCtor(...args) as any;

        for (const typeEntry of typeEntryMap.values())
        {
            const propertyMetadata = typeEntry.propertyMetadata;

            if (
                propertyMetadata !== undefined 
                && typeEntry.value !== undefined 
                && !injectedKeys.has(propertyMetadata.propertyName)
            )
            {
                type[propertyMetadata.propertyName] = typeEntry.value;
            }
        }

        return type;
    }
}
