import { Injector } from '../injector';
import { TypeCtor } from '../type-ctor';
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
     * @param {TypeMetadata<TObject>} typeMetadata Type metadata.
     * 
     * @returns {TObject} Instance of type described by type metadata or undefined.
     */
    public get<TObject>(typeMetadata: TypeMetadata<TObject>): TObject | undefined
    {
        if (!typeMetadata.injectable)
        {
            throw new Error(`${typeMetadata.typeName}: cannot resolve type! Have you registered it as injectable?`);
        }

        const instance = this.instanceMap.get(typeMetadata);

        if (instance === undefined)
        {
            return this.init(typeMetadata);
        }

        return instance;
    }

    /**
     * Creates instance described by type metadata.
     * 
     * @param {TypeMetadata<TObject>} typeMetadata Type metadata.
     * 
     * @returns {TObject} Type instance described by type metadata.
     */
    private init<TObject>(typeMetadata: TypeMetadata<TObject>): TObject
    {
        const typeCtor = typeMetadata.typeFn as TypeCtor<TObject>;
        const args = new Array<any>(typeCtor.length);
        const sortedInjectMetadatas = typeMetadata.sortedInjectMetadatas;

        for (let i = 0; i < sortedInjectMetadatas.length; i++)
        {
            args[sortedInjectMetadatas[i].injectIndex] = this.get(sortedInjectMetadatas[i].typeMetadata);
        }
        
        const instance = new typeCtor(...args);

        this.instanceMap.set(typeMetadata, instance);

        return instance;
    }
}
