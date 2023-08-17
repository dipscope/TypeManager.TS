import { PropertyExtensionMetadata } from './property-extension-metadata';
import { PropertyExtensionOptions } from './property-extension-options';
import { PropertyMetadata } from './property-metadata';

/**
 * Property extension metadata constructor.
 * 
 * @type {PropertyExtensionMetadataCtor<TPropertyExtensionMetadata, TPropertyExtensionOptions, TDeclaringType, TType>}
 */
export type PropertyExtensionMetadataCtor<
    TPropertyExtensionMetadata extends PropertyExtensionMetadata<TDeclaringType, TType, TPropertyExtensionOptions>, 
    TPropertyExtensionOptions extends PropertyExtensionOptions, 
    TDeclaringType, 
    TType
> = new (
    propertyMetadata: PropertyMetadata<TDeclaringType, TType>, 
    propertyExtensionOptions: TPropertyExtensionOptions
) => TPropertyExtensionMetadata;
