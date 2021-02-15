import { Fn } from './../core/fn';
import { Factory } from './../core/factory';
import { TypeContext } from './../core/type-context';
import { Injector } from './../core/injector';

/**
 * Object factory.
 * 
 * @type {ObjectFactory}
 */
export class ObjectFactory implements Factory<Record<string, any>>
{
    /**
     * Builds type described by provided type metadata.
     * 
     * @param {TypeContext<Record<string, any>>} typeContext Type context.
     * @param {Injector} injector Injector.
     * 
     * @returns {Record<string, any>} Type instance described by provided type metadata.
     */
    public build(typeContext: TypeContext<Record<string, any>>, injector: Injector): Record<string, any>
    {
        const typeMetadata = typeContext.typeMetadata;
        const typeCtor     = typeMetadata.typeCtor;
        const args         = new Array<any>(typeCtor.length).fill(undefined);

        for (const injectMetadata of typeMetadata.injectMetadataMap.values())
        {
            const argKey = injectMetadata.key;

            if (!Fn.isNil(argKey))
            {
                args[injectMetadata.index] = typeContext.get(argKey)?.value;

                continue;
            }

            const argTypeMetadata = injectMetadata.typeMetadata;

            if (!Fn.isNil(argTypeMetadata))
            {
                args[injectMetadata.index] = injector.get(argTypeMetadata);

                continue;
            }
        }

        return new typeCtor(...args);
    }
}
