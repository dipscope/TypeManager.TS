import { Fn, Log } from './../utils';
import { TypeMetadata } from './../type.metadata';
import { TypeInjector } from './../type.injector';

/**
 * Singleton injector.
 * 
 * @type {SingletonInjector}
 */
export class SingletonInjector implements TypeInjector
{
    /**
     * Map with resolved types.
     * 
     * @type {WeakMap<TypeMetadata, any>}
     */
    private readonly instanceMap: WeakMap<TypeMetadata, any> = new WeakMap<TypeMetadata, any>();

    /**
     * Method to get instance described by type metadata.
     * 
     * @param {TypeMetadata} typeMetadata Type metadata.
     * 
     * @returns {any} Instance of type described by type metadata or undefined.
     */
    public get(typeMetadata: TypeMetadata): any | undefined
    {
        if (!typeMetadata.injectable)
        {
            if (Log.errorEnabled)
            {
                Log.error(`${Fn.nameOf(typeMetadata.typeCtor)}: cannot resolve type! Have you registered it as injectable?`);
            }

            return undefined;
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
     * @param {TypeMetadata} typeMetadata Type metadata.
     * 
     * @returns {any} Type instance described by type metadata.
     */
    private init(typeMetadata: TypeMetadata): any
    {
        const args: any[] = [];

        for (const injectMetadata of typeMetadata.injectMetadataMap.values())
        {
            const argTypeMetadata = injectMetadata.typeMetadata;

            if (!Fn.isNil(argTypeMetadata))
            {
                args[injectMetadata.index] = this.get(argTypeMetadata);
            }
        }

        const instance = new typeMetadata.typeCtor(...args);

        this.instanceMap.set(typeMetadata, instance);

        return instance;
    }
}
