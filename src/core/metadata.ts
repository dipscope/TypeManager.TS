import { Fn } from './fn';
import { GenericArgument } from './generic-argument';
import { GenericMetadata } from './generic-metadata';
import { TypeArgument } from './type-argument';
import { TypeMetadata } from './type-metadata';
import { TypeMetadataResolver } from './type-metadata-resolver';

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
     * Type metadata resolver.
     * 
     * @type {TypeMetadataResolver<any>}
     */
    public readonly typeMetadataResolver: TypeMetadataResolver<any>;

    /**
     * Constructor.
     * 
     * @param {TypeMetadataResolver<any>} typeMetadataResolver Type metadata resolver.
     */
    public constructor(typeMetadataResolver: TypeMetadataResolver<any>)
    {
        this.typeMetadataResolver = typeMetadataResolver;

        return;
    }

    /**
     * Defines type metadata based on provided type argument.
     * 
     * @param {TypeArgument<any>} typeArgument Type argument.
     * 
     * @returns {TypeMetadata<any>} Type metadata.
     */
    protected defineTypeMetadata(typeArgument: TypeArgument<any>): TypeMetadata<any>
    {
        return this.typeMetadataResolver(typeArgument);
    }

    /**
     * Defines generic metadatas based on provided generic arguments.
     * 
     * @param {Array<GenericArgument<any>>} genericArguments Generic arguments.
     * 
     * @returns {Array<GenericMetadata<any>>} Generics metadatas.
     */
    protected defineGenericMetadatas(genericArguments: Array<GenericArgument<any>>): Array<GenericMetadata<any>>
    {
        const genericMetadatas = new Array<GenericMetadata<any>>();

        for (const genericArgument of genericArguments)
        {
            const genericTypeArgument = Fn.isArray(genericArgument) ? genericArgument[0] : genericArgument;
            const genericGenericArguments = Fn.isArray(genericArgument) ? genericArgument[1] : new Array<GenericArgument<any>>();
            
            genericMetadatas.push([this.defineTypeMetadata(genericTypeArgument), this.defineGenericMetadatas(genericGenericArguments)]);
        }

        return genericMetadatas;
    }
}
