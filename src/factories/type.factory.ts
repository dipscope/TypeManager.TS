import { Factory } from '../core/factory';
import { Fn } from '../core/fn';
import { Injector } from '../core/injector';
import { TypeContext } from '../core/type-context';

/**
 * Type factory.
 * 
 * @type {TypeFactory}
 */
export class TypeFactory implements Factory
{
    /**
     * Builds type described by provided type metadata.
     * 
     * @param {TypeContext<TType>} typeContext Type context.
     * @param {Injector} injector Injector.
     * 
     * @returns {Record<string, any>} Type instance described by provided type metadata.
     */
    public build<TType>(typeContext: TypeContext<TType>, injector: Injector): TType
    {
        const typeMetadata = typeContext.typeMetadata;
        const typeCtor     = typeMetadata.typeCtor;
        const injectedKeys = [];
        const args         = new Array<any>(typeCtor.length).fill(undefined);

        for (const injectMetadata of typeMetadata.injectMetadataMap.values())
        {
            const argKey = injectMetadata.key;

            if (!Fn.isNil(argKey))
            {
                args[injectMetadata.index] = typeContext.get(argKey)?.value;

                injectedKeys.push(argKey);

                continue;
            }

            args[injectMetadata.index] = injector.get(injectMetadata.typeMetadata);
        }

        const type = new typeCtor(...args) as any;

        for (const typeContextEntry of typeContext.values())
        {
            const propertyMetadata = typeContextEntry.propertyMetadata;

            if (!Fn.isNil(propertyMetadata) && !Fn.isUndefined(typeContextEntry.value) && !injectedKeys.includes(propertyMetadata.name))
            {
                type[propertyMetadata.name] = typeContextEntry.value;
            }
        }

        return type;
    }
}
