import { TypeExtensionMetadata } from './type-extension-metadata';
import { TypeExtensionOptions } from './type-extension-options';
import { TypeMetadata } from './type-metadata';

/**
 * Type extension metadata constructor.
 * 
 * @type {TypeExtensionMetadataCtor<TTypeExtensionMetadata, TTypeExtensionOptions, TType>}
 */
export type TypeExtensionMetadataCtor<
    TTypeExtensionMetadata extends TypeExtensionMetadata<TType, TTypeExtensionOptions>, 
    TTypeExtensionOptions extends TypeExtensionOptions,
    TType
> = new (
    typeMetadata: TypeMetadata<TType>, 
    typeExtensionOptions: TTypeExtensionOptions
) => TTypeExtensionMetadata;
