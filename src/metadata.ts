import { isArray, isNil, isString } from 'lodash';
import { Alias } from './alias';
import { isArrowFunction } from './functions/is-arrow-function';
import { GenericArgument } from './generic-argument';
import { GenericMetadata } from './generic-metadata';
import { GenericMetadataResolver } from './generic-metadata-resolver';
import { GenericStructure } from './generic-structure';
import { TypeArgument } from './type-argument';
import { TypeFn } from './type-fn';
import { TypeMetadata } from './type-metadata';
import { TypeMetadataExtractor } from './type-metadata-extractor';
import { TypeMetadataResolver } from './type-metadata-resolver';
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
     * Type metadata extractor.
     * 
     * @type {TypeMetadataExtractor<any>}
     */
    public readonly typeMetadataExtractor: TypeMetadataExtractor<any>;
    
    /**
     * Type function map for types with aliases.
     * 
     * @type {Map<Alias, TypeFn<any>>}
     */
    public readonly typeFnMap: Map<Alias, TypeFn<any>>;

    /**
     * Constructor.
     * 
     * @param {TypeMetadataExtractor<any>} typeMetadataExtractor Type metadata extractor.
     * @param {Map<Alias, TypeFn<any>>} typeFnMap Type function map.
     */
    public constructor(
        typeMetadataExtractor: TypeMetadataExtractor<any>,
        typeFnMap: Map<Alias, TypeFn<any>>
    )
    {
        this.typeMetadataExtractor = typeMetadataExtractor;
        this.typeFnMap = typeFnMap;

        return;
    }

    /**
     * Defines type metadata resolver for provided type argument.
     * 
     * @param {TypeArgument<any>} typeArgument Type argument.
     * 
     * @returns {TypeMetadataResolver<any>} Defined type metadata resolver.
     */
    public defineTypeMetadataResolver(typeArgument: TypeArgument<any>): TypeMetadataResolver<any>
    {
        if (isNil(typeArgument))
        {
            return this.resolveTypeMetadataUsingUnknownTypeFn.bind(this);
        }

        if (isString(typeArgument))
        {
            return this.resolveTypeMetadataUsingAlias.bind(this);
        }

        if (isArrowFunction(typeArgument))
        {
            return this.resolveTypeMetadataUsingTypeResolver.bind(this);
        }

        return this.resolveTypeMetadataUsingTypeFn.bind(this);
    }

    /**
     * Resolves type metadata using unknown type function.
     * 
     * @returns {TypeMetadata<any>} Type metadata resolved using unknown type function.
     */
    private resolveTypeMetadataUsingUnknownTypeFn(): TypeMetadata<any>
    {
        const typeFn = Unknown as TypeFn<any>;
        
        return this.typeMetadataExtractor(typeFn);
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

        if (isNil(typeFn))
        {
            throw new Error(`Cannot resolve type metadata for provided type alias: ${alias}. This is usually caused by invalid configuration.`);
        }

        return this.typeMetadataExtractor(typeFn);
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

        return this.typeMetadataExtractor(typeFn);
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

        return this.typeMetadataExtractor(typeResolver());
    }

    /**
     * Defines generic structures based on generic arguments.
     * 
     * @param {Array<GenericArgument<any>>} genericArguments Generic arguments.
     * 
     * @returns {Array<GenericStructure<any>>} Generic structures.
     */
    public defineGenericStructures(genericArguments: Array<GenericArgument<any>>): Array<GenericStructure<any>>
    {
        const genericStructures = new Array<GenericStructure<any>>();

        for (const genericArgument of genericArguments)
        {
            const genericTypeArgument = isArray(genericArgument) ? genericArgument[0] : genericArgument;
            const genericGenericArguments = isArray(genericArgument) ? genericArgument[1] : new Array<GenericArgument<any>>();
            
            genericStructures.push([
                genericTypeArgument,
                this.defineGenericStructures(genericGenericArguments)
            ]);
        }

        return genericStructures;
    }

    /**
     * Defines generic metadata resolvers based on provided generic structures.
     * 
     * @param {Array<GenericStructure<any>>} genericStructures Generic structures.
     * 
     * @returns {Array<GenericMetadataResolver<any>>} Generics metadata resolvers.
     */
    public defineGenericMetadataResolvers(genericStructures: Array<GenericStructure<any>>): Array<GenericMetadataResolver<any>>
    {
        const genericMetadataResolvers = new Array<GenericMetadataResolver<any>>();

        for (const genericStructure of genericStructures)
        {
            const genericTypeArgument = genericStructure[0];
            const genericGenericStructures = genericStructure[1];
            
            genericMetadataResolvers.push([
                this.defineTypeMetadataResolver(genericTypeArgument), 
                this.defineGenericMetadataResolvers(genericGenericStructures)
            ]);
        }

        return genericMetadataResolvers;
    }

    /**
     * Defines generic metadatas based on provided generic structures and metadata resolvers.
     * 
     * @param {Array<GenericStructure<any>>} genericStructures Generic structures.
     * @param {Array<GenericMetadataResolver<any>>} genericMetadataResolvers Generic metadata resolvers.
     * 
     * @returns {Array<GenericMetadata<any>>} Generics metadatas.
     */
    public defineGenericMetadatas(
        genericStructures: Array<GenericStructure<any>>, 
        genericMetadataResolvers: Array<GenericMetadataResolver<any>>
    ): Array<GenericMetadata<any>>
    {
        const genericMetadatas = new Array<GenericMetadata<any>>();

        for (let i = 0; i < genericStructures.length; i++)
        {
            const genericTypeArgument = genericStructures[i][0];
            const genericMetadataResolver = genericMetadataResolvers[i][0];
            const genericGenericStructures = genericStructures[i][1];
            const genericGenericMetadataResolvers = genericMetadataResolvers[i][1];

            genericMetadatas.push([
                genericMetadataResolver(genericTypeArgument),
                this.defineGenericMetadatas(genericGenericStructures, genericGenericMetadataResolvers)
            ]);
        }

        return genericMetadatas;
    }
}
