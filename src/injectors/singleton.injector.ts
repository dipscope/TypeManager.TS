import { Fn } from './../core/fn';
import { TypeMetadata } from './../core/type-metadata';
import { Injector } from './../core/injector';

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
            if (typeMetadata.log.errorEnabled)
            {
                typeMetadata.log.error(`${typeMetadata.path}: cannot resolve type! Have you registered it as injectable?`);
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
     * @param {TypeMetadata<TType>} typeMetadata Type metadata.
     * 
     * @returns {TType} Type instance described by type metadata.
     */
    private init<TType>(typeMetadata: TypeMetadata<TType>): TType
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
