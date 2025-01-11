import { Alias } from './alias';
import { EMPTY_ARRAY } from './constants/empty-array';
import { GenericArgument } from './generic-argument';
import { GenericMetadata } from './generic-metadata';
import { TypeArgument } from './type-argument';
import { TypeFn } from './type-fn';
import { TypeManager } from './type-manager';
import { TypeMetadata } from './type-metadata';
import { TypeResolver } from './type-resolver';
import { Unknown } from './unknown';

/**
 * Metadata class.
 * 
 * Encapsulates common methods and properties which can be used by all types of metadata.
 * 
 * @type {Metadata}
 */
export class Metadata
{
    /**
     * Type manager.
     * 
     * @type {TypeManager}
     */
    public readonly typeManager: TypeManager;

    /**
     * Type function map for types with aliases.
     * 
     * @type {ReadonlyMap<Alias, TypeFn<any>>}
     */
    private readonly typeFnMap: ReadonlyMap<Alias, TypeFn<any>>;

    /**
     * Constructor.
     * 
     * @param {TypeManager} typeManager Type manager.
     * @param {ReadonlyMap<Alias, TypeFn<any>>} typeFnMap Type function map for types with aliases.
     */
    public constructor(typeManager: TypeManager, typeFnMap: ReadonlyMap<Alias, TypeFn<any>>)
    {
        this.typeManager = typeManager;
        this.typeFnMap = typeFnMap;

        return;
    }

    /**
     * Resolves type metadatas for provided type arguments.
     * 
     * @param {ReadonlyArray<TypeArgument<any>>} typeArguments Type arguments.
     * 
     * @returns {ReadonlyArray<TypeMetadata<any>>} Resolved type metadatas.
     */
    public resolveTypeMetadatas(typeArguments: ReadonlyArray<TypeArgument<any>>): ReadonlyArray<TypeMetadata<any>>
    {
        const typeMetadatas = new Array<TypeMetadata<any>>(typeArguments.length);

        for (let i = 0; i < typeArguments.length; i++)
        {
            typeMetadatas[i] = this.resolveTypeMetadata(typeArguments[i]);
        }

        return typeMetadatas;
    }

    /**
     * Resolves type metadata for provided type argument.
     * 
     * @param {TypeArgument<any>} typeArgument Type argument.
     * 
     * @returns {TypeMetadata<any>} Resolved type metadata.
     */
    public resolveTypeMetadata(typeArgument: TypeArgument<any>): TypeMetadata<any>
    {
        if (typeof typeArgument === 'function')
        {
            if (typeArgument.name === '')
            {
                return this.resolveTypeMetadataUsingTypeResolver(typeArgument);
            }

            return this.resolveTypeMetadataUsingTypeFn(typeArgument);
        }

        if (typeof typeArgument === 'string')
        {
            return this.resolveTypeMetadataUsingAlias(typeArgument);
        }

        return this.resolveTypeMetadataUsingUnknownTypeFn();
    }

    /**
     * Resolves type metadata using type resolver.
     * 
     * @param {TypeMetadata<any>} typeArgument Type argument.
     * 
     * @returns {TypeMetadata<any>} Type metadata resolved using type resolver.
     */
    private resolveTypeMetadataUsingTypeResolver(typeArgument: TypeArgument<any>): TypeMetadata<any>
    {
        const typeResolver = typeArgument as TypeResolver<any>;

        return this.typeManager.extractTypeMetadata(typeResolver());
    }

    /**
     * Resolves type metadata using type function.
     * 
     * @param {TypeMetadata<any>} typeArgument Type argument.
     * 
     * @returns {TypeMetadata<any>} Type metadata resolved using type function.
     */
    private resolveTypeMetadataUsingTypeFn(typeArgument: TypeArgument<any>): TypeMetadata<any>
    {
        const typeFn = typeArgument as TypeFn<any>;

        return this.typeManager.extractTypeMetadata(typeFn);
    }

    /**
     * Resolves type metadata using alias.
     * 
     * @param {TypeArgument<any>} typeArgument Type argument.
     * 
     * @returns {TypeMetadata<any>} Type metadata resolved using alias.
     */
    private resolveTypeMetadataUsingAlias(typeArgument: TypeArgument<any>): TypeMetadata<any>
    {
        const alias = typeArgument as Alias;
        const typeFn = this.typeFnMap.get(alias);

        if (typeFn === undefined)
        {
            this.typeManager.logger.error('Metadata', 'Cannot resolve type metadata for provided type alias.', alias);
            this.typeManager.logger.info('Metadata', 'Check if a type exists that defines such an alias. In the meantime, metadata for an unknown type will be used.');

            return this.resolveTypeMetadataUsingUnknownTypeFn();
        }

        return this.typeManager.extractTypeMetadata(typeFn);
    }

    /**
     * Resolves type metadata using unknown type function.
     * 
     * @returns {TypeMetadata<any>} Type metadata resolved using unknown type function.
     */
    private resolveTypeMetadataUsingUnknownTypeFn(): TypeMetadata<any>
    {
        const typeFn = Unknown as TypeFn<any>;

        return this.typeManager.extractTypeMetadata(typeFn);
    }

    /**
     * Resolves generic metadatas based on provided generic arguments.
     * 
     * @param {ReadonlyArray<GenericArgument<any>>} genericArguments Generic arguments.
     * 
     * @returns {ReadonlyArray<GenericMetadata<any>>} Resolved generic metadatas.
     */
    public resolveGenericMetadatas(genericArguments: ReadonlyArray<GenericArgument<any>>): ReadonlyArray<GenericMetadata<any>>
    {
        const genericMetadatas = new Array<GenericMetadata<any>>(genericArguments.length);

        for (let i = 0; i < genericArguments.length; i++)
        {
            const genericArgument = genericArguments[i];

            if (Array.isArray(genericArgument))
            {
                genericMetadatas[i] = [
                    this.resolveTypeMetadata(genericArgument[0]),
                    this.resolveGenericMetadatas(genericArgument[1])
                ];

                continue;
            }
            
            genericMetadatas[i] = [
                this.resolveTypeMetadata(genericArgument),
                EMPTY_ARRAY
            ];
        }

        return genericMetadatas;
    }
}
