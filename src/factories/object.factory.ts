import { Fn } from './../utils';
import { TypeFactory } from './../type.factory';
import { TypeContext } from './../type.context';
import { TypeInjector } from './../type.injector';

/**
 * Default object type factory.
 * 
 * @type {ObjectFactory}
 */
export class ObjectFactory implements TypeFactory<Record<string, any>>
{
    /**
     * Builds type described by provided type metadata.
     * 
     * @param {TypeContext<Record<string, any>>} typeContext Type context.
     * @param {TypeInjector} typeInjector Type injector.
     * 
     * @returns {Record<string, any>} Type instance described by provided type metadata.
     */
    public build(typeContext: TypeContext<Record<string, any>>, typeInjector: TypeInjector): Record<string, any>
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
                args[injectMetadata.index] = typeInjector.get(argTypeMetadata);

                continue;
            }
        }

        return new typeCtor(...args);
    }
}
