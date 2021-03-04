import { Fn } from '../core/fn';
import { Injector } from '../core/injector';
import { TypeMetadata } from '../core/type-metadata';

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
            throw new Error(`${typeMetadata.name}: cannot resolve type! Have you registered it as injectable?`);
        }

        const instance = this.instanceMap.get(typeMetadata);

        if (Fn.isNil(instance))
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
        const args: any[] = [];

        for (const injectMetadata of typeMetadata.injectMetadataMap.values())
        {
            args[injectMetadata.index] = this.get(injectMetadata.typeMetadata);
        }

        const instance = new typeMetadata.typeCtor(...args);

        this.instanceMap.set(typeMetadata, instance);

        return instance;
    }
}
