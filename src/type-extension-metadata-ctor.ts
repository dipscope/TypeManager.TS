import { TypeExtensionMetadata } from './type-extension-metadata';
import { TypeExtensionOptions } from './type-extension-options';
import { TypeMetadata } from './type-metadata';

/**
 * Type extension metadata constructor.
 * 
 * @type {TypeExtensionMetadataCtor<TTypeExtensionMetadata, TTypeExtensionOptions, TObject>}
 */
export type TypeExtensionMetadataCtor<
    TTypeExtensionMetadata extends TypeExtensionMetadata<TObject, TTypeExtensionOptions>, 
    TTypeExtensionOptions extends TypeExtensionOptions,
    TObject
> = new (
    typeMetadata: TypeMetadata<TObject>, 
    typeExtensionOptions: TTypeExtensionOptions
) => TTypeExtensionMetadata;
