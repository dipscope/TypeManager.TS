import isNil from 'lodash/isNil';
import isUndefined from 'lodash/isUndefined';
import { Factory } from '../factory';
import { isCtorFunction } from '../functions/is-ctor-function';
import { Injector } from '../injector';
import { TypeContext } from '../type-context';

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
        const typeCtor = isCtorFunction(typeMetadata.typeFn) ? typeMetadata.typeFn : undefined;

        if (isNil(typeCtor))
        {
            throw new Error(`${typeMetadata.typeName}: cannot build instance of abstract type.`);
        }
        
        const injectedKeys = new Array<any>();
        const args = new Array<any>(typeCtor.length).fill(undefined);

        for (const injectMetadata of typeMetadata.injectMetadataMap.values())
        {
            const argKey = injectMetadata.key;

            if (!isNil(argKey))
            {
                args[injectMetadata.injectIndex] = typeContext.get(argKey)?.value;

                injectedKeys.push(argKey);

                continue;
            }

            args[injectMetadata.injectIndex] = injector.get(injectMetadata.typeMetadata);
        }

        const type = new typeCtor(...args) as any;

        for (const typeContextEntry of typeContext.values())
        {
            const propertyMetadata = typeContextEntry.propertyMetadata;

            if (!isNil(propertyMetadata) && !isUndefined(typeContextEntry.value) && !injectedKeys.includes(propertyMetadata.propertyName))
            {
                type[propertyMetadata.propertyName] = typeContextEntry.value;
            }
        }

        return type;
    }
}
