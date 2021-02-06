import { Fn } from './../utils';
import { TypeMetadata } from './../type.metadata';
import { TypeContext } from './../type.context';
import { TypeFactory } from './../type.factory';
import { TypeInjector } from './../type.injector';

/**
 * Default type factory.
 * 
 * @type {ObjectFactory}
 */
export class ObjectFactory implements TypeFactory
{
    /**
     * Builds type described by provided type metadata.
     * 
     * @param {TypeMetadata} typeMetadata Type metadata.
     * @param {TypeContext} typeContext Type context.
     * @param {TypeInjector} typeInjector Type injector.
     * 
     * @returns {any} Type instance described by provided type metadata.
     */
    public build(typeMetadata: TypeMetadata, typeContext: TypeContext, typeInjector: TypeInjector): any
    {
        const typeCtor = typeMetadata.typeCtor;
        const args     = new Array<any>(typeCtor.length).fill(undefined);

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
