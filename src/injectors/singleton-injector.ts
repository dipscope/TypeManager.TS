import { isNil } from 'lodash';
import { isCtorFunction } from '../functions/is-ctor-function';
import { Injector } from '../injector';
import { TypeMetadata } from '../type-metadata';

/**
 * Singleton injector.
 * 
 * @type {SingletonInjector}
 */
export class SingletonInjector implements Injector
{
    /**
     * Map with resolved types.
     * 
     * @type {WeakMap<TypeMetadata<any>, any>}
     */
    private readonly instanceMap: WeakMap<TypeMetadata<any>, any> = new WeakMap<TypeMetadata<any>, any>();

    /**
     * Method to get instance described by type metadata.
     * 
     * @param {TypeMetadata<TType>} typeMetadata Type metadata.
     * 
     * @returns {TType} Instance of type described by type metadata or undefined.
     */
    public get<TType>(typeMetadata: TypeMetadata<TType>): TType | undefined
    {
        if (!typeMetadata.injectable)
        {
            throw new Error(`${typeMetadata.typeName}: cannot resolve type! Have you registered it as injectable?`);
        }

        const instance = this.instanceMap.get(typeMetadata);

        if (isNil(instance))
        {
            return this.init(typeMetadata);
        }

        return instance;
    }

    /**
     * Creates instance described by type metadata.
     * 
     * @param {TypeMetadata<TType>} typeMetadata Type metadata.
     * 
     * @returns {TType} Type instance described by type metadata.
     */
    private init<TType>(typeMetadata: TypeMetadata<TType>): TType
    {
        const typeCtor = isCtorFunction(typeMetadata.typeFn) ? typeMetadata.typeFn : undefined;

        if (isNil(typeCtor))
        {
            throw new Error(`${typeMetadata.typeName}: cannot inject instance of abstract type.`);
        }

        const args = new Array<any>();

        for (const injectMetadata of typeMetadata.injectMetadataMap.values())
        {
            args[injectMetadata.injectIndex] = this.get(injectMetadata.typeMetadata);
        }

        const instance = new typeCtor(...args);

        this.instanceMap.set(typeMetadata, instance);

        return instance;
    }
}
